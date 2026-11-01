// ============================================================================
// utils/constants.js  -  the role vocabulary
// ----------------------------------------------------------------------------
// A role has TWO spellings in this project, and this file is the bridge:
//
//   DATABASE name (roles.name)      "Admin", "Manager", "Kitchen" ...   <- ROLES
//   API / token / frontend name     "admin", "manager", "kitchen" ...   <- normalizeRole()
//
// The ROLES values MUST match the rows that config/database.js seeds into the
// `roles` table. That file seeds "Kitchen" (not "Kitchen Staff").
// ============================================================================
const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  WAITER: 'Waiter',
  CASHIER: 'Cashier',
  KITCHEN: 'Kitchen',
  CUSTOMER: 'Customer',
};

// Old / alternative spellings  ->  the one canonical lowercase name.
const ROLE_ALIASES = {
  'super administrator': 'admin',
  superadmin: 'admin',
  admin: 'admin',
  'restaurant manager': 'manager',
  manager: 'manager',
  cashier: 'cashier',
  'kitchen staff': 'kitchen',
  kitchen: 'kitchen',
  waiter: 'waiter',
  customer: 'customer',
};

// normalizeRole('Kitchen Staff') -> 'kitchen'      normalizeRole(' ADMIN ') -> 'admin'
// Used when the token is CREATED (authService) and when it is CHECKED (authMiddleware).
const normalizeRole = (value) => {
  const key = String(value || '').trim().toLowerCase();
  return ROLE_ALIASES[key] || key;
};

module.exports = { ROLES, ROLE_ALIASES, normalizeRole };