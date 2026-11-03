import api from './api';
import { USE_MOCK } from '../utils/constants';

// Predefined mock users for testing all role portals locally without backend
const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@resto.com', roles: ['admin'] },
  { id: 2, name: 'Manager User', email: 'manager@resto.com', roles: ['manager'] },
  { id: 3, name: 'Cashier User', email: 'cashier@resto.com', roles: ['cashier'] },
  { id: 4, name: 'Waiter User', email: 'waiter@resto.com', roles: ['waiter'] },
  { id: 5, name: 'Kitchen Staff', email: 'kitchen@resto.com', roles: ['kitchen'] },
  { id: 6, name: 'Customer User', email: 'customer@resto.com', roles: ['customer'] },
];

export async function loginRequest(email, password) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500)); // Simulate network latency
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error('Invalid email or password (Try admin@resto.com)');
    }
    return {
      token: `mock-jwt-token-${found.id}`,
      user: found,
    };
  }

  const res = await api.post('/auth/login', { email, password });
  return res.data;
}

export async function fetchMe() {
  if (USE_MOCK) {
    const token = localStorage.getItem('rms_token') || sessionStorage.getItem('rms_token');
    if (!token) throw new Error('Not authenticated');
    const id = token.split('-').pop();
    const found = MOCK_USERS.find((u) => String(u.id) === String(id)) || MOCK_USERS[0];
    return found;
  }

  const res = await api.get('/auth/me');
  return res.data;
}