// frontend/src/services/mockAdapter.js
import * as data from '../data/mockData';

// Simulate network delay (600ms) like a real server
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const mockAdapter = {
  
  // ======================================================
  // 1. AUTHENTICATION (Login Page - Image 5)
  // ======================================================
  auth: {
    login: async (email, password) => {
      await delay();
      const user = data.users.find((u) => u.email === email && u.password === password);
      
      if (!user) {
        throw { response: { status: 401, data: { message: 'Invalid email or password' } } };
      }

      // Remove password for security
      const { password: _, ...safeUser } = user;
      return { 
        data: { 
          user: safeUser, 
          token: `mock-jwt-token-${user.id}` 
        } 
      };
    },
    logout: async () => {
      await delay(200);
      return { data: { success: true } };
    }
  },

  // ======================================================
  // 2. DASHBOARD KPIs (Images 1, 2, 4, 6, 7)
  // ======================================================
  dashboard: {
    getAdminKpis:   async () => { await delay(); return { data: data.adminKpis }; },
    getManagerKpis: async () => { await delay(); return { data: data.managerKpis }; },
    getCashierKpis: async () => { await delay(); return { data: data.cashierKpis }; },
    getKitchenKpis: async () => { await delay(); return { data: data.kitchenKpis }; },
    getWaiterKpis:  async () => { await delay(); return { data: data.waiterKpis }; },
  },

  // ======================================================
  // 3. CHARTS (Images 1, 2, 6)
  // ======================================================
  chart: {
    getSalesOverview:     async () => { await delay(); return { data: data.salesOverviewData }; },
    getRevenueByCategory: async () => { await delay(); return { data: data.revenueByCategoryData }; },
    // Add more chart endpoints here later (Monthly Performance, Hourly Sales)
  },

  // ======================================================
  // 4. RESTAURANTS (SaaS Admin - Image 1)
  // ======================================================
  restaurant: {
    getAll: async () => { 
      await delay(); 
      return { data: data.restaurants }; 
    },
    getById: async (id) => {
      await delay();
      return { data: data.restaurants.find(r => r.id === Number(id)) };
    }
  },

  // ======================================================
  // 5. ORDERS & KITCHEN (Images 4, 6, 7)
  // ======================================================
  order: {
    // Get all orders (with relational joins for the tables)
    getAll: async (filters = {}) => {
      await delay();
      
      let enrichedOrders = data.orders.map(order => ({
        ...order,
        customer: data.customers.find(c => c.id === order.customer_id),
        waiter: data.users.find(u => u.id === order.waiter_id),
        tables: order.table_ids.map(id => data.tables.find(t => t.id === id)),
        // Join items with the menu item details
        items: (order.items || []).map(item => ({
          ...item,
          menu_item: data.menuItems.find(m => m.id === item.menu_item_id)
        }))
      }));

      // Apply filters (e.g., Kitchen only wants 'pending', 'preparing', 'ready')
      if (filters.status) {
        enrichedOrders = enrichedOrders.filter(o => o.status === filters.status);
      }
      if (filters.waiterId) {
        enrichedOrders = enrichedOrders.filter(o => o.waiter_id === Number(filters.waiterId));
      }

      // Sort by newest first
      enrichedOrders.sort((a, b) => new Date(b.ordered_at) - new Date(a.ordered_at));
      return { data: enrichedOrders };
    },

    // Update order status (Kitchen starts cooking, Waiter marks as served)
    updateStatus: async (id, newStatus) => {
      await delay();
      const order = data.orders.find(o => o.id === Number(id));
      if (order) {
        order.status = newStatus;
        return { data: order };
      }
      throw { response: { status: 404, data: { message: 'Order not found' } } };
    }
  },

  // ======================================================
  // 6. MENU MANAGEMENT (Images 3, 6)
  // ======================================================
  menu: {
    getCategories: async () => { 
      await delay(); 
      return { data: data.menuCategories }; 
    },
    getItems: async (categoryId = null) => {
      await delay();
      let items = data.menuItems;
      if (categoryId) {
        items = items.filter(m => m.category_id === Number(categoryId));
      }
      return { data: items };
    },
    toggleAvailability: async (id, is_available) => {
      await delay();
      const item = data.menuItems.find(m => m.id === Number(id));
      if (item) {
        item.is_available = is_available;
        return { data: item };
      }
      throw { response: { status: 404 } };
    }
  },

  // ======================================================
  // 7. TABLES & FLOOR PLAN (Images 6, 7)
  // ======================================================
  table: {
    getAll: async () => {
      await delay();
      return { data: data.tables };
    },
    updateStatus: async (id, newStatus) => {
      await delay();
      const table = data.tables.find(t => t.id === Number(id));
      if (table) {
        table.status = newStatus;
        return { data: table };
      }
      throw { response: { status: 404 } };
    },
    getStatusSummary: async () => {
      await delay();
      const summary = { available: 0, occupied: 0, reserved: 0, cleaning: 0 };
      data.tables.forEach(t => { summary[t.status]++ });
      return { data: summary };
    }
  },

  // ======================================================
  // 8. CUSTOMERS (Images 3, 6)
  // ======================================================
  customer: {
    getAll: async () => {
      await delay();
      return { data: data.customers };
    }
  },

  // ======================================================
  // 9. BILLING & CASHIER (Image 2)
  // ======================================================
  billing: {
    getInvoices: async () => {
      await delay();
      // Attach order details to invoices
      const enrichedInvoices = data.invoices.map(inv => ({
        ...inv,
        order: data.orders.find(o => o.id === inv.order_id)
      }));
      return { data: enrichedInvoices };
    },
    getPendingInvoices: async () => {
      await delay();
      const pending = data.invoices.filter(i => i.status === 'unpaid' || i.status === 'held');
      return { 
        data: pending.map(inv => ({
          ...inv,
          order: data.orders.find(o => o.id === inv.order_id)
        }))
      };
    },
    processPayment: async (invoiceId, paymentMethod) => {
      await delay();
      const invoice = data.invoices.find(i => i.id === Number(invoiceId));
      if (invoice) {
        invoice.status = 'paid';
        invoice.payment_method = paymentMethod;
        return { data: invoice };
      }
      throw { response: { status: 404 } };
    }
  },

  // ======================================================
  // 10. INVENTORY (Images 1, 6)
  // ======================================================
  inventory: {
    getAllIngredients: async () => {
      await delay();
      return { data: data.ingredients };
    },
    getLowStock: async () => {
      await delay();
      // Filter items where current stock is less than minimum stock
      const lowStock = data.ingredients.filter(i => i.current_stock <= i.min_stock_level);
      return { data: lowStock };
    }
  },

  // ======================================================
  // 11. CUSTOMER REQUESTS (Image 7 - Waiter)
  // ======================================================
  request: {
    getAll: async () => {
      await delay();
      return { data: data.customerRequests };
    },
    resolveRequest: async (id) => {
      await delay();
      const req = data.customerRequests.find(r => r.id === Number(id));
      if (req) {
        req.status = 'resolved';
        return { data: req };
      }
      throw { response: { status: 404 } };
    }
  }
};