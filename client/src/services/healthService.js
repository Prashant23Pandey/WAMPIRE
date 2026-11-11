import apiClient from './api.js';

export const healthService = {
  async getHealth() {
    return apiClient.get('/health');
  },
};

export default healthService;

