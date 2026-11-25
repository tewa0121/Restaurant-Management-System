import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  return [];
};

const unwrapData = (res) => res?.data ?? res;

export const notificationService = {
  getNotifications: async (params = {}) => {
    const res = await api.get('/notifications', params);
    return unwrapList(res);
  },

  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return unwrapData(res);
  },

  markAllRead: async () => {
    const res = await api.post('/notifications/read-all');
    return unwrapData(res);
  },

  clearRead: async () => {
    const res = await api.delete('/notifications/read');
    return unwrapData(res);
  },

  broadcastNotification: async (data) => {
    const res = await api.post('/notifications', data);
    return unwrapData(res);
  },

  markRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return unwrapData(res);
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return unwrapData(res);
  },
};

export default notificationService;