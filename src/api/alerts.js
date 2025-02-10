import { fetchWrapper } from './data';

const ENDPOINT = '/alert';

const transformAlert = (apiData) => ({
  id: apiData.alert_id,
  sensorId: apiData.sensor_id,
  type: apiData.alert_type,
  message: apiData.alert_message,
  severity: apiData.severity,
  timestamp: apiData.timestamp,
  read: apiData.read || false, // Ajout du statut "read"
});

export const alertAPI = {
  getAll: async () => {
    try {
      const data = await fetchWrapper.get(ENDPOINT);
      return data.map(transformAlert);
    } catch (error) {
      throw new Error(`Alert getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const data = await fetchWrapper.get(`${ENDPOINT}/${id}`);
      return transformAlert(data);
    } catch (error) {
      throw new Error(`Alert getById error: ${error.message}`);
    }
  },

  create: async (data) => {
    const requiredFields = ['sensorId', 'type'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const apiData = {
        sensor_id: data.sensorId,
        alert_type: data.type,
        alert_message: data.message,
        severity_level: data.severity
      };
      return await fetchWrapper.post(ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`Alert create error: ${error.message}`);
    }
  },

  resolve: async (id) => {
    try {
      return await fetchWrapper.patch(`${ENDPOINT}/${id}/resolve`);
    } catch (error) {
      throw new Error(`Alert resolve error: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Alert delete error: ${error.message}`);
    }
  },

  markAsRead: async (alertId) => {
    try {
      const response = await fetchWrapper.patch(`${ENDPOINT}/${alertId}/read`);
      return response; // Retourne la réponse pour mise à jour dans le frontend
    } catch (error) {
      throw new Error(`Alert markAsRead error: ${error.message}`);
    }
  }
};
