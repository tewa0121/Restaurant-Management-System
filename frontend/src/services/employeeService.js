import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const employeeService = {
  getMe: async () => {
    const res = await api.get('/employees/me');
    return unwrapItem(res);
  },

  getMyShifts: async (params = {}) => {
    const res = await api.get('/employees/me/shifts', params);
    return unwrapList(res);
  },

  getShifts: async (params = {}) => {
    const res = await api.get('/employees/shifts', params);
    return unwrapList(res);
  },

  deleteShift: async (shiftId) => {
    const res = await api.delete(`/employees/shifts/${shiftId}`);
    return unwrapItem(res);
  },

  getEmployees: async (params = {}) => {
    const res = await api.get('/employees', params);
    return unwrapList(res);
  },

  getEmployee: async (id) => {
    const res = await api.get(`/employees/${id}`);
    return unwrapItem(res);
  },

  createEmployee: async (data) => {
    const res = await api.post('/employees', data);
    return unwrapItem(res);
  },

  updateEmployee: async (id, data) => {
    const res = await api.put(`/employees/${id}`, data);
    return unwrapItem(res);
  },

  updateEmployeeStatus: async (id, data) => {
    const res = await api.patch(`/employees/${id}/status`, data);
    return unwrapItem(res);
  },

  deleteEmployee: async (id) => {
    const res = await api.delete(`/employees/${id}`);
    return unwrapItem(res);
  },

  getAttendance: async (id, params = {}) => {
    const res = await api.get(`/employees/${id}/attendance`, params);
    return unwrapList(res);
  },

  recordAttendance: async (id, data) => {
    const res = await api.put(`/employees/${id}/attendance`, data);
    return unwrapItem(res);
  },

  createShift: async (id, data) => {
    const res = await api.post(`/employees/${id}/shifts`, data);
    return unwrapItem(res);
  },

  getReviews: async (id) => {
    const res = await api.get(`/employees/${id}/reviews`);
    return unwrapList(res);
  },

  addReview: async (id, data) => {
    const res = await api.post(`/employees/${id}/reviews`, data);
    return unwrapItem(res);
  },
};

export default employeeService;