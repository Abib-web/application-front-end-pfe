import { fetchWrapper } from './data';

const ENDPOINT = '/sensors';

const transformSensor = (apiData) => ({
  id: apiData.id,
  type: apiData.sensor_type,
  locationId: apiData.location_id,
  status: apiData.operational_status,
  lastCalibration: new Date(apiData.last_calibrated),
  firmwareVersion: apiData.firmware_version
});

export const sensorAPI = {
  getAll: async (locationId) => {
    try {
      const params = locationId ? { location_id: locationId } : {};
      const data = await fetchWrapper.get(ENDPOINT, { params });
      return data;//.map(transformSensor);
    } catch (error) {
      throw new Error(`Sensor getAll error: ${error.message}`);
    }
  },

  getById: async (id) => {
    try {
      const data = await fetchWrapper.get(`${ENDPOINT}/${id}`);
      return data;//transformSensor(data);
    } catch (error) {
      throw new Error(`Sensor getById error: ${error.message}`);
    }
  },
  

  create: async (data) => {
    const requiredFields = ['type', 'locationId'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    try {
      const apiData = {
        sensor_type: data.type,
        location_id: data.locationId,
        firmware_version: data.firmwareVersion
      };
      return await fetchWrapper.post(ENDPOINT, apiData);
    } catch (error) {
      throw new Error(`Sensor create error: ${error.message}`);
    }
  },

  updateFirmware: async (id, version) => {
    try {
      return await fetchWrapper.patch(`${ENDPOINT}/${id}/firmware`, { version });
    } catch (error) {
      throw new Error(`Firmware update error: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      return await fetchWrapper.delete(`${ENDPOINT}/${id}`);
    } catch (error) {
      throw new Error(`Sensor delete error: ${error.message}`);
    }
  }
};