import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import { FaLocationArrow } from 'react-icons/fa'; // Import de l'icône
import 'chart.js/auto';
import './DeviceDetails.css';

const DeviceDetails = () => {
    const { deviceName } = useParams();
    const [deviceData, setDeviceData] = useState(null);
    const [values, setValues] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = {
                name: deviceName,
                location: 'Montreal, Canada',
                gases: [
                    { type: 'CO2', level: 90 },
                    { type: 'NO2', level: 40 },
                    { type: 'PM2.5', level: 60 },
                    { type: 'O3', level: 50 },
                    { type: 'SO2', level: 30 },
                    { type: 'CO', level: 25 },
                    { type: 'CH4', level: 35 },
                    { type: 'VOC', level: 15 },
                    { type: 'NH3', level: 10 }
                ],
                predictions: 'High pollution expected in the next 24 hours',
                advice: 'Avoid outdoor activities during peak hours.'
            };
            setDeviceData(data);
            setValues(data.gases);
        };
        fetchData();
    }, [deviceName]);
    // Données du graphique des prédictions
    const predictionData = {
        labels: ['0h', '6h', '12h', '18h', '24h'], // Étiquettes pour les heures
        datasets: [
            {
                label: 'Pollution Prediction',
                data: [80, 100, 120, 140, 160], // Valeurs de pollution sur 24 heures
                borderColor: '#ff6347',
                fill: false,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: '#ff6347'
            }
        ]
    };

    // Options du graphique
    const predictionOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setValues((prevValues) =>
                prevValues.map((gas) => ({
                    ...gas,
                    level: gas.level + Math.floor(Math.random() * 5) - 2
                }))
            );
        }, 1800000); // Update every 30 minutes

        return () => clearInterval(interval);
    }, []);

    if (!deviceData) return <p>Loading...</p>;

    return (
        <div className="device-details">
            <h2>Détails de {deviceData.name}</h2>

                {/* Localisation avec icône */}
                <p>
                    <FaLocationArrow /> <strong>Location:</strong> {deviceData.location}
                </p>

                <h3>Gases Information</h3>

                {/* Table de gaz */}
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th>Gaz</th>
                            <th>Level (ppm)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {values.map((gas, index) => (
                            <tr key={index}>
                                <td>{gas.type}</td>
                                <td>{gas.level}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            <h3>Gases Trends</h3>
            {/* Conteneur flex pour aligner les graphiques en ligne */}
            <div className="charts-row">
                {values.map((gas, index) => {
                    // Chart data for each gas
                    const chartData = {
                        labels: ['10:00', '10:30', '11:00', '11:30', '12:00'], // Example time labels
                        datasets: [{
                            label: gas.type,
                            data: [
                                gas.level - 10 + index,
                                gas.level - 5 + index,
                                gas.level,
                                gas.level + 5 - index,
                                gas.level + 10 - index
                            ],
                            borderColor: `hsl(${index * 40}, 70%, 50%)`,
                            fill: false,
                            tension: 0.3,
                            borderWidth: 2,
                            pointRadius: 4,
                            pointBackgroundColor: `hsl(${index * 40}, 70%, 50%)`
                        }]
                    };

                    const chartOptions = {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        }
                    };

                    return (
                        <div key={index} className="chart-container">
                            <h4>{gas.type} Trend</h4>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    );
                })}
            </div>
            <h3>Predictions</h3>
                <div className="prediction-container">
                    <div className="prediction-chart">
                        {/* Ajoute un graphique, si nécessaire */}
                        {/* Ex: Un graphique linéaire représentant les prédictions sur une période */}
                        {/* Utilisation de Chart.js, par exemple */}
                        <Line data={predictionData} options={predictionOptions} />
                    </div>
                    <p>{deviceData.predictions}</p>
                </div>

                <h3>Advice</h3>
                <div className="advice-container">
                    <div className="advice-icons">
                        {/* Ajoute des icônes pour rendre les conseils visuellement plus clairs */}
                        <div className="advice-item">
                            <i className="fas fa-sun"></i>
                            <p>Avoid outdoor activities in peak hours.</p>
                        </div>
                        <div className="advice-item">
                            <i className="fas fa-mask"></i>
                            <p>Consider wearing a mask if pollution levels are high.</p>
                        </div>
                    </div>
                    <p>{deviceData.advice}</p>
                </div>

        </div>
    );
};

export default DeviceDetails;
