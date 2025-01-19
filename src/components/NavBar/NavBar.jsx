import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';
import { FaHome, FaClock, FaChartLine, FaHistory, FaBell, FaCog } from 'react-icons/fa';

const NavBar = () => {
    const navItems = [
        { icon: <FaHome />, label: 'Home', to: '/' },
        { icon: <FaClock />, label: 'Real Time', to: '/real-time' },
        { icon: <FaChartLine />, label: 'Tendances', to: '/tendances' },
        { icon: <FaHistory />, label: 'Historiques', to: '/historiques' },
        { icon: <FaBell />, label: 'Alertes', to: '/alertes' },
        { icon: <FaCog />, label: 'Paramètres', to: '/parametres' }
    ];

    return (
        <div className="navbar">
            {navItems.map((item, index) => (
                <div key={index} className="nav-item">
                    <Link to={item.to} className="nav-link">
                        {item.icon}
                        <span>{item.label}</span>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default NavBar;
