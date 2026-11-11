import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('code_a_nova_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('code_a_nova_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  // Validate session on app initialization
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('code_a_nova_token');
      if (storedToken) {
        try {
          const response = await authService.getMe();
          if (response?.data?.user) {
            setUser(response.data.user);
            localStorage.setItem('code_a_nova_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.warn('[Auth] Session validation failed:', error.message);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (formData) => {
    setIsLoading(true);
    try {
      const res = await authService.signup(formData);
      return { success: true, data: res.data, message: res.message };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Signup failed. Please try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async ({ email, otp }) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyOtp({ email, otp });
      return { success: true, message: res.message, data: res.data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'OTP verification failed. Please check the code and try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async ({ email }) => {
    try {
      const res = await authService.resendOtp({ email });
      return { success: true, message: res.message, data: res.data };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Unable to resend OTP at this time.',
      };
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const res = await authService.login(credentials);
      const { user: loggedInUser, token: authToken } = res.data;
      setUser(loggedInUser);
      setToken(authToken);
      localStorage.setItem('code_a_nova_token', authToken);
      localStorage.setItem('code_a_nova_user', JSON.stringify(loggedInUser));
      return { success: true, user: loggedInUser };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Invalid credentials.',
        requiresVerification: error.requiresVerification || false,
        email: error.email || credentials.email,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_) {}
    setUser(null);
    setToken(null);
    localStorage.removeItem('code_a_nova_token');
    localStorage.removeItem('code_a_nova_user');
  }, []);

  const updateProfile = async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('code_a_nova_user', JSON.stringify(res.data.user));
      }
      return { success: true, user: res.data.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user && user.isVerified !== false),
    isLoading,
    signup,
    register: signup, // alias
    verifyOtp,
    resendOtp,
    login,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
