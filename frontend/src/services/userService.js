import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const userService = {
  getUsers: async (params = {}) => {
    const res = await api.get('/users', params);
    return unwrapList(res);
  },

  getUser: async (id) => {
    const res = await api.get(`/users/${id}`);
    return unwrapItem(res);
  },

  addUser: async (userData) => {
    const res = await api.post('/users', userData);
    return res;
  },

  updateUser: async (id, userData) => {
    const res = await api.put(`/users/${id}`, userData);
    return unwrapItem(res);
  },

  setUserStatus: async (id, statusData) => {
    const res = await api.patch(`/users/${id}/status`, statusData);
    return unwrapItem(res);
  },
  resetPassword: async (id, password) => {
    const res = await api.put(`/users/${id}/password`, { password });
    return res;
  },

  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res;
  },
};

export default userService;