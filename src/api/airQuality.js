import { fetchWrapper } from './data';

const ENDPOINT = '/air-quality';

export const airQualityAPI = {
  getAll: async (params = {}) => {
    try {
      return await fetchWrapper.get(ENDPOINT, params);
    } catch (error) {
      throw new Error(`Erreur de récupération: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      return await fetchWrapper.get(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Erreur de récupération (${id}): ${error.message}`);
    }
  },
  getByLocation: async (locationId) => {
    try {
      return await fetchWrapper.get(`${ENDPOINT}/location/${locationId}`);
    } catch (error) {
      throw new Error(`Erreur de récupération (location ${locationId}): ${error.message}`);
    }
  },
  create: async (data) => {
    const requiredFields = [
      'location_id', 
      'co_level', 
      'no2_level', 
      'pm25_level', 
      'pm10_level', 
      'temperature', 
      'humidity'
    ];

    const missingFields = requiredFields.filter(field => data[field] === undefined);
    if (missingFields.length > 0) {
      throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
    }

    try {
      return await fetchWrapper.post(ENDPOINT, data);
    } catch (error) {
      throw new Error(`Erreur de création: ${error.message}`);
    }
  },

  update: async (id, data) => {
    try {
      return await fetchWrapper.put(`${ENDPOINT}/${id}`, data);
    } catch (error) {
      throw new Error(`Erreur de mise à jour (${id}): ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Erreur de suppression (${id}): ${error.message}`);
    }
  }
};