// src/services/mockData.js

export const initialMenuItems = [
  { id: 1, name: 'Margherita Pizza', category: 'Main', price: 12.99, available: true },
  { id: 2, name: 'Caesar Salad', category: 'Appetizer', price: 8.50, available: true },
  { id: 3, name: 'Garlic Bread', category: 'Appetizer', price: 5.00, available: true },
  { id: 4, name: 'Chocolate Brownie', category: 'Dessert', price: 6.50, available: true },
];

export const initialUsers = [
  { id: 1, name: 'Admin User', role: 'admin', email: 'admin@rest.com' },
  { id: 2, name: 'John Waiter', role: 'staff', email: 'staff@rest.com' },
];

export const initialTables = [
  { id: 1, number: 1, capacity: 4, status: 'Available' },
  { id: 2, number: 2, capacity: 2, status: 'Occupied' },
  { id: 3, number: 3, capacity: 6, status: 'Available' },
];

export const initialOrders = [
  { id: 101, tableNumber: 2, items: [{ name: 'Margherita Pizza', quantity: 1 }], status: 'Preparing' },
];