// src/pages/Home.js
import React, { useEffect } from 'react';
import './styles/Home.css';
import RiskMap from '../components/RiskMap/RiskMap';
import DeviceList from '../components/DeviceList/DeviceList';
import ForecastList from '../components/ForecastList/ForecastList';
import { useTheme } from '../contexts/ThemeContext';

const Home = () => {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        console.log('Home component mounted');
    }, []);

    return (
        <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
            <div className="home-content">
                <div className="body-content">
                    <RiskMap />
                    <DeviceList />
                    <ForecastList />
                </div>
            </div>
        </div>
    );
};

export default Home;
