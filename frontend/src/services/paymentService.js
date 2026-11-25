import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const paymentService = {
  getPayments: async (params = {}) => {
    const res = await api.get('/payments', params);
    return {
      rows: unwrapList(res),
      summary: res?.summary ?? null,
      pagination: res?.pagination ?? null,
    };
  },

  getPaymentHistory: async (params = {}) => {
    const res = await api.get('/payments', params);
    return unwrapList(res);
  },

  getPayment: async (id) => {
    const res = await api.get(`/payments/${id}`);
    return unwrapItem(res);
  },

  processPayment: async (paymentData) => {
    const res = await api.post('/payments', paymentData);
    return res;
  },
};

export default paymentService;