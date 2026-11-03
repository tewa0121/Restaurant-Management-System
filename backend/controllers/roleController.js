const RoleModel = require('../models/roleModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const { ROLE_LABELS } = require('../utils/roleNames');
const { logActivity } = require('../utils/activityLog');

const toDto = (row) => ({
  id: row.id,
  name: row.name,
  label: ROLE_LABELS[row.name] || row.name,
  description: row.description,
  userCount: Number(row.user_count),
  user_count: Number(row.user_count),
});

exports.list = asyncHandler(async (req, res) => {
  const rows = await RoleModel.list();
  ok(res, rows.map(toDto));
});

exports.get = asyncHandler(async (req, res) => {
  const row = await RoleModel.findById(req.params.id);
  if (!row) throw new AppError('Role not found.', 404, 'ROLE_NOT_FOUND');
  ok(res, toDto(row));
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await RoleModel.findById(req.params.id);
  if (!existing) throw new AppError('Role not found.', 404, 'ROLE_NOT_FOUND');

  await RoleModel.updateDescription(req.params.id, req.body.description);
  logActivity({
    userId: req.user.id,
    action: `Updated description of role ${existing.name}`,
    activityType: 'role',
    entityType: 'role',
    entityId: existing.id,
    oldValue: { description: existing.description },
    newValue: { description: req.body.description },
  });

  ok(res, toDto(await RoleModel.findById(req.params.id)), { message: 'Role updated successfully.' });
});