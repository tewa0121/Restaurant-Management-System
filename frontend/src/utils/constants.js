// true = screens use src/mocks (no backend needed). false = real API.
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

export const ROLE_PRIORITY = ['admin', 'manager', 'cashier', 'waiter', 'kitchen', 'customer'];

// Database role names -> route keys.
export const normalizeRole = (name = '') => {
  const n = name.toLowerCase();
  return n.startsWith('kitchen') ? 'kitchen' : n;
};