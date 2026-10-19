// src/services/api.js
import { initialMenuItems, initialUsers, initialTables, initialOrders } from './mockData';

// Helper to simulate asynchronous API delay
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

export const apiService = {
  // Menu API
  getMenuItems: async () => {
    await delay();
    const stored = localStorage.getItem('resto_menu');
    return stored ? JSON.parse(stored) : initialMenuItems;
  },
  saveMenuItems: async (items) => {
    await delay();
    localStorage.setItem('resto_menu', JSON.stringify(items));
    return items;
  },

  // Users API
  getUsers: async () => {
    await delay();
    const stored = localStorage.getItem('resto_users');
    return stored ? JSON.parse(stored) : initialUsers;
  },

  // Orders API
  getOrders: async () => {
    await delay();
    const stored = localStorage.getItem('resto_orders');
    return stored ? JSON.parse(stored) : initialOrders;
  },
};