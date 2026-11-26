import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const discountService = {
  validatePromoCode: async ({ code, subtotal, customerId }) => {
    const payload = {
      code: String(code || '').trim(),
      subtotal: Number(subtotal) || 0,
    };
    if (customerId) payload.customerId = Number(customerId);
    const res = await api.post('/discounts/validate', payload);
    return unwrapItem(res);
  },

  // Codes a customer can use right now (GET /discounts/active)
  getActiveDiscounts: async () => {
    const res = await api.get('/discounts/active');
    return unwrapList(res);
  },

  getDiscounts: async (params = {}) => {
    const res = await api.get('/discounts', params);
    return unwrapList(res);
  },

  getDiscount: async (id) => {
    const res = await api.get(`/discounts/${id}`);
    return unwrapItem(res);
  },

  createDiscount: async (data) => {
    const res = await api.post('/discounts', data);
    return unwrapItem(res);
  },

  updateDiscount: async (id, data) => {
    const res = await api.put(`/discounts/${id}`, data);
    return unwrapItem(res);
  },

  deleteDiscount: async (id) => {
    const res = await api.delete(`/discounts/${id}`);
    return unwrapItem(res);
  },
};

export default discountService;