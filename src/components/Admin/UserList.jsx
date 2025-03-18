import React, { useEffect, useState } from "react";
import UserForm from "./UserForm";
import { Button, Modal } from "react-bootstrap";
import "./styles/UserList.css"; 

const UserList = ({ users, onSelectUser, onUpdateStatus, onDeleteUser }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleConfirmAction = (user, actionType) => {
    setSelectedUser(user);
    setShowConfirm(actionType);
  };

  const handleConfirmClose = () => {
    setShowConfirm(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    
    if (selectedUser) {
      
    console.log("handleConfirmAction"+selectedUser.id);
      onDeleteUser(selectedUser.id);
    }
    handleConfirmClose();
  };
useEffect(() => {
  console.log("selectedUser",selectedUser);
}, [selectedUser]);
  const handleConfirmStatus = () => {
    console.log(selectedUser)
    if (selectedUser) {
      onUpdateStatus(selectedUser.id, !selectedUser.isActive);
    }
    handleConfirmClose();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Rôle</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? "Actif" : "Inactif"}</td>
              <td className="actions">
                <button className="btn btn-success" onClick={() => handleEditUser(user)}>Modifier</button>
                <button className="btn btn-warning" onClick={() => handleConfirmAction(user, "status")}>
                  {user.isActive ? "Désactiver" : "Activer"}
                </button>
                <button className="btn btn-danger" onClick={() => handleConfirmAction(user, "delete")}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de confirmation */}
      <Modal show={!!showConfirm} onHide={handleConfirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showConfirm === "delete"
            ? `Êtes-vous sûr de vouloir supprimer l'utilisateur ${selectedUser?.email} ?`
            : `Voulez-vous vraiment ${selectedUser?.isActive ? "désactiver" : "activer"} cet utilisateur ?`}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmClose}>Annuler</Button>
          <Button variant="danger" onClick={showConfirm === "delete" ? handleConfirmDelete : handleConfirmStatus}>
            Confirmer
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal d'édition */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserForm user={selectedUser} onSubmit={(updatedUser) => {
            onSelectUser(updatedUser);
            setShowEditModal(false);
          }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserList;
