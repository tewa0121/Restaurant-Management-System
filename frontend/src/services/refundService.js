import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const refundService = {
  requestRefund: async ({ paymentId, amount, reason }) => {
    const payload = {
      paymentId: Number(paymentId),
      reason,
    };
    if (amount !== undefined && amount !== '') {
      payload.amount = Number(amount);
    }
    const res = await api.post('/refunds', payload);
    return unwrapItem(res);
  },

  getRefunds: async (params = {}) => {
    const res = await api.get('/refunds', params);
    return unwrapList(res);
  },

  getRefund: async (id) => {
    const res = await api.get(`/refunds/${id}`);
    return unwrapItem(res);
  },

  approveRefund: async (id) => {
    const res = await api.patch(`/refunds/${id}/approve`);
    return unwrapItem(res);
  },

  rejectRefund: async (id) => {
    const res = await api.patch(`/refunds/${id}/reject`);
    return unwrapItem(res);
  },
};

export default refundService;