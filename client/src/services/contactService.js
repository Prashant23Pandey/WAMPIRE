import apiClient from './api.js';

export const contactService = {
  async submitContact(payload) {
    return apiClient.post('/contact', payload);
  },
};

export default contactService;

