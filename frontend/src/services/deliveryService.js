import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const deliveryService = {
  getDeliveries: async (params = {}) => {
    const res = await api.get('/deliveries', params);
    return unwrapList(res);
  },

  getDrivers: async () => {
    const res = await api.get('/deliveries/drivers');
    return unwrapList(res);
  },

  getDeliveryByOrder: async (orderId) => {
    const res = await api.get(`/deliveries/${orderId}`);
    return unwrapItem(res);
  },

  assignDriver: async (orderId, driverId, estimatedTime) => {
    const payload = { driverId: Number(driverId) };
    if (estimatedTime !== undefined && estimatedTime !== '') {
      payload.estimatedTime = Number(estimatedTime);
    }
    const res = await api.post(`/deliveries/${orderId}/assign`, payload);
    return unwrapItem(res);
  },

  updateStatus: async (orderId, status, coords = {}) => {
    const payload = { status, ...coords };
    const res = await api.post(`/deliveries/${orderId}/status`, payload);
    return unwrapItem(res);
  },
};

export default deliveryService;