import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const customerService = {
  getMe: async () => {
    const res = await api.get('/customers/me');
    return unwrapItem(res);
  },

  getMyAddresses: async () => {
    const res = await api.get('/customers/me/addresses');
    return unwrapList(res);
  },

  createMyAddress: async (data) => {
    const res = await api.post('/customers/me/addresses', data);
    return unwrapItem(res);
  },

  updateMyAddress: async (addressId, data) => {
    const res = await api.put(`/customers/me/addresses/${addressId}`, data);
    return unwrapItem(res);
  },

  deleteMyAddress: async (addressId) => {
    const res = await api.delete(`/customers/me/addresses/${addressId}`);
    return unwrapItem(res);
  },

  getCustomers: async (params = {}) => {
    const res = await api.get('/customers', params);
    return unwrapList(res);
  },

  getCustomer: async (id) => {
    const res = await api.get(`/customers/${id}`);
    return unwrapItem(res);
  },

  createCustomer: async (data) => {
    const res = await api.post('/customers', data);
    return unwrapItem(res);
  },

  updateCustomer: async (id, data) => {
    const res = await api.put(`/customers/${id}`, data);
    return unwrapItem(res);
  },

  deleteCustomer: async (id) => {
    const res = await api.delete(`/customers/${id}`);
    return unwrapItem(res);
  },

  adjustLoyalty: async (id, points, reason) => {
    const res = await api.patch(`/customers/${id}/loyalty`, { points, reason });
    return unwrapItem(res);
  },
};

export default customerService;