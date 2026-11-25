import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

const sanitizeParams = (params = {}) => {
  const clean = { ...params };
  if (clean.limit !== undefined && Number(clean.limit) > 50) {
    clean.limit = 50;
  }
  Object.keys(clean).forEach((k) => {
    if (clean[k] === '' || clean[k] === null || clean[k] === undefined) {
      delete clean[k];
    }
  });
  return clean;
};

export const paymentService = {
  getPayments: async (params = {}) => {
    const cleanParams = sanitizeParams(params);
    const res = await api.get('/payments', cleanParams);
    return {
      rows: unwrapList(res),
      summary: res?.summary ?? res?.data?.summary ?? null,
    };
  },

  processPayment: async (paymentData) => {
    const payload = {
      orderId: paymentData.orderId ?? paymentData.order_id,
      amount: Number(paymentData.amount ?? 0),
      paymentMethod: paymentData.paymentMethod ?? paymentData.payment_method ?? paymentData.method ?? 'cash',
      ...(paymentData.reference ? { reference: paymentData.reference } : {}),
    };
    const res = await api.post('/payments', payload);
    return unwrapItem(res);
  },

  getInvoices: async (params = {}) => {
    const res = await api.get('/invoices', sanitizeParams(params));
    return unwrapList(res);
  },

  getRefunds: async (params = {}) => {
    const res = await api.get('/refunds', sanitizeParams(params));
    return unwrapList(res);
  },

  requestRefund: async (refundData) => {
    const res = await api.post('/refunds', refundData);
    return unwrapItem(res);
  },
};

export default paymentService;