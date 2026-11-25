import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const customerRequestService = {
  getRequests: async (params = {}) => {
    const res = await api.get('/customer-requests', params);
    return unwrapList(res);
  },

  getMyRequests: async (params = {}) => {
    const res = await api.get('/customer-requests/mine', params);
    return unwrapList(res);
  },

  createRequest: async (data) => {
    const res = await api.post('/customer-requests', data);
    return unwrapItem(res);
  },

  updateStatus: async (id, status) => {
    const res = await api.patch(`/customer-requests/${id}/status`, { status });
    return unwrapItem(res);
  },

  assignWaiter: async (id, waiterId) => {
    const res = await api.patch(`/customer-requests/${id}/assign`, {
      waiterId: Number(waiterId),
    });
    return unwrapItem(res);
  },
};

export default customerRequestService;