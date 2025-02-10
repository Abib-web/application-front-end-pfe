import { fetchWrapper } from './data';

const ENDPOINT = '/network-quality';

const transformNetworkData = (apiData) => ({
  id: apiData.id,
  locationId: apiData.location_id,
  signalStrength: apiData.signal_strength,
  connectionType: apiData.connection_type,
  latency: apiData.ping_latency,
  timestamp: new Date(apiData.measured_at)
});

export const networkAPI = {
  getAll: async (params = {}) => {
    try {
      const data = await fetchWrapper.get(ENDPOINT, { params });
      return data.map(transformNetworkData);
    } catch (error) {
      throw new Error(`Network getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const data = await fetchWrapper.get(`${ENDPOINT}/${id}`);
      return transformNetworkData(data);
    } catch (error) {
      throw new Error(`Network getById error: ${error.message}`);
    }
  },

  create: async (data) => {
    const requiredFields = ['locationId', 'signalStrength'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const apiData = {
        location_id: data.locationId,
        signal_strength: data.signalStrength,
        connection_type: data.connectionType
      };
      return await fetchWrapper.post(ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`Network create error: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Network delete error: ${error.message}`);
    }
  }
};