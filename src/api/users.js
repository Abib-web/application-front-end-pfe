import { fetchWrapper } from './data';

const USERS_ENDPOINT = '/users';
const ROLES_ENDPOINT = '/roles';

const transformUser = (apiData) => ({
  id: apiData.id,
  email: apiData.email,
  role: apiData.role_name,
  lastLogin: new Date(apiData.last_login),
  isActive: apiData.is_active,
  metadata: apiData.user_metadata
});

const transformRole = (apiData) => ({
  id: apiData.id,
  name: apiData.role_name,
  permissions: apiData.permissions,
  description: apiData.role_description
});

export const userAPI = {
  // Users
  getAll: async () => {
    try {
      const data = await fetchWrapper.get(USERS_ENDPOINT);
      console.log(data);
      return data.map(transformUser);
    } catch (error) {
      throw new Error(`User getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const data = await fetchWrapper.get(`${USERS_ENDPOINT}/${id}`);
      return transformUser(data);
    } catch (error) {
      throw new Error(`User getById error: ${error.message}`);
    }
  },

  create: async (data) => {
    const requiredFields = ['email', 'password'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const apiData = {
        email: data.email,
        password_hash: data.password,
        role_name: data.role
      };
      return await fetchWrapper.post(USERS_ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`User create error: ${error.message}`);
    }
  },

  updateStatus: async (id, isActive) => {
    try {
      return await fetchWrapper.patch(`${USERS_ENDPOINT}/${id}/status`, { is_active: isActive });
    } catch (error) {
      throw new Error(`User status update error: ${error.message}`);
    }
  },

  // Roles
  getAllRoles: async () => {
    try {
      const data = await fetchWrapper.get(ROLES_ENDPOINT);
      return data.map(transformRole);
    } catch (error) {
      throw new Error(`Role getAll error: ${error.message}`);
    }
  },

  createRole: async (data) => {
    if (!data.name) {
      throw new Error('Role name is required');
    }

    try {
      const apiData = {
        role_name: data.name,
        permissions: data.permissions,
        role_description: data.description
      };
      return await fetchWrapper.post(ROLES_ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`Role create error: ${error.message}`);
    }
  },

  updateRolePermissions: async (id, permissions) => {
    try {
      return await fetchWrapper.patch(`${ROLES_ENDPOINT}/${id}/permissions`, { permissions });
    } catch (error) {
      throw new Error(`Role permissions update error: ${error.message}`);
    }
  }
};