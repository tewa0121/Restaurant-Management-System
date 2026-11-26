import api from './api';

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.rows)) return res.rows;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapItem = (res) => res?.data ?? res;

export const isNotificationRead = (n) => {
  if (!n) return false;
  if (n.isRead === true || n.is_read === true || n.read === true) return true;
  if (n.isRead === 1 || n.is_read === 1 || n.read === 1) return true;
  if (n.readAt || n.read_at) return true;
  if (String(n.status || '').toLowerCase() === 'read') return true;
  return false;
};

export const notificationService = {
  getNotifications: async (params = {}) => {
    const res = await api.get('/notifications', params);
    const list = unwrapList(res);
    return list.map((item) => {
      const read = isNotificationRead(item);
      return {
        ...item,
        isRead: read,
        is_read: read ? 1 : item.is_read ?? 0,
      };
    });
  },

  getUnreadCount: async () => {
    const res = await api.get('/notifications/unread-count');
    return res?.unreadCount ?? res?.data?.unreadCount ?? 0;
  },

  markAsRead: async (id) => {
    const res = await api.patch(`/notifications/${id}/read`);
    return unwrapItem(res);
  },

  markAllAsRead: async () => {
    const res = await api.post('/notifications/read-all');
    return res;
  },
    // aliases used by pages/waiter/Notifications.jsx
  markRead: async (id) => notificationService.markAsRead(id),
  markAllRead: async () => notificationService.markAllAsRead(),

  clearRead: async () => {
    const res = await api.delete('/notifications/read');
    return res;
  },

  deleteNotification: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return unwrapItem(res);
  },

  broadcast: async (payload) => {
    const res = await api.post('/notifications', payload);
    return res;
  },
};

export default notificationService;