import api from './api';

const authService = {
  login: (email, password, remember = true) => api.post('/auth/login', { email, password, remember }, { auth: false }),
  register: (data) => api.post('/auth/register', data, { auth: false }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }, { auth: false }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }, { auth: false }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (currentPassword, newPassword) => api.put('/auth/change-password', { currentPassword, newPassword }),
};

export default authService;