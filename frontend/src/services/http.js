// src/services/http.js  — the ONE axios client used for all backend calls
import axios from 'axios';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Attach JWT to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 (expired / revoked token) clear session and go to login
http.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response && error.response.status;
    const isLoginCall = (error.config?.url || '').includes('/auth/login');
    if (status === 401 && !isLoginCall) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Turn an axios error into a readable message
export const getErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (!error.response) return 'Cannot reach the server. Is the backend running on port 5000?';
  const d = error.response.data || {};
  return d.message || d.error || (Array.isArray(d.errors) && d.errors[0]?.message) || fallback;
};

export default http;
