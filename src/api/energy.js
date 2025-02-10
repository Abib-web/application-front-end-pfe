import { fetchWrapper } from './data';

const ENDPOINT = '/energy';

const transformEnergyData = (apiData) => ({
  id: apiData.id,
  sensorId: apiData.sensor_id,
  timestamp: new Date(apiData.timestamp),
  batteryVoltage: apiData.battery_voltage,
  solarOutput: apiData.solar_output,
  stateOfCharge: apiData.state_of_charge,
  batteryHealth: apiData.battery_health_score
});

export const energyAPI = {
  getAll: async (page = 1, limit = 10) => {
    try {
      const params = { page, limit };
      const data = await fetchWrapper.get(ENDPOINT, { params });
      return data.map(transformEnergyData);
    } catch (error) {
      throw new Error(`Energy getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const data = await fetchWrapper.get(`${ENDPOINT}/${id}`);
      return transformEnergyData(data);
    } catch (error) {
      throw new Error(`Energy getById error: ${error.message}`);
    }
  },

  create: async (data) => {
    const requiredFields = ['sensorId', 'batteryVoltage', 'solarOutput', 'stateOfCharge'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const apiData = {
        sensor_id: data.sensorId,
        battery_voltage: data.batteryVoltage,
        solar_output: data.solarOutput,
        state_of_charge: data.stateOfCharge
      };
      return await fetchWrapper.post(ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`Energy create error: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Energy delete error: ${error.message}`);
    }
  }
};