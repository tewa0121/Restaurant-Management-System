import api, { getStoredUser } from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

const getRole = () => {
  const user = getStoredUser();
  return String(user?.role || user?.primaryRole || '').trim().toLowerCase();
};

const isAuthOrForbidden = (err) => err?.status === 401 || err?.status === 403;

export const orderService = {
  previewOrder: async (orderData) => {
    const res = await api.post('/orders/preview', orderData);
    return unwrapItem(res);
  },

  getOrders: async (params = {}) => {
    const role = getRole();
    try {
      let endpoint = '/orders';
      if (role === 'customer') {
        endpoint = '/orders/mine';
      } else if (role === 'kitchen') {
        endpoint = '/orders/kitchen';
      }

      const res = await api.get(endpoint, params);
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
  },

  getKitchenOrders: async (params = {}) => {
    const role = getRole();
    if (!['admin', 'manager', 'kitchen', 'waiter'].includes(role)) return [];
    try {
      const res = await api.get('/orders/kitchen', params);
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
  },

  getMyOrders: async (params = {}) => {
    if (getRole() !== 'customer') return [];
    try {
      const res = await api.get('/orders/mine', params);
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
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
    try {
      const res = await api.get('/orders/feedback', params);
      return unwrapList(res);
    } catch (err) {
      if (isAuthOrForbidden(err)) return [];
      throw err;
    }
  },
};

export default orderService;