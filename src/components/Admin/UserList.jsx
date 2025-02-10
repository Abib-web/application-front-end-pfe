import React from "react";

const UserList = ({ users, onSelectUser, onUpdateStatus }) => {
  return (
    <div>
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
              <td>
                <button onClick={() => onSelectUser(user)}>Modifier</button>
                <button onClick={() => onUpdateStatus(user.id, !user.isActive)}>
                  {user.isActive ? "Désactiver" : "Activer"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;