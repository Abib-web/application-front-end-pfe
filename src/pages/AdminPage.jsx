import React, { useEffect, useState } from "react";
import { userAPI} from "../api/users";
import UserList from "../components/Admin/UserList";
import RoleList from "../components/Admin/RoleList";
import UserForm from "../components/Admin/UserForm";
import RoleForm from "../components/Admin/RoleForm";
import AdminLayout from "../components/Admin/AdminLayout";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  // Charger les utilisateurs et les rôles
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await userAPI.getAll();
        const rolesData = await userAPI.getAllRoles();
        setUsers(usersData);
         (rolesData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };
    fetchData();
  }, []);

  // Gestion des utilisateurs
  const handleAddUser = async (userData) => {
    try {
      const newUser = await userAPI.create(userData);
      setUsers([...users, newUser]);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
    }
  };

  const handleUpdateUserStatus = async (userId, isActive) => {
    try {
      await userAPI.updateStatus(userId, isActive);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isActive } : user
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut:", error);
    }
  };

  // Gestion des rôles
  const handleAddRole = async (roleData) => {
    try {
      const newRole = await userAPI.createRole(roleData);
      setRoles([...roles, newRole]);
    } catch (error) {
      console.error("Erreur lors de l'ajout du rôle:", error);
    }
  };

  const handleUpdateRolePermissions = async (roleId, permissions) => {
    try {
      await userAPI.updateRolePermissions(roleId, permissions);
      setRoles(roles.map(role =>
        role.id === roleId ? { ...role, permissions } : role
      ));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des permissions:", error);
    }
  };

  return (
    <AdminLayout>
      <h1>Administration</h1>

      <section>
        <h2>Utilisateurs</h2>
        <UserList
          users={users}
          onSelectUser={setSelectedUser}
          onUpdateStatus={handleUpdateUserStatus}
        />
        <UserForm onSubmit={handleAddUser} />
      </section>

      <section>
        <h2>Rôles</h2>
        <RoleList
          roles={roles}
          onSelectRole={setSelectedRole}
          onUpdatePermissions={handleUpdateRolePermissions}
        />
        <RoleForm onSubmit={handleAddRole} />
      </section>
    </AdminLayout>
  );
};

export default AdminPage;