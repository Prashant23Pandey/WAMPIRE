import apiClient from './api.js';

export const hackathonService = {
  /**
   * Fetch current authenticated user's hackathon registration entry
   * GET /api/hackathon/my-entry
   */
  async getMyEntry() {
    return apiClient.get('/hackathon/my-entry');
  },

  /**
   * Submit new hackathon registration entry
   * POST /api/hackathon/register
   */
  async register(registrationData) {
    return apiClient.post('/hackathon/register', registrationData);
  },

  /**
   * Update existing hackathon entry
   * PATCH /api/hackathon/my-entry
   */
  async updateEntry(updates) {
    return apiClient.patch('/hackathon/my-entry', updates);
  },

  /**
   * Delete hackathon registration entry by ID
   * DELETE /api/hackathon/:id
   */
  async deleteRegistration(id) {
    return apiClient.delete(`/hackathon/${id}`);
  },

  /**
   * Withdraw current user's hackathon entry
   * DELETE /api/hackathon/my-entry
   */
  async withdrawEntry() {
    return apiClient.delete('/hackathon/my-entry');
  },
};

export default hackathonService;

