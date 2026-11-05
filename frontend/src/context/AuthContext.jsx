import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authService from '../services/authService';
import { clearSession, getStoredUser, getToken, saveSession, updateStoredUser } from '../services/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getToken());
  const [loading, setLoading] = useState(Boolean(getToken()));

  const applySession = useCallback((result, remember) => {
    saveSession(result.token, result.user, remember);
    setToken(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const endSession = useCallback(() => {
    clearSession();
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email, password, remember = true) => applySession(await authService.login(email, password, remember), remember),
    [applySession]
  );

  const register = useCallback(async (data) => applySession(await authService.register(data), true), [applySession]);

  const logout = useCallback(async () => {
    try {
      if (getToken()) await authService.logout();
    } catch (err) {
      /* the session is cleared locally either way */
    }
    endSession();
  }, [endSession]);

  const refreshUser = useCallback(async () => {
    const result = await authService.me();
    updateStoredUser(result.user);
    setUser(result.user);
    return result.user;
  }, []);

  useEffect(() => {
    let active = true;
    if (!getToken()) {
      setLoading(false);
      return undefined;
    }
    authService
      .me()
      .then((result) => {
        if (!active) return;
        updateStoredUser(result.user);
        setUser(result.user);
      })
      .catch((err) => {
        if (active && err.status === 401) endSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [endSession]);

  useEffect(() => {
    const handleExpired = () => {
      setToken(null);
      setUser(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(user && token),
      login,
      register,
      logout,
      refreshUser,
      users: [],
    }),
    [user, token, loading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;