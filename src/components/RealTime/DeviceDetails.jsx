import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { FaLocationArrow } from 'react-icons/fa';
import { airQualityAPI } from '../../api/airQuality';
import { sensorAPI } from '../../api/sensors';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import './DeviceDetails.css';
import { locationAPI } from '../../api/location';
import { useNavigate } from 'react-router-dom';


const GAS_TYPES = [
  { id: 'co_level', label: 'CO' },
  { id: 'no2_level', label: 'NO₂' },
  { id: 'pm25_level', label: 'PM2.5' }, // Correction du nom de champ
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

  const chartRefs = useRef([]);
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
  
    const intervals = GAS_TYPES.map((_, index) => {
      return setInterval(() => {
        setDeviceData(prevData => {
          if (!prevData) return prevData;
  
          return {
            ...prevData,
            gases: prevData.gases.map((gas, i) => {
              if (i === index) {
                // Récupère la dernière valeur historique
                const lastEntry = gas.historical[0]?.level || gas.currentLevel;
                // Génère une nouvelle variation basée sur la dernière valeur
                const randomVariation = (Math.random() - 0.5) * 2; // Variation plus réaliste
                const newLevel = lastEntry + randomVariation;
  
                const updatedGas = {
                  ...gas,
                  currentLevel: newLevel,
                  historical: [
                    { timestamp: new Date(), level: newLevel }, // Nouvelle entrée en première position
                    ...gas.historical,
                  ].slice(0, 10) // Garde les 10 premières entrées
                };
  
                // Met à jour le graphique correspondant
                if (chartRefs.current[index]) {
                  const chart = chartRefs.current[index];
                  chart.data.labels = updatedGas.historical.map(entry =>
                    entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  );
                  chart.data.datasets[0].data = updatedGas.historical.map(entry => entry.level);
                  chart.update(); // Met à jour le graphique
                }
  
                return updatedGas;
              }
              return gas;
            })
          };
        });
      }, 3000); // Intervalle de 3 secondes pour une meilleure visibilité
    });
  
    return () => intervals.forEach(clearInterval);
  }, [fetchDeviceData]);

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
                    <div className="display-6 text-${status}">
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

  const renderHistoricalData = () => {
    const selectedGasData = deviceData?.gases?.find(g => g.type === selectedGas);
    const last10Readings = selectedGasData?.historical?.slice(0, 10) || [];

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
                    <td>{entry.timestamp?.toLocaleTimeString([], { timeStyle: 'short' })}</td>
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
                  ref={(el) => (chartRefs.current[index] = el)} // Référence au graphique
                  data={{
                    labels: gas.historical?.map(entry =>
                      entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    ),
                    datasets: [{
                      label: 'Niveau',
                      data: gas.historical?.map(entry => entry.level),
                      borderColor: `hsl(${index * 90}, 70%, 50%)`,
                      tension: 0.3,
                      borderWidth: 2
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false
                      }
                    },
                    scales: {
                      x: {
                        grid: { display: false },
                        ticks: { maxRotation: 45 }
                      },
                      y: {
                        beginAtZero: false,
                        grid: { color: '#f8f9fa' }
                      }
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
  const navigate = useNavigate();
  useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/connexion");
          }
      }, [navigate]);
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