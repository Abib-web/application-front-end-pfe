import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { airQualityAPI } from "../../api/airQuality";
import { sensorAPI } from "../../api/sensors";
import { locationAPI } from "../../api/location";
import "./StationsHistory.css";

const GAS_TYPES = [
  { id: "co_level", label: "CO" },
  { id: "no2_level", label: "NO₂" },
  { id: "pm25_level", label: "PM2.5" },
  { id: "pm10_level", label: "PM10" },
  { id: "temperature", label: "Température" },
  { id: "humidity", label: "Humidité" },
];

const StationsHistory = () => {
  const [stations, setStations] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const devices = await sensorAPI.getAll();
        const stationData = await Promise.all(
          devices.map(async (device) => {
            const metrics = await airQualityAPI.getByLocation(device.location_id);
            const locationInfo = await locationAPI.getById(device.location_id);

            if (!metrics.length) return null;
            return {
              id: device.location_id,
              location: locationInfo.name,
              city: locationInfo.city,
              region: locationInfo.region,
              historical: metrics.map((entry) => ({
                timestamp: new Date(entry.timestamp).toLocaleString(),
                values: GAS_TYPES.map((gas) => ({
                  type: gas.label,
                  level: entry[gas.id] || 0,
                })),
              })),
            };
          })
        );
        setStations(stationData.filter((station) => station !== null));
      } catch (error) {
        console.error("Erreur lors de la récupération des stations:", error);
      }
    };

    fetchStations();
  }, []);
useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/connexion");
          }
      }, [navigate]);
  const selectedStation = stations.find((station) => station.id === selectedStationId);
  const handleStationClick = (stationId) => {
    setSelectedStationId((prevId) => (prevId === stationId ? null : stationId));
  };
  
  return (
    <div className="history-container">
      <div className="station-list">
      {stations.map((station) => (
        <div
          key={station.id}
          className={`station-item ${selectedStationId === station.id ? "selected" : ""}`}
          onClick={() => handleStationClick(station.id)}
        >
          {station.location} - {station.city}, {station.region}
        </div>
      ))}

      </div>

      <div className="history-content">
  {selectedStation ? (
    <>
      <h3>Historique de {selectedStation.location}</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Horodatage</th>
              {GAS_TYPES.map((gas) => (
                <th key={gas.id}>{gas.label}</th> 
              ))}
            </tr>
          </thead>
          <tbody>
            {selectedStation.historical.map((entry, index) => (
              <tr key={index}>
                <td>{entry.timestamp}</td>
                {entry.values.map((gas, i) => (
                  <td key={`${index}-${i}`}>{gas.level}</td> 
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  ) : (
    <p>Sélectionnez une station pour voir l'historique</p>
  )}
</div>
    </div>
  );
};

export default StationsHistory;
