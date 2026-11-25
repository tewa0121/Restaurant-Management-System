import React, { createContext, useContext, useState } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext();

const normalizeUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== 'object') return null;
  const roles = Array.isArray(rawUser.roles)
    ? rawUser.roles
    : rawUser.role
    ? [rawUser.role]
    : [];
  const primaryRole = rawUser.role || rawUser.primaryRole || roles[0] || 'Customer';
  return {
    ...rawUser,
    roles,
    role: primaryRole,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user') || sessionStorage.getItem('user');
      return saved ? normalizeUser(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  });

  const login = async (emailOrUser, passwordOrToken, remember = true) => {
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      const userData = normalizeUser(emailOrUser);
      const userToken = passwordOrToken || '';
      const store = remember ? localStorage : sessionStorage;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      if (userToken) store.setItem('token', userToken);
      if (userData) store.setItem('user', JSON.stringify(userData));
      setToken(userToken || null);
      setUser(userData);
      return userData;
    }

    const res = await authService.loginRequest(emailOrUser, passwordOrToken, remember);
    const userData = normalizeUser(res?.user || res?.data?.user || res);
    const userToken = res?.token || res?.data?.token || '';

    const store = remember ? localStorage : sessionStorage;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    if (userToken) store.setItem('token', userToken);
    if (userData) store.setItem('user', JSON.stringify(userData));

    setToken(userToken || null);
    setUser(userData || null);
    return userData;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    authService.logoutRequest().catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};