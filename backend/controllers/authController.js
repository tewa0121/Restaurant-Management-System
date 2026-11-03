const AuthService = require('../services/authService');
const asyncHandler = require('../utils/asyncHandler');

exports.login = asyncHandler(async (req, res) => {
  const result = await AuthService.login(req.body, req);
  res.status(200).json({ success: true, ...result });
});

exports.register = asyncHandler(async (req, res) => {
  const result = await AuthService.register(req.body, req);
  res.status(201).json({ success: true, ...result });
});

exports.me = asyncHandler(async (req, res) => {
  const user = await AuthService.getProfile(req.user.id);
  res.status(200).json({ success: true, user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await AuthService.updateProfile(req.user.id, req.body);
  res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
});

exports.changePassword = asyncHandler(async (req, res) => {
  const result = await AuthService.changePassword(req.user.id, req.user.sessionId, req.body);
  res.status(200).json({ success: true, ...result });
});

exports.forgotPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body);
  res.status(200).json({ success: true, ...result });
});

exports.resetPassword = asyncHandler(async (req, res) => {
  const result = await AuthService.resetPassword(req.body);
  res.status(200).json({ success: true, ...result });
});

exports.logout = asyncHandler(async (req, res) => {
  const result = await AuthService.logout(req.user.sessionId, req.user.id);
  res.status(200).json({ success: true, ...result });
});