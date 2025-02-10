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

  const fetchStationsData = useCallback(async () => {
    try {
      setLoading(true);
      const devices = await sensorAPI.getAll();
      const stationData = await Promise.all(
        devices.map(async (device) => {
          const metrics = await airQualityAPI.getByLocation(device.location_id);
          const locationInfo = await locationAPI.getById(device.location_id);
          
          if (!metrics.length) return null;
          
          const sortedMetrics = [...metrics].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
console.log(locationInfo);
          return {
            id: locationInfo.location_id,
            location: locationInfo.name,
            city: locationInfo.city,
            region: locationInfo.region,
            lastUpdate: new Date(sortedMetrics[0].timestamp),
            gases: GAS_TYPES.map(gasType => ({
              type: gasType.label,
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
 useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/connexion");
          }
      }, [navigate]);
  if (loading) {
    return <p>Chargement des données des stations...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  const handleDeviceClick=(locationId)=>{
    navigate(`/real-time/${locationId}`);
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
                        labels: gas.historical.map(entry => entry.timestamp.toLocaleTimeString()),
                        datasets: [{
                          label: gas.type,
                          data: gas.historical.map(entry => entry.level),
                          borderColor: `hsl(${index * 60}, 70%, 50%)`,
                          tension: 0.3,
                          borderWidth: 2
                        }]
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,  // Important pour que la hauteur définie fonctionne
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
