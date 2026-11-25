import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const tableService = {
  getTables: async (params = {}) => {
    const res = await api.get('/tables', params);
    return unwrapList(res);
  },

  getMyTables: async () => {
    const res = await api.get('/tables/mine');
    return unwrapList(res);
  },

  getAvailableTables: async (params = {}) => {
    const res = await api.get('/tables/available', params);
    return unwrapList(res);
  },

  getTable: async (id) => {
    const res = await api.get(`/tables/${id}`);
    return unwrapItem(res);
  },

  createTable: async (data) => {
    const res = await api.post('/tables', data);
    return unwrapItem(res);
  },

  updateTable: async (id, data) => {
    const res = await api.put(`/tables/${id}`, data);
    return unwrapItem(res);
  },

  updateTableStatus: async (tableId, status) => {
    const res = await api.patch(`/tables/${tableId}/status`, { status });
    return unwrapItem(res);
  },

  assignWaiter: async (tableId, waiterId) => {
    const res = await api.patch(`/tables/${tableId}/assign-waiter`, { waiterId });
    return unwrapItem(res);
  },

  seatGuests: async (tableId, data = {}) => {
    const res = await api.post(`/tables/${tableId}/seat`, data);
    return unwrapItem(res);
  },

  releaseTable: async (tableId, data = {}) => {
    const res = await api.post(`/tables/${tableId}/release`, data);
    return unwrapItem(res);
  },

  deleteTable: async (tableId) => {
    const res = await api.delete(`/tables/${tableId}`);
    return unwrapItem(res);
  },
};

export default tableService;