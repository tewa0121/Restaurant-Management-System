import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const reservationService = {
  getReservations: async (params = {}) => {
    const res = await api.get('/reservations', params);
    return unwrapList(res);
  },

  getMyReservations: async (params = {}) => {
    const res = await api.get('/reservations/mine', params);
    return unwrapList(res);
  },

  getReservation: async (id) => {
    const res = await api.get(`/reservations/${id}`);
    return unwrapItem(res);
  },

  createReservation: async (data) => {
    const res = await api.post('/reservations', data);
    return unwrapItem(res);
  },

  updateReservation: async (id, data) => {
    const res = await api.put(`/reservations/${id}`, data);
    return unwrapItem(res);
  },

  updateReservationStatus: async (id, status) => {
    const res = await api.patch(`/reservations/${id}/status`, { status });
    return unwrapItem(res);
  },

  cancelMyReservation: async (id) => {
    const res = await api.patch(`/reservations/${id}/cancel`);
    return unwrapItem(res);
  },

  deleteReservation: async (id) => {
    const res = await api.delete(`/reservations/${id}`);
    return unwrapItem(res);
  },
};

export default reservationService;