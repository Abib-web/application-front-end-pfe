// data.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Configuration Axios globale
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response) {
      // Erreurs structurées du serveur
      const serverError = error.response.data?.message || error.response.statusText;
      return Promise.reject(new Error(serverError));
    }
    return Promise.reject(error);
  }
);

export const fetchWrapper = {
  get: (url, params) => apiClient.get(url, { params }),
  post: (url, data) => apiClient.post(url, data),
  put: (url, data) => apiClient.put(url, data),
  delete: (url) => apiClient.delete(url)
};

export default apiClient;