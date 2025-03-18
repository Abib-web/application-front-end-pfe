import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { FaLocationArrow } from 'react-icons/fa';
import { airQualityAPI } from '../../api/airQuality';
import { sensorAPI } from '../../api/sensors';
import { locationAPI } from '../../api/location';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import './DeviceDetails.css';

const GAS_TYPES = [
  { id: 'co_level', label: 'CO' },
  { id: 'no2_level', label: 'NO₂' },
  { id: 'pm25_level', label: 'PM2.5' },
  { id: 'pm10_level', label: 'PM10' },
  { id: 'temperature', label: 'Température' },
  { id: 'humidity', label: 'Humidité' }
];

const DeviceDetails = () => {
  const { id } = useParams();
  const [deviceData, setDeviceData] = useState(null);
  const [selectedGas, setSelectedGas] = useState(GAS_TYPES[0].label);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const chartRefs = useRef([]); // Références pour mettre à jour les graphiques

  // Récupération initiale des données depuis le backend
  const fetchDeviceData = useCallback(async () => {
    try {
      setLoading(true);
      const deviceInfo = await sensorAPI.getById(id);
      const metrics = await airQualityAPI.getByLocation(deviceInfo.location_id);
      if (!metrics.length) throw new Error('Aucune donnée historique trouvée');
      const locationInfo = await locationAPI.getById(deviceInfo.location_id);
      const sortedMetrics = [...metrics].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const transformedData = {
        deviceId: id,
        location: locationInfo.name,
        city: locationInfo.city,
        region: locationInfo.region,
        lastUpdate: new Date(sortedMetrics[0].timestamp),
        gases: GAS_TYPES.map(gasType => ({
          type: gasType.label,
          currentLevel: sortedMetrics[0][gasType.id] || 0,
          historical: sortedMetrics.map(entry => ({
            timestamp: new Date(entry.timestamp),
            level: entry[gasType.id]
          }))
        }))
      };
      setDeviceData(transformedData);
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDeviceData();
  }, [fetchDeviceData]);

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/connexion");
    }
  }, [navigate]);

  // Mise à jour incrémentale : ajouter une nouvelle valeur à la fin de l'historique pour chaque gaz toutes les secondes
  useEffect(() => {
    const interval = setInterval(() => {
      setDeviceData(prevData => {
        if (!prevData) return prevData;
        const updatedGases = prevData.gases.map((gas, i) => {
          // Récupérer la dernière valeur enregistrée (le dernier élément de l'historique)
          const lastEntry = gas.historical[gas.historical.length - 1]?.level || gas.currentLevel;
          // Calculer une nouvelle valeur en ajoutant une variation aléatoire
          const randomVariation = (Math.random() - 0.5) * 2; // Variation entre -1 et +1
          const newLevel = lastEntry + randomVariation;
          // Ajouter la nouvelle valeur à la fin de l'historique (on conserve l'historique complet)
          const newHistorical = [...gas.historical, { timestamp: new Date(), level: newLevel }];
  
          // Mise à jour du graphique associé, si la référence existe
          if (chartRefs.current[i]) {
            const chart = chartRefs.current[i];
            chart.data.labels = newHistorical.map(entry =>
              entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            );
            chart.data.datasets[0].data = newHistorical.map(entry => entry.level);
            chart.update();
          }
  
          return {
            ...gas,
            currentLevel: newLevel,
            historical: newHistorical
          };
        });
        return { ...prevData, gases: updatedGases, lastUpdate: new Date() };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const renderCurrentLevels = () => (
    <div className="card shadow">
      <div className="card-body">
        <h3 className="mb-3">
          Niveaux actuels
          <small className="text-muted ms-2">
            {deviceData?.lastUpdate?.toLocaleTimeString()}
          </small>
        </h3>
        <div className="row">
          {deviceData?.gases?.map((gas, index) => {
            const level = gas.currentLevel || 0;
            const status = level > 50 ? 'danger' : level > 30 ? 'warning' : 'success';
            return (
              <div key={index} className="col-6 col-md-3 mb-3">
                <div className={`card border-${status}`}>
                  <div className="card-body text-center">
                    <h5 className="card-title">{gas.type}</h5>
                    <div className={`display-6 text-${status}`}>
                      {level.toFixed(2)}
                      <small className="text-muted d-block">ppm</small>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // Pour l'affichage dans le tableau, on affiche uniquement les 10 dernières valeurs, avec la plus récente en haut.
  const renderHistoricalData = () => {
    const selectedGasData = deviceData?.gases?.find(g => g.type === selectedGas);
    // Récupérer les 10 dernières valeurs et inverser l'ordre pour afficher la plus récente en haut
    const last10Readings = (selectedGasData?.historical.slice(-10) || []).reverse();
    return (
      <div className="card shadow">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="mb-0">Historique des mesures</h3>
            <select
              className="form-select w-auto"
              value={selectedGas}
              onChange={(e) => setSelectedGas(e.target.value)}
            >
              {deviceData?.gases?.map(gas => (
                <option key={gas.type} value={gas.type}>{gas.type}</option>
              ))}
            </select>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Heure</th>
                  <th className="text-end">Valeur (ppm)</th>
                </tr>
              </thead>
              <tbody>
                {last10Readings.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.timestamp?.toLocaleDateString()}</td>
                    <td>{entry.timestamp?.toLocaleTimeString([], { timeStyle: 'long' })}</td>
                    <td className="text-end fw-bold">{entry.level?.toFixed(2)}</td>
                  </tr>
                ))}              
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderCharts = () => (
    <div className="row mt-4 g-4">
      {deviceData?.gases?.map((gas, index) => (
        <div key={gas.type} className="col-12 col-lg-6">
          <div className="card chart-card h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">{gas.type}</h5>
                <span className="badge bg-primary">
                  Dernière valeur: {gas.currentLevel?.toFixed(2)} ppm
                </span>
              </div>
              <div className="chart-container">
                <Line
                  ref={(el) => (chartRefs.current[index] = el)}
                  data={{
                    labels: gas.historical.map(entry =>
                      entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    ),
                    datasets: [{
                      label: 'Niveau',
                      data: gas.historical.map(entry => entry.level),
                      borderColor: `hsl(${index * 90}, 70%, 50%)`,
                      tension: 0.3,
                      borderWidth: 2,
                      pointRadius: 0,
                      pointHoverRadius: 0
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                      legend: { display: false }, 
                      tooltip: { mode: 'index', intersect: false }
                    },
                    scales: { 
                      x: { grid: { display: false }, ticks: { maxRotation: 45 } }, 
                      y: { beginAtZero: false, grid: { color: '#f8f9fa' } } 
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Chargement des données du capteur {id}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-card">
          <h3>⚠️ Erreur d'affichage</h3>
          <p>{error}</p>
          <div className="error-details">
            <p>Capteur ID: {id}</p>
            <p>Dernière mise à jour: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="device-dashboard container-fluid">
      <header className="device-header mb-4 bg-primary text-white rounded-3 p-4">
        <h1 className="display-6 mb-0">
          <FaLocationArrow className="me-2" />
          {deviceData?.location} - {deviceData?.city}, {deviceData?.region}
        </h1>
      </header>
      <div className="row g-4">
        <div className="col-12">{renderCurrentLevels()}</div>
        <div className="col-12">{renderHistoricalData()}</div>
        <div className="col-12">{renderCharts()}</div>
      </div>
    </div>
  );
};

export default DeviceDetails;
