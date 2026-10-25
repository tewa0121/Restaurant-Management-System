// src/services/api.js
import { initialMenuItems, initialUsers, initialTables, initialOrders } from './mockData';

// Helper to simulate asynchronous API delay
const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms));

const apiService = {
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
  saveUsers: async (users) => {
    await delay();
    localStorage.setItem('resto_users', JSON.stringify(users));
    return users;
  },

  // Orders API
  getOrders: async () => {
    await delay();
    const stored = localStorage.getItem('resto_orders');
    return stored ? JSON.parse(stored) : initialOrders;
  },
  saveOrders: async (orders) => {
    await delay();
    localStorage.setItem('resto_orders', JSON.stringify(orders));
    return orders;
  },
  
  // Create Order Method (በ localStorage ውስጥ አዲስ ትዕዛዝ የሚጨምር)
  createOrder: async (orderData) => {
    await delay();
    const orders = await apiService.getOrders();
    const newOrder = {
      id: 'ORD-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Pending',
      ...orderData
    };
    const updatedOrders = [newOrder, ...orders];
    localStorage.setItem('resto_orders', JSON.stringify(updatedOrders));
    return newOrder;
  },
};

// ✅ Optional: Named export እንዲኖር ከፈለግክ ከዚህ በታች መስጠት ይቻላል
export const createOrder = apiService.createOrder;

export default apiService;