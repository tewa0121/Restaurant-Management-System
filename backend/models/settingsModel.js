const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const exec = (conn) => conn || db;

const SettingsModel = {
  async getAll(conn) {
    const [rows] = await exec(conn).query(
      'SELECT setting_key, setting_value FROM restaurant_settings WHERE restaurant_id = ? ORDER BY setting_key',
      [restaurantId]
    );
    const settings = {};
    rows.forEach((row) => {
      settings[row.setting_key] = row.setting_value;
    });
    return settings;
  },

  async get(key, conn) {
    const [rows] = await exec(conn).query(
      'SELECT setting_value FROM restaurant_settings WHERE restaurant_id = ? AND setting_key = ?',
      [restaurantId, key]
    );
    return rows[0] ? rows[0].setting_value : null;
  },

  async getNumber(key, fallback, conn) {
    const value = await SettingsModel.get(key, conn);
    const parsed = value === null || value === undefined || value === '' ? NaN : Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  },

  async set(key, value, conn) {
    await exec(conn).query(
      `INSERT INTO restaurant_settings (restaurant_id, setting_key, setting_value) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [restaurantId, key, value === null || value === undefined ? null : String(value)]
    );
  },

  async remove(key, conn) {
    await exec(conn).query('DELETE FROM restaurant_settings WHERE restaurant_id = ? AND setting_key = ?', [restaurantId, key]);
  },
};

module.exports = SettingsModel;