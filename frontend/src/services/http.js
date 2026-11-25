import axios from 'axios';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
).replace(/\/$/, '');

const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
});

const getStoredToken = () => {
  try {
    return localStorage.getItem('token') || sessionStorage.getItem('token') || null;
  } catch {
    return null;
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  } catch {
    // ignore storage errors
  }
};

http.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token && !config.headers?.Authorization) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const reqUrl = error?.config?.url || '';
    const isAuthCall =
      reqUrl.includes('/auth/login') ||
      reqUrl.includes('/auth/register') ||
      reqUrl.includes('/auth/forgot-password') ||
      reqUrl.includes('/auth/reset-password');

    if (status === 401 && !isAuthCall) {
      clearStoredAuth();
      window.dispatchEvent(new Event('auth:expired'));
      if (
        !window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/signup')
      ) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Something went wrong.') => {
  if (!error?.response) {
    return 'Cannot reach the server. Please check that the backend is running on port 5000.';
  }
  const data = error.response.data || {};
  return (
    data.message ||
    data.error ||
    (Array.isArray(data.errors) && data.errors[0]?.message) ||
    fallback
  );
};

export default http;