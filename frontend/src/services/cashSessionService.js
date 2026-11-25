import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const cashSessionService = {
  openSession: async ({ openingAmount = 0, notes } = {}) => {
    const res = await api.post('/cash-sessions/open', {
      openingAmount: Number(openingAmount) || 0,
      notes: notes || undefined,
    });
    return unwrapItem(res);
  },

  getCurrentSession: async () => {
    const res = await api.get('/cash-sessions/current');
    return unwrapItem(res);
  },

  getSessions: async (params = {}) => {
    const res = await api.get('/cash-sessions', params);
    return unwrapList(res);
  },

  getSession: async (id) => {
    const res = await api.get(`/cash-sessions/${id}`);
    return unwrapItem(res);
  },

  closeSession: async (id, { countedAmount, notes }) => {
    const res = await api.post(`/cash-sessions/${id}/close`, {
      countedAmount: Number(countedAmount),
      notes: notes || undefined,
    });
    return unwrapItem(res);
  },
};

export default cashSessionService;