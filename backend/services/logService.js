const LogModel = require('../models/logModel');
const AppError = require('../utils/AppError');
const { toOffset, pageMeta } = require('../utils/pagination');

const parseJson = (value) => {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    return value;
  }
};

function levelOf(row) {
  if (!row.user_id) return 'SYSTEM';
  const action = String(row.action).toLowerCase();
  if (/(deleted|cancelled|rejected|deactivated|refund)/.test(action)) return 'WARNING';
  if (/(created|registered|approved|received|opened|closed|logged in)/.test(action)) return 'SUCCESS';
  return 'INFO';
}

function toDto(row, withValues) {
  const userName = row.user_name && row.user_name.trim() ? row.user_name.trim() : 'System';
  const level = levelOf(row);
  const dto = {
    id: row.id,
    user_id: row.user_id,
    user: userName,
    userName,
    action: row.action,
    activity_type: row.activity_type,
    activityType: row.activity_type,
    entity_type: row.entity_type,
    entityType: row.entity_type,
    entity_id: row.entity_id,
    entityId: row.entity_id,
    ip_address: row.ip_address,
    ipAddress: row.ip_address,
    level,
    type: level,
    created_at: row.created_at,
    timestamp: row.created_at,
  };
  if (withValues) {
    dto.old_value = parseJson(row.old_value);
    dto.new_value = parseJson(row.new_value);
  }
  return dto;
}

const LogService = {
  async list({ search, userId, activityType, entityType, from, to, page, limit }) {
    const { rows, total } = await LogModel.list(
      { search, userId, activityType, entityType, from, to },
      { limit, offset: toOffset(page, limit) }
    );
    return { rows: rows.map((row) => toDto(row, false)), pagination: pageMeta(page, limit, total) };
  },

  async get(id) {
    const row = await LogModel.findById(id);
    if (!row) throw new AppError('Log entry not found.', 404, 'LOG_NOT_FOUND');
    return toDto(row, true);
  },

  async types() {
    return LogModel.activityTypes();
  },
};

module.exports = LogService;