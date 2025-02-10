import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import './DeviceList.css';
import { locationAPI } from '../../api/location';
import { airQualityAPI } from '../../api/airQuality';

const DeviceList = () => {
    const navigate = useNavigate();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Configuration des gaz par dispositif
    const gasConfig = {
        1: ['co_level', 'no2_level'],
        2: ['pm25_level', 'pm10_level'],
        3: ['temperature', 'humidity'],
        4: ['co_level', 'pm10_level']
    };

    const fetchDevices = useCallback(async () => {
        try {
            const locations = await locationAPI.getAll();
            setDevices(locations);
        } catch (err) {
            setError("Erreur lors de la récupération des dispositifs.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchGasesForDevice = useCallback(async (locationId, gasKeys) => {
        try {
            const metrics = await airQualityAPI.getAll({ location_id: locationId });
            
            if (!metrics.length) {
                console.warn(`Aucune donnée disponible pour le dispositif ${locationId}`);
                return null;
            }

            return gasKeys.map(key => {
                const values = metrics.map(m => m[key]).filter(v => !isNaN(v));
                return values.length ? 
                    values.reduce((a, b) => a + b, 0) / values.length :
                    null;
            });
        } catch (err) {
            console.error(`Erreur lors de la récupération des métriques`, err);
            return null;
        }
    }, []);

    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);
    
    const getStatusColor = useCallback((level) => {
        if (!level) return 'gray';
        if (level >= 150) return 'red';
        if (level >= 75) return 'orange';
        return 'green';
    }, []);

    const handleDeviceClick = (locationId) => {
        navigate(`/real-time/${locationId}`);
    };

    if (loading) return <div className="loading">Chargement des dispositifs...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="device-list">
            <h2>Liste des Dispositifs</h2>
            {devices.slice(0,3).map((device) => (
                <div
                    key={device.location_id}
                    className="device-item"
                    onClick={() => handleDeviceClick(device.location_id)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="device-info">
                        <h3>{device.name}</h3>
                        <p>{device.city}, {device.region}</p>
                    </div>
                    <div className="gases-info">
                        <GasLevelDisplay
                            locationId={device.location_id}
                            gasKeys={gasConfig[device.location_id] || []}
                            fetchGases={fetchGasesForDevice}
                            getStatusColor={getStatusColor}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

const GasLevelDisplay = React.memo(({ locationId, gasKeys, fetchGases, getStatusColor }) => {
    const [averages, setAverages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!locationId || !gasKeys.length) return;

        const loadData = async () => {
            setLoading(true);
            try {
                const results = await fetchGases(locationId, gasKeys);
                setAverages(results || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [locationId, gasKeys, fetchGases]);

    if (loading) return <div className="loading">Chargement des données...</div>;
    if (!averages.length) return <div>Aucune donnée disponible</div>;

    return (
        <>
            {averages.map((level, idx) => (
                <div key={`${gasKeys[idx]}-${locationId}`} className="circle-gauge">
                    <svg width="60" height="60" viewBox="0 0 36 36" className="circular-chart">
                        <path
                            className="circle-bg"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                            className="circle"
                            stroke={getStatusColor(level)}
                            strokeDasharray={`${level || 0}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                    </svg>
                    <div className="gas-info">
                        <p className="value">
                            <span>{level !== null ? level.toFixed(1) : 'N/A'}</span>
                            <span className="unit">
                                {gasKeys[idx].includes('temperature') ? '°C' : 
                                gasKeys[idx].includes('humidity') ? '%' : 'ppm'}
                            </span>
                        </p>
                        <p className="gas-type">
                            {getGasLabel(gasKeys[idx])}
                        </p>
                    </div>
                </div>
            ))}
        </>
    );
});

// Helper pour les libellés des gaz
const getGasLabel = (key) => {
    const labels = {
        co_level: 'CO',
        no2_level: 'NO₂',
        pm25_level: 'PM2.5',
        pm10_level: 'PM10',
        temperature: 'Température',
        humidity: 'Humidité'
    };
    return labels[key] || key;
};

export default DeviceList;