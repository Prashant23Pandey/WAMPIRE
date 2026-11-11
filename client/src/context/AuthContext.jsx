import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('wampire_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      try { localStorage.removeItem('wampire_user'); } catch {}
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('wampire_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (_) {}
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem('wampire_token');
      localStorage.removeItem('wampire_user');
    } catch (_) {}
  }, []);

  // Validate session on app initialization
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      const storedToken = localStorage.getItem('wampire_token');
      if (storedToken) {
        try {
          const response = await authService.getMe();
          if (mounted && response?.data?.user) {
            setUser(response.data.user);
            localStorage.setItem('wampire_user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.warn('[Auth] Session validation failed:', error.message);
          if (mounted) logout();
        }
      }
      if (mounted) setIsLoading(false);
    };

    initAuth();
    return () => {
      mounted = false;
    };
  }, [logout]);

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
      localStorage.setItem('wampire_token', authToken);
      localStorage.setItem('wampire_user', JSON.stringify(loggedInUser));
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


  const updateProfile = async (updates) => {
    try {
      const res = await authService.updateProfile(updates);
      if (res.data?.user) {
        setUser(res.data.user);
        localStorage.setItem('wampire_user', JSON.stringify(res.data.user));
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
