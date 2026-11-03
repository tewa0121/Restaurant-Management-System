const NotificationModel = require('../models/notificationModel');
const AppError = require('../utils/AppError');
const { logActivity } = require('../utils/activityLog');
const { toOffset, pageMeta } = require('../utils/pagination');
const { normalizeRoleName } = require('../utils/roleNames');
const { titleCase } = require('../utils/enums');

function toDto(row) {
  const isRead = Boolean(row.is_read);
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    type: row.type,
    typeLabel: titleCase(row.type),
    is_read: isRead,
    isRead,
    read: isRead,
    created_at: row.created_at,
    createdAt: row.created_at,
  };
}

const NotificationService = {
  async list({ unread, type, page, limit }, user) {
    const filters = { userId: user.id, unread, type };
    const [rows, total, unreadCount] = await Promise.all([
      NotificationModel.list(filters, { limit, offset: toOffset(page, limit) }),
      NotificationModel.count(filters),
      NotificationModel.unreadCount(user.id),
    ]);
    return { rows: rows.map(toDto), unreadCount, pagination: pageMeta(page, limit, total) };
  },

  async unreadCount(user) {
    return { unreadCount: await NotificationModel.unreadCount(user.id) };
  },

  async markRead(id, user) {
    const row = await NotificationModel.find(id, user.id);
    if (!row) throw new AppError('Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
    await NotificationModel.markRead(id, user.id);
    return toDto({ ...row, is_read: true });
  },

  async markAllRead(user) {
    return { updated: await NotificationModel.markAllRead(user.id) };
  },

  async remove(id, user) {
    const row = await NotificationModel.find(id, user.id);
    if (!row) throw new AppError('Notification not found.', 404, 'NOTIFICATION_NOT_FOUND');
    await NotificationModel.remove(id, user.id);
    return { message: 'Notification deleted.' };
  },

  async clearRead(user) {
    return { deleted: await NotificationModel.clearRead(user.id) };
  },

  async broadcast({ title, message, type, roles, userIds }, actor) {
    const roleNames = (roles || []).map((role) => {
      const name = normalizeRoleName(role);
      if (!name) throw new AppError(`Unknown role: ${role}`, 422, 'UNKNOWN_ROLE');
      return name;
    });
    if (!roleNames.length && !(userIds && userIds.length)) {
      throw new AppError('Choose at least one role or user to notify.', 422, 'VALIDATION_ERROR');
    }

    const payload = { title, message, type: type || 'system' };
    let sent = 0;
    if (roleNames.length) sent += await NotificationModel.broadcastToRoles(roleNames, payload);
    if (userIds && userIds.length) sent += await NotificationModel.broadcastToUsers(userIds, payload);

    logActivity({
      userId: actor.id,
      action: `Sent notification "${title}" to ${sent} recipient(s)`,
      activityType: 'notification',
      entityType: 'notification',
      newValue: { roles: roleNames, userIds: userIds || [] },
    });
    return { sent };
  },
};

module.exports = NotificationService;