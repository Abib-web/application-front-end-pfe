import React from 'react';
import './ForecastDetails.css';

const ForecastDetails = ({ forecast }) => {
    if (!forecast) {
        return (
            <div className="forecast-details error">
                <h2>Prévisions détaillées</h2>
                <p className="error-message">⚠️ Données non disponibles</p>
                <p className="error-code">Code d'erreur : 404</p>
            </div>
        );
    }

    return (
        <div className="forecast-details">
            <h2>Prévisions pour {forecast.place}</h2>
            <p><strong>Modèle :</strong> {forecast.model}</p>
            <p><strong>Prévision :</strong> {forecast.forecast}</p>
            <p><strong>Heure :</strong> {forecast.time}</p>
            <p><strong>Détails :</strong> {forecast.details}</p>
        </div>
    );
};

export default ForecastDetails;
