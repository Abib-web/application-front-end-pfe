import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DeviceList.css';

const DeviceList = () => {
    const navigate = useNavigate();
    
    const devices = [
        { 
            name: 'Dispositif A', 
            gases: [
                { type: 'CO2', level: 90 },
                { type: 'NO2', level: 40 }
            ] 
        },
        { 
            name: 'Dispositif B', 
            gases: [
                { type: 'PM2.5', level: 60 },
                { type: 'O3', level: 70 }
            ] 
        },
        { 
            name: 'Dispositif C', 
            gases: [
                { type: 'SO2', level: 30 },
                { type: 'NO2', level: 20 }
            ] 
        }
    ];

    const getStatusColor = (level) => {
        if (level >= 80) return 'red';
        if (level >= 50) return 'orange';
        return 'green';
    };

    const handleDeviceClick = (deviceName) => {
        navigate(`/device/${deviceName}`);
    };

    return (
        <div className="device-list">
            <h2>Liste des Dispositifs</h2>
            {devices.map((device, index) => (
                <div 
                    key={index} 
                    className="device-item" 
                    onClick={() => handleDeviceClick(device.name)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="device-info">
                        <h3>{device.name}</h3>
                    </div>
                    <div className="gases-info">
                        {device.gases.map((gas, gasIndex) => (
                            <div key={gasIndex} className="gas-item">
                                <span className="gas-info">
                                    <p>{gas.type}: {gas.level}%</p>
                                </span>
                                <div className="circle-gauge">
                                    <svg width="60" height="60" viewBox="0 0 36 36" className="circular-chart">
                                        <path
                                            className="circle-bg"
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                        <path
                                            className="circle"
                                            stroke={getStatusColor(gas.level)}
                                            strokeDasharray={`${gas.level}, 100`}
                                            d="M18 2.0845
                                            a 15.9155 15.9155 0 0 1 0 31.831
                                            a 15.9155 15.9155 0 0 1 0 -31.831"
                                        />
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default DeviceList;
