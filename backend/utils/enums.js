const AppError = require('./AppError');

function normalizeEnum(value, allowed, label) {
  const key = String(value).trim().toLowerCase().replace(/[\s-]+/g, '_');
  if (!allowed.includes(key)) {
    throw new AppError(`${label} must be one of: ${allowed.join(', ')}`, 422, 'VALIDATION_ERROR');
  }
  return key;
}

const titleCase = (key) => String(key).replace(/_/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const todayString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const nowTimeString = () => {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(now.getHours())}:${pad(now.getMinutes())}:00`;
};

module.exports = { normalizeEnum, titleCase, todayString, nowTimeString };