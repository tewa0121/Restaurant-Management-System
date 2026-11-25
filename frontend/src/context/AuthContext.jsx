import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

const STORAGE_KEYS = {
  user: 'user',
  token: 'token',
};

const safeGetItem = (storage, key) => {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (storage, key, value) => {
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
};

const safeRemoveItem = (storage, key) => {
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage access errors
  }
};

const readStoredValue = (key) => {
  return safeGetItem(localStorage, key) ?? safeGetItem(sessionStorage, key) ?? null;
};

const clearAllAuthStorage = () => {
  safeRemoveItem(localStorage, STORAGE_KEYS.token);
  safeRemoveItem(localStorage, STORAGE_KEYS.user);
  safeRemoveItem(sessionStorage, STORAGE_KEYS.token);
  safeRemoveItem(sessionStorage, STORAGE_KEYS.user);
};

const normalizeUser = (rawUser) => {
  if (!rawUser || typeof rawUser !== 'object') return null;

  const rawRoles = Array.isArray(rawUser.roles)
    ? rawUser.roles
    : typeof rawUser.role === 'string' && rawUser.role.trim()
    ? [rawUser.role.trim()]
    : [];

  const roles = rawRoles
    .filter((r) => typeof r === 'string' && r.trim())
    .map((r) => r.trim());

  const primaryRole =
    (typeof rawUser.role === 'string' && rawUser.role.trim()) ||
    (typeof rawUser.primaryRole === 'string' && rawUser.primaryRole.trim()) ||
    roles[0] ||
    'Customer';

  const normalizedRoles = roles.length > 0 ? roles : [primaryRole];

  return {
    ...rawUser,
    roles: normalizedRoles,
    role: primaryRole,
  };
};

const parseStoredUser = () => {
  const saved = readStoredValue(STORAGE_KEYS.user);
  if (!saved) return null;
  try {
    return normalizeUser(JSON.parse(saved));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => parseStoredUser());
  const [token, setToken] = useState(() => readStoredValue(STORAGE_KEYS.token));

  const persistAuthState = useCallback((nextUser, nextToken, remember = true) => {
    const normalizedUser = normalizeUser(nextUser);
    const normalizedToken = typeof nextToken === 'string' && nextToken.trim() ? nextToken.trim() : null;
    const targetStorage = remember ? localStorage : sessionStorage;

    clearAllAuthStorage();

    if (normalizedToken) {
      safeSetItem(targetStorage, STORAGE_KEYS.token, normalizedToken);
    }
    if (normalizedUser) {
      safeSetItem(targetStorage, STORAGE_KEYS.user, JSON.stringify(normalizedUser));
    }

    setToken(normalizedToken);
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  const login = useCallback(
    async (emailOrUser, passwordOrToken, remember = true) => {
      if (typeof emailOrUser === 'object' && emailOrUser !== null) {
        return persistAuthState(emailOrUser, passwordOrToken || null, remember);
      }

      const res = await authService.loginRequest(emailOrUser, passwordOrToken, remember);
      const rawUser = res?.user ?? res?.data?.user ?? res;
      const rawToken = res?.token ?? res?.data?.token ?? null;

      return persistAuthState(rawUser, rawToken, remember);
    },
    [persistAuthState]
  );

  const logout = useCallback(() => {
    clearAllAuthStorage();
    setUser(null);
    setToken(null);
    Promise.resolve(authService.logoutRequest?.()).catch(() => {});
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key !== STORAGE_KEYS.user && event.key !== STORAGE_KEYS.token) {
        return;
      }
      setUser(parseStoredUser());
      setToken(readStoredValue(STORAGE_KEYS.token));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token || user),
      login,
      logout,
    }),
    [user, token, login, logout]
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