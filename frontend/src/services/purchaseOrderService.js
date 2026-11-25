import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const purchaseOrderService = {
  getPurchaseOrders: async (params = {}) => {
    const res = await api.get('/purchase-orders', params);
    return unwrapList(res);
  },

  getSuggestions: async () => {
    const res = await api.get('/purchase-orders/suggestions');
    return unwrapList(res);
  },

  getPurchaseOrder: async (id) => {
    const res = await api.get(`/purchase-orders/${id}`);
    return unwrapItem(res);
  },

  createPurchaseOrder: async (data) => {
    const res = await api.post('/purchase-orders', data);
    return unwrapItem(res);
  },

  updatePurchaseOrder: async (id, data) => {
    const res = await api.put(`/purchase-orders/${id}`, data);
    return unwrapItem(res);
  },

  sendPurchaseOrder: async (id) => {
    const res = await api.post(`/purchase-orders/${id}/send`);
    return unwrapItem(res);
  },

  cancelPurchaseOrder: async (id) => {
    const res = await api.post(`/purchase-orders/${id}/cancel`);
    return unwrapItem(res);
  },

  receivePurchaseOrder: async (id, payload = { receiveAll: true }) => {
    const res = await api.post(`/purchase-orders/${id}/receive`, payload);
    return unwrapItem(res);
  },

  deletePurchaseOrder: async (id) => {
    const res = await api.delete(`/purchase-orders/${id}`);
    return unwrapItem(res);
  },
};

export default purchaseOrderService;