// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { mockLogin } from '../services/mockAdapter';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On page load, check if a user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('resto_user');
    const token = localStorage.getItem('resto_token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await mockLogin(email, password);
      
      // Save to state and local storage
      setUser(response.user);
      localStorage.setItem('resto_token', response.token);
      localStorage.setItem('resto_user', JSON.stringify(response.user));
      
      return { success: true, user: response.user };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('resto_token');
    localStorage.removeItem('resto_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);