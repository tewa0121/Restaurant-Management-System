import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const invoiceService = {
  generateInvoice: async (orderId) => {
    const res = await api.post('/invoices', { orderId: Number(orderId) });
    return unwrapItem(res);
  },

  getInvoices: async (params = {}) => {
    const res = await api.get('/invoices', params);
    return unwrapList(res);
  },

  getMyInvoices: async (params = {}) => {
    const res = await api.get('/invoices/mine', params);
    return unwrapList(res);
  },

  getInvoiceByOrder: async (orderId) => {
    const res = await api.get(`/invoices/order/${orderId}`);
    return unwrapItem(res);
  },

  getInvoice: async (id) => {
    const res = await api.get(`/invoices/${id}`);
    return unwrapItem(res);
  },

  holdInvoice: async (id) => {
    const res = await api.post(`/invoices/${id}/hold`);
    return unwrapItem(res);
  },

  resumeInvoice: async (id) => {
    const res = await api.post(`/invoices/${id}/resume`);
    return unwrapItem(res);
  },

  deleteInvoice: async (id) => {
    const res = await api.delete(`/invoices/${id}`);
    return unwrapItem(res);
  },
};

export default invoiceService;