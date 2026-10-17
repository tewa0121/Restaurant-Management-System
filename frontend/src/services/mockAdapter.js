// frontend/src/services/mockAdapter.js
import * as data from '../data/mockData';

// ─── HELPERS ─────────────────────────────────────────
const delay = (ms = 400) => new Promise((r) => setTimeout(r, ms));

// Simulate DB Persistence using LocalStorage
const getDB = (key, fallbackData) => {
  const stored = localStorage.getItem(`mock_db_${key}`);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(`mock_db_${key}`, JSON.stringify(fallbackData));
  return fallbackData;
};

const saveDB = (key, data) => {
  localStorage.setItem(`mock_db_${key}`, JSON.stringify(data));
};

// Simulate JWT
const generateToken = (user) => `mock-jwt-${user.id}-${user.role}`;

// ─── API ADAPTER ─────────────────────────────────────
export const mockAdapter = {
  
  // ─── AUTHENTICATION ────────────────────────────────
  auth: {
    login: async (email, password) => {
      await delay(600);
      const user = data.users.find((u) => u.email === email && u.password === password);
      if (!user) {
        throw { response: { status: 401, data: { message: 'Invalid email or password' } } };
      }
      const { password: _, ...safeUser } = user;
      return { 
        data: { 
          user: safeUser, 
          token: generateToken(user),
          refreshToken: `refresh-${user.id}`
        } 
      };
    },
    me: async () => {
      await delay(200);
      const token = localStorage.getItem('token');
      if (!token) throw { response: { status: 401 } };
      const id = token.split('-')[2];
      const user = data.users.find(u => String(u.id) === id);
      const { password: _, ...safeUser } = user;
      return { data: safeUser };
    },
    logout: async () => {
      await delay(200);
      return { data: { success: true } };
    }
  },

  // ─── DASHBOARD & CHARTS ────────────────────────────
  dashboard: {
    getAdminKpis:   async () => { await delay(); return { data: data.adminKpis }; },
    getManagerKpis: async () => { await delay(); return { data: data.managerKpis }; },
    getCashierKpis: async () => { await delay(); return { data: data.cashierKpis }; },
    getKitchenKpis: async () => { await delay(); return { data: data.kitchenKpis }; },
    getWaiterKpis:  async () => { await delay(); return { data: data.waiterKpis }; },
  },
  chart: {
    getSalesOverview:      async () => { await delay(); return { data: data.salesOverviewData }; },
    getRevenueByCategory:  async () => { await delay(); return { data: data.revenueByCategoryData }; },
    getMonthlyPerformance: async () => { await delay(); return { data: data.monthlyPerformanceData }; },
  },

  // ─── MENU MANAGEMENT ───────────────────────────────
  menu: {
    getCategories: async () => {
      await delay();
      return { data: data.menuCategories };
    },
    getItems: async (filters = {}) => {
      await delay();
      let items = getDB('menu_items', data.menuItems);
      if (filters.categoryId) items = items.filter((m) => m.category_id === Number(filters.categoryId));
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter((m) => m.name.toLowerCase().includes(q));
      }
      return { data: items };
    },
    createItem: async (payload) => {
      await delay();
      const items = getDB('menu_items', data.menuItems);
      const newItem = { id: Date.now(), ...payload, is_available: true };
      items.push(newItem);
      saveDB('menu_items', items);
      return { data: newItem };
    },
    updateAvailability: async (id, is_available) => {
      await delay();
      const items = getDB('menu_items', data.menuItems);
      const index = items.findIndex(m => m.id === Number(id));
      if (index > -1) {
        items[index].is_available = is_available;
        saveDB('menu_items', items);
        return { data: items[index] };
      }
      throw { response: { status: 404 } };
    }
  },

  // ─── ORDERS & KITCHEN ──────────────────────────────
  order: {
    getAll: async (filters = {}) => {
      await delay();
      let orders = getDB('orders', data.orders);
      
      // Join relational data
      let enriched = orders.map(o => ({
        ...o,
        customer: o.customer_id ? data.customers.find(c => c.id === o.customer_id) : null,
        waiter: data.employees.find(e => e.id === o.waiter_id),
        tables: o.table_ids.map(id => data.tables.find(t => t.id === id)),
        items: (o.items || []).map(i => ({ ...i, menuItem: data.menuItems.find(m => m.id === i.menu_item_id) }))
      }));

      // Apply filters
      if (filters.status) enriched = enriched.filter(o => o.status === filters.status);
      if (filters.type) enriched = enriched.filter(o => o.order_type === filters.type);
      
      // Sort newest first
      enriched.sort((a, b) => new Date(b.ordered_at) - new Date(a.ordered_at));
      return { data: enriched };
    },
    
    getById: async (id) => {
      await delay();
      const orders = getDB('orders', data.orders);
      const o = orders.find(o => o.id === Number(id));
      if (!o) throw { response: { status: 404 } };
      return { data: o };
    },

    create: async (payload) => {
      await delay();
      const orders = getDB('orders', data.orders);
      const newOrder = {
        id: Date.now(),
        order_number: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'pending',
        ordered_at: new Date().toISOString(),
        ...payload
      };
      orders.push(newOrder);
      saveDB('orders', orders);
      return { data: newOrder };
    },

    updateStatus: async (id, status) => {
      await delay();
      const orders = getDB('orders', data.orders);
      const index = orders.findIndex(o => o.id === Number(id));
      if (index > -1) {
        orders[index].status = status;
        saveDB('orders', orders);
        return { data: orders[index] };
      }
      throw { response: { status: 404 } };
    }
  },

  // ─── TABLES & RESERVATIONS ─────────────────────────
  table: {
    getAll: async () => {
      await delay();
      const tables = getDB('tables', data.tables);
      return { data: tables };
    },
    getStatusSummary: async () => {
      await delay();
      const tables = getDB('tables', data.tables);
      const summary = { available: 0, reserved: 0, occupied: 0, cleaning: 0 };
      tables.forEach(t => { summary[t.status]++; });
      return { data: summary };
    },
    updateStatus: async (id, status) => {
      await delay();
      const tables = getDB('tables', data.tables);
      const index = tables.findIndex(t => t.id === Number(id));
      if (index > -1) {
        tables[index].status = status;
        saveDB('tables', tables);
        return { data: tables[index] };
      }
      throw { response: { status: 404 } };
    }
  },

  reservation: {
    getAll: async () => {
      await delay();
      const reservations = getDB('reservations', data.reservations);
      const enriched = reservations.map(r => ({
        ...r,
        customer: data.customers.find(c => c.id === r.customer_id),
        table: data.tables.find(t => t.id === r.table_id)
      }));
      return { data: enriched };
    },
    create: async (payload) => {
      await delay();
      const reservations = getDB('reservations', data.reservations);
      const newRes = { id: Date.now(), status: 'pending', ...payload };
      reservations.push(newRes);
      saveDB('reservations', reservations);
      return { data: newRes };
    }
  },

  // ─── CUSTOMERS (CRM) ───────────────────────────────
  customer: {
    getAll: async (filters = {}) => {
      await delay();
      let customers = getDB('customers', data.customers);
      if (filters.vip) customers = customers.filter(c => c.is_vip);
      if (filters.search) {
        const q = filters.search.toLowerCase();
        customers = customers.filter(c => 
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) || 
          c.phone.includes(q)
        );
      }
      return { data: customers };
    },
    getById: async (id) => {
      await delay();
      const customers = getDB('customers', data.customers);
      return { data: customers.find(c => c.id === Number(id)) };
    }
  },

  // ─── BILLING & PAYMENTS ────────────────────────────
  billing: {
    getInvoices: async () => {
      await delay();
      const invoices = getDB('invoices', data.invoices);
      // Join order data
      const enriched = invoices.map(i => ({
        ...i,
        order: data.orders.find(o => o.id === i.order_id)
      }));
      return { data: enriched };
    },
    getPending: async () => {
      await delay();
      const invoices = getDB('invoices', data.invoices);
      return { data: invoices.filter(i => i.status === 'unpaid') };
    },
    processPayment: async (invoiceId, paymentMethod) => {
      await delay();
      const invoices = getDB('invoices', data.invoices);
      const index = invoices.findIndex(i => i.id === Number(invoiceId));
      if (index > -1) {
        invoices[index].status = 'paid';
        invoices[index].payment_method = paymentMethod;
        saveDB('invoices', invoices);
        return { data: { success: true, invoice: invoices[index] } };
      }
      throw { response: { status: 404, data: { message: 'Invoice not found' } } };
    }
  },

  // ─── INVENTORY & SUPPLIERS ─────────────────────────
  inventory: {
    getIngredients: async () => {
      await delay();
      return { data: getDB('ingredients', data.ingredients) };
    },
    getSuppliers: async () => {
      await delay();
      return { data: data.suppliers };
    },
    getLowStock: async () => {
      await delay();
      const ingredients = getDB('ingredients', data.ingredients);
      return { data: ingredients.filter(i => i.current_stock <= i.min_stock_level) };
    },
    updateStock: async (id, newStock) => {
      await delay();
      const ingredients = getDB('ingredients', data.ingredients);
      const index = ingredients.findIndex(i => i.id === Number(id));
      if (index > -1) {
        ingredients[index].current_stock = newStock;
        saveDB('ingredients', ingredients);
        return { data: ingredients[index] };
      }
      throw { response: { status: 404 } };
    }
  },

  // ─── EMPLOYEES & HR ────────────────────────────────
  employee: {
    getAll: async () => {
      await delay();
      return { data: data.employees };
    },
    getById: async (id) => {
      await delay();
      return { data: data.employees.find(e => e.id === Number(id)) };
    }
  },

  // ─── NOTIFICATIONS ─────────────────────────────────
  notification: {
    getAll: async (userId) => {
      await delay();
      return { data: data.notifications.filter(n => n.user_id === Number(userId)) };
    },
    markAsRead: async (id) => {
      await delay();
      const notifications = getDB('notifications', data.notifications);
      const index = notifications.findIndex(n => n.id === Number(id));
      if (index > -1) {
        notifications[index].is_read = true;
        saveDB('notifications', notifications);
        return { data: notifications[index] };
      }
      throw { response: { status: 404 } };
    }
  },

  // ─── SYSTEM LOGS ───────────────────────────────────
  logs: {
    getAll: async () => {
      await delay();
      return { data: [] }; // Add mock logs to mockData.js if needed
    }
  }
};