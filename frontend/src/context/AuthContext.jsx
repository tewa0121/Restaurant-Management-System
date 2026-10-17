import { createContext, useContext, useEffect, useState } from 'react';
import { tokenStore } from '../services/api';
import { fetchMe, loginRequest } from '../services/authService';
import { normalizeRole, ROLE_PRIORITY } from '../utils/constants';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(tokenStore.get()));

  useEffect(() => {
    if (!tokenStore.get()) return;
    fetchMe()
      .then(setUser)
      .catch(() => tokenStore.clear())
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password, remember) => {
    const data = await loginRequest(email, password, remember);
    tokenStore.set(data.token, remember);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    tokenStore.clear();
    setUser(null);
  };

  const roles = (user?.roles || []).map(normalizeRole);
  const primaryRole = ROLE_PRIORITY.find((r) => roles.includes(r)) || null;

  return (
    <AuthContext.Provider value={{ user, roles, primaryRole, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}