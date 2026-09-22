import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  registerFarmer,
  loginFarmer,
  logoutFarmer,
  getCurrentFarmer,
} from '../services/authService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [farmer, setFarmer] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore a session (from the mock/local store today, from Django later)
  // so a page refresh doesn't log the farmer out.
  useEffect(() => {
    const existing = getCurrentFarmer();
    setFarmer(existing);
    setLoading(false);
  }, []);

  async function register(formData) {
    return registerFarmer(formData);
  }

  async function login(credentials) {
    const { farmer: loggedInFarmer } = await loginFarmer(credentials);
    setFarmer(loggedInFarmer);
    return loggedInFarmer;
  }

  function logout() {
    logoutFarmer();
    setFarmer(null);
  }

  const value = {
    farmer,
    isAuthenticated: Boolean(farmer),
    loading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }
  return context;
}

export default AuthContext;
