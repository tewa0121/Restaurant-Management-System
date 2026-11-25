import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const orderService = {
  previewOrder: async (orderData) => {
    const res = await api.post('/orders/preview', orderData);
    return unwrapItem(res);
  },

  getOrders: async (params = {}) => {
    const res = await api.get('/orders', params);
    return unwrapList(res);
  },

  getKitchenOrders: async (params = {}) => {
    const res = await api.get('/orders/kitchen', params);
    return unwrapList(res);
  },

  getMyOrders: async (params = {}) => {
    const res = await api.get('/orders/mine', params);
    return unwrapList(res);
  },

  getOrder: async (id) => {
    const res = await api.get(`/orders/${id}`);
    return unwrapItem(res);
  },

  trackOrder: async (id) => {
    const res = await api.get(`/orders/${id}/track`);
    return unwrapItem(res);
  },

  createOrder: async (orderData) => {
    const res = await api.post('/orders', orderData);
    return unwrapItem(res);
  },

  updateOrder: async (orderId, data) => {
    const res = await api.patch(`/orders/${orderId}`, data);
    return unwrapItem(res);
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await api.patch(`/orders/${orderId}/status`, { status });
    return unwrapItem(res);
  },

  cancelMyOrder: async (orderId) => {
    const res = await api.patch(`/orders/${orderId}/cancel`);
    return unwrapItem(res);
  },

  setPriority: async (orderId, priority) => {
    const res = await api.patch(`/orders/${orderId}/priority`, { priority });
    return unwrapItem(res);
  },

  addOrderItems: async (orderId, items) => {
    const res = await api.post(`/orders/${orderId}/items`, { items });
    return unwrapItem(res);
  },

  removeOrderItem: async (orderId, itemId) => {
    const res = await api.delete(`/orders/${orderId}/items/${itemId}`);
    return unwrapItem(res);
  },

  updateOrderItemStatus: async (orderId, itemId, payload) => {
    const body = typeof payload === 'string' ? { status: payload } : payload;
    const res = await api.patch(`/orders/${orderId}/items/${itemId}/status`, body);
    return unwrapItem(res);
  },

  addFeedback: async (orderId, feedback) => {
    const res = await api.post(`/orders/${orderId}/feedback`, feedback);
    return unwrapItem(res);
  },

  getFeedback: async (params = {}) => {
    const res = await api.get('/orders/feedback', params);
    return unwrapList(res);
  },
};

export default orderService;