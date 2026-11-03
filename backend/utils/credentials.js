const crypto = require('crypto');

async function generateUsername(email, exists) {
  const base = (email.split('@')[0].toLowerCase().replace(/[^a-z0-9._-]/g, '') || 'user').slice(0, 30);
  if (!(await exists(base))) return base;
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = `${base}${crypto.randomInt(1000, 9999)}`;
    if (!(await exists(candidate))) return candidate;
  }
  return `${base}${Date.now()}`.slice(0, 50);
}

const generatePassword = () => `${crypto.randomBytes(9).toString('base64').replace(/[+/=]/g, 'x').slice(0, 10)}A1`;

module.exports = { generateUsername, generatePassword };