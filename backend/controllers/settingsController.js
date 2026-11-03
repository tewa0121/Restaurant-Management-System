const SettingsService = require('../services/settingsService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

exports.getPublic = asyncHandler(async (req, res) => {
  ok(res, await SettingsService.getPublic());
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await SettingsService.get());
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await SettingsService.update(req.body, req.user), { message: 'Settings saved.' });
});