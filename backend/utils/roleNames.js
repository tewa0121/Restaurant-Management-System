const { ROLES } = require('./constants');

const ALIASES = {
  admin: ROLES.ADMIN,
  administrator: ROLES.ADMIN,
  'super admin': ROLES.ADMIN,
  'super administrator': ROLES.ADMIN,
  manager: ROLES.MANAGER,
  'restaurant manager': ROLES.MANAGER,
  waiter: ROLES.WAITER,
  waitress: ROLES.WAITER,
  server: ROLES.WAITER,
  cashier: ROLES.CASHIER,
  kitchen: ROLES.KITCHEN,
  'kitchen staff': ROLES.KITCHEN,
  chef: ROLES.KITCHEN,
  'head chef': ROLES.KITCHEN,
  cook: ROLES.KITCHEN,
  customer: ROLES.CUSTOMER,
};

const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Super Administrator',
  [ROLES.MANAGER]: 'Restaurant Manager',
  [ROLES.WAITER]: 'Waiter',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.KITCHEN]: 'Kitchen Staff',
  [ROLES.CUSTOMER]: 'Customer',
};

const normalizeRoleName = (value) => ALIASES[String(value || '').trim().toLowerCase()] || null;

module.exports = { normalizeRoleName, ROLE_LABELS };