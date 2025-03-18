import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI } from "../api/users";
import { sensorAPI } from "../api/sensors";
import UserList from "../components/Admin/UserList";
import UserForm from "../components/Admin/UserForm";
import Spinner from "../components/Spinner/Spinner";
import { Modal, Button } from "react-bootstrap"; 
import "./styles/AdminPage.css";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [stats, setStats] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  document.title = 'Administration';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalsData = await userAPI.getStats();
        const usersData = await userAPI.getAllWithRoles();
        const rolesData = await userAPI.getAllRoles();
        const sensorsData = await sensorAPI.getAll();
        setStats(totalsData);
        setUsers(usersData);
        setRoles(rolesData);
        setSensors(sensorsData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        if (error.message.includes("401")) {
          setError("Votre session a expiré. Veuillez vous reconnecter.");
          navigate("/connexion");
        } else {
          setError("Une erreur s'est produite lors du chargement des données.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleAddUser = async (userData) => {
    try {
      const newUser = await userAPI.create(userData);
      setUsers([...users, newUser]);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      await userAPI.update(updatedUser.id, updatedUser);
      setUsers(users.map(user => (user.id === updatedUser.id ? updatedUser : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    al
    try {
      await userAPI.delete(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await userAPI.updateStatus(userId, newStatus);
      setUsers(users.map(user => (user.id === userId ? { ...user, isActive: newStatus } : user)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de l'utilisateur:", error);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-page">
      <h1>Tableau de bord</h1>
    
      {error && <div className="error-message">{error}</div>}
      <section className="admin-section">
        <h2>Statistiques</h2>
        <div className="stats-container">
          <div className="stat-item">
            <p>Nombre d'utilisateurs: {stats.totalUsers}</p>
          </div>
          <div className="stat-item">
            <p>Nombre d'administrateurs: {stats.totalAdmins}</p>
          </div>
          <div className="stat-item">
            <p>Nombre de capteurs: {stats.totalSensors}</p>
          </div>
          <div className="stat-item">
            <p>Nombre de données collectées: {stats.totalData}</p>
          </div>
        </div>
      </section>
      <section className="admin-section">
        <h2>Utilisateurs</h2>
        <Button className="btn btn-danger btn-lg bouton-ajout ms-auto" onClick={() => setIsModalOpen(true)}>
          Ajouter un utilisateur
        </Button>

        <UserList
          users={users}
          onSelectUser={handleUpdateUser}
          onUpdateStatus={handleUpdateStatus}
          onDeleteUser={handleDeleteUser}
        />
      </section>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm onSubmit={handleAddUser} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminPage;
