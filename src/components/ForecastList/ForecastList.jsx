import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForecastList.css';

const ForecastList = () => {
    const navigate = useNavigate(); 
    const forecasts = [
        { place: 'UQTR', model: 'Model A', forecast: 'Pollution faible', time: '12:00 PM' },
        { place: 'Centre ville', model: 'Model B', forecast: 'Pollution élevée', time: '3:00 PM' },
        { place: 'Parc industriel', model: 'Model C', forecast: 'Pollution modérée', time: '6:00 PM' }
    ];
    const handleDeviceClick = (locationId) => {
        navigate(`/tendances/${locationId}`);
    };
    return (
        <div className="forecast-list">
            <h2>Prévisions</h2>
            <ul>
                {forecasts.map((forecast, index) => (
                    <li key={index} className="forecast-item" onClick={() => handleDeviceClick(forecast.place)}>
                        <h3>{forecast.place}</h3>
                        <p>Modèle : {forecast.model}</p>
                        <p>Prévision : {forecast.forecast}</p>
                        <p>Heure : {forecast.time}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ForecastList;
