// src/services/api.js
const API_BASE_URL = 'http://localhost:5000/api';

const apiService = {
  // --- MENU ---
  getMenuItems: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/menu`);
    const json = await res.json();
    return json.success ? json.data : [];
  },
  createMenuItem: async (itemData) => {
    const res = await fetch(`${API_BASE_URL}/admin/menu`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemData)
    });
    return await res.json();
  },

  // --- TABLES ---
  getTables: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/tables`);
    const json = await res.json();
    return json.success ? json.data : [];
  },

  // --- ORDERS ---
  getOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/orders`);
    const json = await res.json();
    return json.success ? json.data : [];
  },
  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  // --- EMPLOYEES ---
  getEmployees: async () => {
    const res = await fetch(`${API_BASE_URL}/admin/employees`);
    const json = await res.json();
    return json.success ? json.employees : [];
  },
  createEmployee: async (empData) => {
    const res = await fetch(`${API_BASE_URL}/admin/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empData)
    });
    return await res.json();
  }
};

export default apiService;