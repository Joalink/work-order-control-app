import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/',
  // headers: {
  //     'Content-Type': 'application/json',
  // }
});

const apiService = {
  get: async (url, params = {}) => {
    try {
      const response = await apiClient.get(url, { params });
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  post: async (url, data) => {
    try {
        const response = await apiClient.post(url, data);
        return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  put: async (url, data) => {
      try {
        const response = await apiClient.put(url, data);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },

  patch: async (url, data) => {
    try {
      const response = await apiClient.patch(url, data);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },

  delete: async (url) => {
      try {
        const response = await apiClient.delete(url);
        return response.data;
      } catch (error) {
        handleError(error);
      }
    },
  };

  const handleError = (error) => {
      console.error('API Error:', error);
      throw error; 
  };

export default apiService;