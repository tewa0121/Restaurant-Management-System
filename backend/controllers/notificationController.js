const NotificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, unreadCount, pagination } = await NotificationService.list(req.query, req.user);
  res.status(200).json({ success: true, data: rows, unreadCount, pagination });
});

exports.unreadCount = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, ...(await NotificationService.unreadCount(req.user)) });
});

exports.markRead = asyncHandler(async (req, res) => {
  ok(res, await NotificationService.markRead(req.params.id, req.user));
});

exports.markAllRead = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, ...(await NotificationService.markAllRead(req.user)) });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await NotificationService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});

exports.clearRead = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, ...(await NotificationService.clearRead(req.user)) });
});

exports.broadcast = asyncHandler(async (req, res) => {
  const result = await NotificationService.broadcast(req.body, req.user);
  res.status(201).json({ success: true, message: `Notification sent to ${result.sent} recipient(s).`, ...result });
});