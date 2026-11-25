import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

const isAuthOrForbidden = (err) => err?.status === 401 || err?.status === 403;

export const customerService = {
  getCustomers: async (params = {}) => {
    try {
      const res = await api.get('/customers', params);
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
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

  getMyProfile: async () => {
    try {
      const res = await api.get('/customers/me');
      return unwrapItem(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return null;
      throw err;
    }
  },

  updateMyProfile: async (data) => {
    const res = await api.put('/customers/me', data);
    return unwrapItem(res);
  },

  getMyAddresses: async () => {
    try {
      const res = await api.get('/customers/me/addresses');
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
  },

  addMyAddress: async (data) => {
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
};

export default customerService;