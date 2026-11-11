import apiClient from './api.js';

export const authService = {
  /**
   * POST /api/auth/signup
   * Full registration generating a cryptographically secure 6-digit OTP
   */
  async signup(payload) {
    return apiClient.post('/auth/signup', payload);
  },

  /**
   * POST /api/auth/verify-otp
   * Verifies the 6-digit OTP, invalidates it, and marks isVerified = true
   */
  async verifyOtp(payload) {
    return apiClient.post('/auth/verify-otp', payload);
  },

  /**
   * POST /api/auth/resend-otp
   * Generates and dispatches a fresh OTP respecting cooldown
   */
  async resendOtp(payload) {
    return apiClient.post('/auth/resend-otp', payload);
  },

  /**
   * POST /api/auth/login
   * Validates credentials and returns JWT token & user
   */
  async login(credentials) {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * POST /api/auth/logout
   */
  async logout() {
    return apiClient.post('/auth/logout');
  },

  /**
   * GET /api/user/me
   */
  async getMe() {
    return apiClient.get('/user/me');
  },

  /**
   * PUT /api/user/update
   */
  async updateProfile(updates) {
    return apiClient.put('/user/update', updates);
  },
};

export default authService;
