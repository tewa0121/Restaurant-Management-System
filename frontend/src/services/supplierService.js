import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const supplierService = {
  getSuppliers: async (params = {}) => {
    const res = await api.get('/suppliers', params);
    return unwrapList(res);
  },

  getSupplier: async (id) => {
    const res = await api.get(`/suppliers/${id}`);
    return unwrapItem(res);
  },

  createSupplier: async (data) => {
    const res = await api.post('/suppliers', data);
    return unwrapItem(res);
  },

  updateSupplier: async (id, data) => {
    const res = await api.put(`/suppliers/${id}`, data);
    return unwrapItem(res);
  },

  deleteSupplier: async (id) => {
    const res = await api.delete(`/suppliers/${id}`);
    return res;
  },
};

export default supplierService;