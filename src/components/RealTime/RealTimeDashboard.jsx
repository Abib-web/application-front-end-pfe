import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { airQualityAPI } from '../../api/airQuality';
import { sensorAPI } from '../../api/sensors';
import { locationAPI } from '../../api/location';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'chart.js/auto';
import './StationsDashboard.css';

const GAS_TYPES = [
  { id: 'co_level', label: 'CO' },
  { id: 'no2_level', label: 'NO₂' },
  { id: 'pm25_level', label: 'PM2.5' },
  { id: 'pm10_level', label: 'PM10' },
  { id: 'temperature', label: 'Température' },
  { id: 'humidity', label: 'Humidité' }
];

const StationsDashboard = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupération initiale des données des stations
  const fetchStationsData = useCallback(async () => {
    try {
      setLoading(true);
      const devices = await sensorAPI.getAll();
      const stationData = await Promise.all(
        devices.map(async (device) => {
          const metrics = await airQualityAPI.getByLocation(device.location_id);
          const locationInfo = await locationAPI.getById(device.location_id);
          if (!metrics.length) return null;
          const sortedMetrics = [...metrics].sort(
            (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
          );
          return {
            id: locationInfo.location_id,
            location: locationInfo.name,
            city: locationInfo.city,
            region: locationInfo.region,
            lastUpdate: new Date(sortedMetrics[0].timestamp),
            gases: GAS_TYPES.map(gasType => ({
              type: gasType.label,
              // On récupère l'historique complet depuis le backend
              historical: sortedMetrics.map(entry => ({
                timestamp: new Date(entry.timestamp),
                level: entry[gasType.id] || 0
              }))
            }))
          };
        })
      );
      setStations(stationData.filter(station => station !== null));
    } catch (err) {
      setError(`Erreur: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStationsData();
    const interval = setInterval(fetchStationsData, 30000);
    return () => clearInterval(interval);
  }, [fetchStationsData]);

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/connexion");
    }
  }, [navigate]);

  // Mise à jour incrémentale : pour chaque station et chaque gaz, ajoute une nouvelle valeur à l'historique toutes les secondes.
  // Ici, on met à jour l'état "stations" en ajoutant, pour chaque gaz, une nouvelle valeur qui s'ajoute à la fin du tableau historical.
  useEffect(() => {
    const interval = setInterval(() => {
      setStations(prevStations =>
        prevStations.map(station => {
          const updatedGases = station.gases.map(gas => {
            // On récupère la dernière valeur du tableau (la plus récente)
            const lastValue = gas.historical[gas.historical.length - 1]?.level || 0;
            // Variation aléatoire entre -1 et +1
            const randomVariation = (Math.random() - 0.5) * 2;
            const newLevel = lastValue + randomVariation;
            // Création d'une nouvelle entrée avec le timestamp actuel
            const newEntry = { timestamp: new Date(), level: newLevel };
            // Vous pouvez laisser l'historique complet ou, si vous souhaitez limiter l'historique, utiliser .slice(-10)
            const newHistorical = [...gas.historical, newEntry];
            return {
              ...gas,
              historical: newHistorical
            };
          });
          return { ...station, gases: updatedGases, lastUpdate: new Date() };
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDeviceClick = (locationId) => {
    navigate(`/real-time/${locationId}`);
  };

  if (loading) {
    return <p>Chargement des données des stations...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="container-fluid mt-4">
      <h1 className="text-center mb-4">Surveillance en temps réel des stations</h1>
      <div className="row g-4">
        {stations.map((station) => (
          <div key={station.id} className="col-12 col-md-6 col-lg-4">
            <div className="card shadow-sm">
              <div className="card-header bg-primary text-white" onClick={() => handleDeviceClick(station.id)}>
                <h5 className="mb-0">
                  <FaMapMarkerAlt className="me-2" />
                  {station.location} - {station.city}, {station.region}
                </h5>
              </div>
              <div className="card-body">
                {station.gases.map((gas, index) => (
                  <div key={index} className="mb-3">
                    <h6>{gas.type}</h6>
                    <div className="chart-container">
                      <Line
                        data={{
                          labels: gas.historical.map(entry =>
                            entry.timestamp.toLocaleTimeString()
                          ),
                          datasets: [{
                            label: gas.type,
                            data: gas.historical.map(entry => entry.level),
                            borderColor: `hsl(${index * 60}, 70%, 50%)`,
                            tension: 0.3,
                      borderWidth: 2,
                      pointRadius: 0,
                      pointHoverRadius: 0
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: { legend: { display: false } },
                          scales: { 
                            x: { grid: { display: false } },
                            y: { beginAtZero: true }
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StationsDashboard;
