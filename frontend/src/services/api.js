import axios from 'axios';

export const tokenStore = {
  get: () => localStorage.getItem('rms_token') || sessionStorage.getItem('rms_token'),
  set: (token, remember) => {
    if (remember) {
      localStorage.setItem('rms_token', token);
    } else {
      sessionStorage.setItem('rms_token', token);
    }
  },
  clear: () => {
    localStorage.removeItem('rms_token');
    sessionStorage.removeItem('rms_token');
  },
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;