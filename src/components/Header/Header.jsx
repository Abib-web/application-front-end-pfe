// Header.js
import React, { useEffect, useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import * as Popover from "@radix-ui/react-popover";
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate
import { alertAPI } from '../../api/alerts';
import { logoutUser } from "../../redux/authSlice";
import './Header.css';

const Header = () => {
  const { toggleTheme } = useTheme();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate(); // Hook pour la navigation
  const [alerts, setAlerts] = useState([]);
  const [unreadAlerts, setUnreadAlerts] = useState(new Set());
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await alertAPI.getAll();
        const activeAlerts = data.filter(alert => !alert.resolved);
        setAlerts(activeAlerts);

        // Ajouter toutes les nouvelles alertes aux non lues
        setUnreadAlerts(new Set(activeAlerts.map(alert => alert.id)));
      } catch (error) {
        console.error("Erreur lors de la récupération des alertes:", error);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Rafraîchit toutes les 60s

    return () => clearInterval(interval);
  }, []);

  // Marquer une alerte comme lue et rediriger vers la page des alertes
  const handleAlertClick = (alertId) => {
    setUnreadAlerts(prev => {
      const newSet = new Set(prev);
      newSet.delete(alertId);
      return newSet;
    });

    navigate('/alertes'); // Redirection vers la page des alertes
  };
  const handleLogin = () => {
    if (user) return;
    navigate('/connexion');
  }
  const handleLogout = () => {
    dispatch(logoutUser()); 
  }
  return (
    <header>
      <a href="/" className="logo">AirQuality</a>
      {user && <div className="hello-user">Salut, {user.name} 👋</div>}
      <div className='right'>
        <label className="switch">
          <input type="checkbox" onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
        {!user && <div className="connexion" onClick={handleLogin}>Connexion</div>}
      
        {user && (
          <div className="flex items-center gap-4">
            {/* Icône de notification avec compteur des non lues */}
            <Popover.Root>
              <Popover.Trigger className="relative">
                <FaBell size={24} />
                {unreadAlerts.size > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {unreadAlerts.size}
                  </span>
                )}
              </Popover.Trigger>

              <Popover.Content className="bg-white shadow-lg rounded-md p-4 w-64">
                {alerts.length === 0 ? (
                  <p className="text-sm text-gray-500">✅ Aucune alerte active.</p>
                ) : (
                  <ul className="text-sm">
                    {alerts.map((alert) => (
                      <li
                        key={alert.id}
                        className={`mb-2 border-b pb-2 cursor-pointer ${unreadAlerts.has(alert.id) ? "font-bold text-red-500" : "text-gray-700"}`}
                        onClick={() => handleAlertClick(alert.id)}
                      >
                        <strong>{alert.type}</strong>
                        <span className="block">{alert.message}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Popover.Close className="absolute top-1 right-1 text-gray-500 cursor-pointer">&times;</Popover.Close>
              </Popover.Content>
            </Popover.Root>

            
          
          </div>
              
      )}
      {user &&(
        <div className='logout' onClick={handleLogout}>
          <FaSignOutAlt size={24} color="black" />
        </div>
      )}
      </div>
    </header>
  );
};

export default Header;
