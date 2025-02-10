// location.js (et tous les autres fichiers d'API)
import { fetchWrapper } from './data'; // Supprimez handleResponse de l'import

const ENDPOINT = '/locations';

export const locationAPI = {
  getAll: async (queryParams = "") => {
    const url = queryParams ? `${ENDPOINT}?${queryParams}` : ENDPOINT;
    try {
      return await fetchWrapper.get(url); // Appel direct sans handleResponse
    } catch (error) {
      throw new Error(`Location getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      return await fetchWrapper.get(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Location getById error: ${error.message}`);
    }
  },

  create: async (data) => {
    if (!data.name || !data.city) {
      throw new Error('Missing required fields: name, city');
    }

    try {
      return await fetchWrapper.post(ENDPOINT, data);
    } catch (error) {
      throw new Error(`Location create error: ${error.message}`);
    }
  },

  update: async (id, data) => {
    try {
      return await fetchWrapper.put(`${ENDPOINT}/${id}`, data);
    } catch (error) {
      throw new Error(`Location update error: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Location delete error: ${error.message}`);
    }
  }
};