import React from "react";

const RoleList = ({ roles, onSelectRole, onUpdatePermissions }) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>{role.name}</td>
              <td>{role.permissions.join(", ")}</td>
              <td>
                <button onClick={() => onSelectRole(role)}>Modifier</button>
                <button onClick={() => onUpdatePermissions(role.id, ["read"])}>
                  Réinitialiser
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleList;