import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../redux/authSlice";
import { FaHome, FaClock, FaChartLine, FaHistory, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true); // Pour éviter que le bouton clignote au chargement
    }, [user]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const navItems = [
        { icon: <FaHome />, label: 'Home', to: '/' },
        { icon: <FaClock />, label: 'Temps Réel', to: '/real-time' },
        { icon: <FaChartLine />, label: 'Tendances', to: '/tendances' },
        { icon: <FaHistory />, label: 'Historiques', to: '/history' },
        { icon: <FaBell />, label: 'Alertes', to: '/alertes' },
        { icon: <FaCog />, label: 'Paramètres', to: '/parametres' },
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

            {isLoaded && user && ( // Vérifie que l'authentification a bien été chargée
                <div className="nav-item logout">
                    <button onClick={handleLogout} className="nav-link logout-button">
                        <FaSignOutAlt />
                        <span>Déconnexion</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default NavBar;
