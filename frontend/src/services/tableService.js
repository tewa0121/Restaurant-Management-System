import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.tables)) return res.data.tables;
  if (Array.isArray(res?.tables)) return res.tables;
  return [];
};

const unwrapItem = (res) => {
  if (res && typeof res === 'object' && 'data' in res && res.data !== undefined) {
    return res.data;
  }
  return res;
};

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

  updateStatus: async (tableId, status) => {
    return tableService.updateTableStatus(tableId, status);
  },

  assignWaiter: async (tableId, waiterId) => {
    const res = await api.patch(`/tables/${tableId}/waiter`, { waiterId });
    return unwrapItem(res);
  },

  seatGuests: async (tableId, data = {}) => {
    const payload = typeof data === 'number' ? { guestCount: data } : data;
    const res = await api.post(`/tables/${tableId}/seat`, payload);
    return unwrapItem(res);
  },

  releaseTable: async (tableId, data = {}) => {
    const payload = typeof data === 'string' ? { status: data } : data;
    const res = await api.post(`/tables/${tableId}/release`, payload);
    return unwrapItem(res);
  },

  deleteTable: async (tableId) => {
    const res = await api.delete(`/tables/${tableId}`);
    return unwrapItem(res);
  },
};

export default tableService;