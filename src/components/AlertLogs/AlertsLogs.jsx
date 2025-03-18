import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AlertsLogs.css";
import { alertAPI } from "../../api/alerts";

const AlertsLogs = () => {
  const [alerts, setAlerts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    alertAPI.getAll().then(setAlerts).catch(console.error);
  }, []);

  const markAsRead = async (alertId) => {
    try {
      await alertAPI.markAsRead(alertId);
      setAlerts(prevAlerts =>
        prevAlerts.map(alert =>
          alert.id === alertId ? { ...alert, read: true } : alert
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'alerte :", error);
    }
  };
useEffect(() => {
          const token = localStorage.getItem("token");
          if (!token) {
              navigate("/connexion");
          }
        }, [navigate]);
  return (
    <div className="alerts-container">
      <h2>Alerts Logs</h2>
      <table className="alerts-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Timestamp</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(alert => (
            <tr key={alert.id} className={`severity-${alert.severity.toLowerCase()}`}>
              <td>{alert.id}</td>
              <td>{alert.type}</td>
              <td>{alert.message}</td>
              <td>{alert.severity}</td>
              <td>{new Date(alert.timestamp).toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => markAsRead(alert.id)} 
                  disabled={alert.read}
                  className={alert.read ? "read" : "unread"}
                >
                  {alert.read ? "Déjà lu" : "Marquer comme lu"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsLogs;
