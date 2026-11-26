import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const logService = {
  getLogTypes: async () => {
    const res = await api.get('/logs/types');
    return unwrapList(res);
  },

  getLogs: async (params = {}) => {
    const res = await api.get('/logs', params);
    return unwrapList(res);
  },

  // Same as getLogs but also returns the pagination block: { rows, pagination }
  getLogsPage: async (params = {}) => {
    const res = await api.get('/logs', params);
    return {
      rows: unwrapList(res),
      pagination: res?.pagination || { page: 1, limit: params.limit || 50, total: 0, totalPages: 1 },
    };
  },

  getLog: async (id) => {
    const res = await api.get(`/logs/${id}`);
    return unwrapItem(res);
  },
};

export default logService;