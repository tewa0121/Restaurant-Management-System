const db = require('../config/database');

const likeTerm = (value) => `%${String(value).replace(/[\\%_]/g, '\\$&')}%`;

const mapFields = (source, map) => {
  const out = {};
  Object.keys(map).forEach((key) => {
    if (source[key] !== undefined) out[map[key]] = source[key];
  });
  return out;
};

async function updateById(table, id, fields, conn) {
  const keys = Object.keys(fields);
  if (!keys.length) return;
  const assignments = keys.map((key) => `\`${key}\` = ?`).join(', ');
  const values = keys.map((key) => fields[key]);
  await (conn || db).query(`UPDATE \`${table}\` SET ${assignments} WHERE id = ?`, [...values, id]);
}

const isForeignKeyError = (err) =>
  err && (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_ROW_IS_REFERENCED');

module.exports = { likeTerm, mapFields, updateById, isForeignKeyError };