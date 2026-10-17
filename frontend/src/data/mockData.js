// ======================================================
// YEGNA RESTAURANT SAAS - COMPLETE MOCK DATABASE
// ======================================================

// ─── 1. RESTAURANTS (SaaS Tenants) ────────────────────
export const restaurants = [
  { id: 1, name: 'Yegna Restaurant', slug: 'yegna', plan: 'pro', is_active: true, logo: 'https://i.pravatar.cc/150?img=68' },
  { id: 2, name: 'Habesha Kitfo House', slug: 'habesha', plan: 'basic', is_active: true, logo: 'https://i.pravatar.cc/150?img=12' },
  { id: 3, name: 'Addis Coffee & Pastry', slug: 'addis', plan: 'free', is_active: true, logo: 'https://i.pravatar.cc/150?img=33' },
];

// ─── 2. USERS & STAFF ─────────────────────────────────
export const users = [
  { id: 1, restaurant_id: null, email: 'admin@saas.com', password: 'admin123', full_name: 'SaaS Super Admin', role: 'Admin', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 2, restaurant_id: 1, email: 'manager@yegna.com', password: 'manager123', full_name: 'John Manager', role: 'Manager', avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 3, restaurant_id: 1, email: 'waiter@yegna.com', password: 'waiter123', full_name: 'David Waiter', role: 'Waiter', avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 4, restaurant_id: 1, email: 'cashier@yegna.com', password: 'cashier123', full_name: 'Michael Cashier', role: 'Cashier', avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 5, restaurant_id: 1, email: 'kitchen@yegna.com', password: 'kitchen123', full_name: 'Chef Kitchen', role: 'Kitchen Staff', avatar: 'https://i.pravatar.cc/150?img=15' },
];

// ─── 3. CUSTOMERS ─────────────────────────────────────
export const customers = [
  { id: 1, restaurant_id: 1, first_name: 'John', last_name: 'Smith', phone: '+251911100001', avatar: 'https://i.pravatar.cc/150?img=14', loyalty_points: 450, is_vip: false },
  { id: 2, restaurant_id: 1, first_name: 'Sarah', last_name: 'Johnson', phone: '+251911100002', avatar: 'https://i.pravatar.cc/150?img=20', loyalty_points: 780, is_vip: true },
  { id: 3, restaurant_id: 1, first_name: 'Michael', last_name: 'Brown', phone: '+251911100003', avatar: 'https://i.pravatar.cc/150?img=22', loyalty_points: 320, is_vip: false },
  { id: 4, restaurant_id: 1, first_name: 'Emily', last_name: 'Davis', phone: '+251911100004', avatar: 'https://i.pravatar.cc/150?img=25', loyalty_points: 920, is_vip: true },
  { id: 5, restaurant_id: 1, first_name: 'David', last_name: 'Wilson', phone: '+251911100005', avatar: 'https://i.pravatar.cc/150?img=30', loyalty_points: 180, is_vip: false },
];

// ─── 4. TABLES (Floor Plan) ───────────────────────────
export const tables = [
  { id: 1, restaurant_id: 1, section: 'Main Hall', table_number: '1', capacity: 2, status: 'available', shape: 'square' },
  { id: 2, restaurant_id: 1, section: 'Main Hall', table_number: '2', capacity: 4, status: 'available', shape: 'square' },
  { id: 3, restaurant_id: 1, section: 'Main Hall', table_number: '3', capacity: 4, status: 'occupied', shape: 'round' },
  { id: 4, restaurant_id: 1, section: 'Main Hall', table_number: '4', capacity: 6, status: 'available', shape: 'rectangle' },
  { id: 5, restaurant_id: 1, section: 'Main Hall', table_number: '5', capacity: 4, status: 'occupied', shape: 'square' },
  { id: 6, restaurant_id: 1, section: 'VIP', table_number: '6', capacity: 2, status: 'available', shape: 'round' },
  { id: 7, restaurant_id: 1, section: 'VIP', table_number: '7', capacity: 4, status: 'reserved', shape: 'square' },
  { id: 8, restaurant_id: 1, section: 'VIP', table_number: '8', capacity: 6, status: 'available', shape: 'rectangle' },
  { id: 12, restaurant_id: 1, section: 'Outdoor', table_number: '12', capacity: 8, status: 'occupied', shape: 'rectangle' },
  { id: 15, restaurant_id: 1, section: 'Outdoor', table_number: '15', capacity: 4, status: 'occupied', shape: 'square' },
];

// ─── 5. MENU CATEGORIES ───────────────────────────────
export const menuCategories = [
  { id: 1, restaurant_id: 1, name: 'Breakfast', icon: '🍳' },
  { id: 2, restaurant_id: 1, name: 'Lunch', icon: '🍽️' },
  { id: 3, restaurant_id: 1, name: 'Dinner', icon: '🥘' },
  { id: 4, restaurant_id: 1, name: 'Drinks', icon: '☕' },
];

// ─── 6. MENU ITEMS ────────────────────────────────────
export const menuItems = [
  { id: 1, category_id: 1, name: 'Firfir', price: 120.00, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80', is_available: true },
  { id: 4, category_id: 2, name: 'Doro Wat', price: 380.00, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80', is_available: true },
  { id: 5, category_id: 2, name: 'Beef Tibs', price: 420.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 6, category_id: 2, name: 'Kitfo', price: 450.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 7, category_id: 2, name: 'Shiro', price: 180.00, image_url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80', is_available: true },
  { id: 8, category_id: 3, name: 'Lamb Tibs', price: 520.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 9, category_id: 3, name: 'Grilled Chicken', price: 480.00, image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80', is_available: true },
  { id: 10, category_id: 4, name: 'Ethiopian Coffee', price: 60.00, image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80', is_available: true },
  { id: 11, category_id: 4, name: 'Macchiato', price: 70.00, image_url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80', is_available: true },
];

// ─── 7. ORDERS (Kitchen & Tables) ─────────────────────
export const orders = [
  // Pending (Kitchen New)
  { id: 101, restaurant_id: 1, order_number: 'ORD-1250', customer_id: 1, waiter_id: 2, status: 'pending', total_amount: 460.00, table_ids: [5], ordered_at: '2025-05-20T10:30:00', items: [{ menu_item_id: 4, quantity: 1, price: 380 }, { menu_item_id: 10, quantity: 1, price: 80 }] },
  { id: 102, restaurant_id: 1, order_number: 'ORD-1251', customer_id: 2, waiter_id: 2, status: 'pending', total_amount: 782.00, table_ids: [12], ordered_at: '2025-05-20T10:25:00', items: [{ menu_item_id: 5, quantity: 1, price: 420 }, { menu_item_id: 7, quantity: 2, price: 180 }] },
  
  // Preparing (Kitchen In Progress)
  { id: 103, restaurant_id: 1, order_number: 'ORD-1248', customer_id: 3, waiter_id: 2, status: 'preparing', total_amount: 368.00, table_ids: [3], ordered_at: '2025-05-20T10:20:00', items: [{ menu_item_id: 6, quantity: 1, price: 320 }, { menu_item_id: 11, quantity: 1, price: 48 }] },
  { id: 104, restaurant_id: 1, order_number: 'ORD-1247', customer_id: 4, waiter_id: 2, status: 'preparing', total_amount: 779.70, table_ids: [7], ordered_at: '2025-05-20T10:15:00', items: [{ menu_item_id: 9, quantity: 1, price: 480 }, { menu_item_id: 8, quantity: 1, price: 299.7 }] },

  // Ready (Kitchen Ready to Serve)
  { id: 105, restaurant_id: 1, order_number: 'ORD-1245', customer_id: 5, waiter_id: 2, status: 'ready', total_amount: 338.10, table_ids: [1], ordered_at: '2025-05-20T10:10:00', items: [{ menu_item_id: 7, quantity: 1, price: 180 }, { menu_item_id: 4, quantity: 1, price: 158.1 }] },
  
  // Completed (Cashier Paid)
  { id: 106, restaurant_id: 1, order_number: 'ORD-1244', customer_id: 1, waiter_id: 2, status: 'completed', total_amount: 552.00, table_ids: [8], ordered_at: '2025-05-20T09:55:00', items: [{ menu_item_id: 5, quantity: 1, price: 420 }, { menu_item_id: 10, quantity: 1, price: 132 }] },
];

// ─── 8. INVOICES & PAYMENTS (Cashier) ─────────────────
export const invoices = [
  { id: 1, order_id: 106, invoice_number: 'BILL-152', total: 552.00, status: 'paid', payment_method: 'card', generated_at: '2025-05-20T10:30:00' },
  { id: 2, order_id: 101, invoice_number: 'BILL-153', total: 460.00, status: 'held', payment_method: null, generated_at: '2025-05-20T10:35:00' },
  { id: 3, order_id: 102, invoice_number: 'BILL-154', total: 782.00, status: 'unpaid', payment_method: null, generated_at: '2025-05-20T10:40:00' },
];

// ─── 9. INVENTORY (Manager Alerts) ────────────────────
export const ingredients = [
  { id: 1, name: 'Tomato', unit: 'kg', current_stock: 2.0, min_stock_level: 5, image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100&q=80' },
  { id: 2, name: 'Chicken Breast', unit: 'kg', current_stock: 1.5, min_stock_level: 5, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100&q=80' },
  { id: 3, name: 'Cooking Oil', unit: 'L', current_stock: 1.0, min_stock_level: 5, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100&q=80' },
  { id: 4, name: 'Cheese', unit: 'kg', current_stock: 1.2, min_stock_level: 2, image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100&q=80' },
];

// ─── 10. DASHBOARD KPIs ───────────────────────────────
export const adminKpis = {
  totalOrders: { value: 1248, delta: 12.5, trend: 'up' },
  todayRevenue: { value: 4325.50, delta: 8.3, trend: 'up' },
  availableTables: { value: 24, delta: 5, trend: 'up' },
  totalCustomers: { value: 856, delta: 11.7, trend: 'up' },
  pendingOrders: { value: 18, delta: -3, trend: 'down' },
  inventoryAlerts: { value: 7, delta: 2, trend: 'down' },
};

export const managerKpis = {
  totalOrders: { value: 128, delta: 15.6, trend: 'up' },
  todayRevenue: { value: 4325.50, delta: 12.3, trend: 'up' },
  availableTables: { value: '24 / 36', delta: 5, trend: 'up' },
  pendingOrders: { value: 18, delta: -3, trend: 'down' },
  reservationsToday: { value: 12, delta: 2, trend: 'up' },
  lowStockItems: { value: 7, delta: 0, trend: 'neutral' },
};

export const cashierKpis = {
  todayRevenue: { value: 4325.50, delta: 12.3, trend: 'up' },
  totalBills: { value: 152, delta: 15.2, trend: 'up' },
  avgBillValue: { value: 28.46, delta: 8.7, trend: 'up' },
  paymentsReceived: { value: 4200.00, delta: 13.1, trend: 'up' },
  refunds: { value: 125.50, delta: -2.4, trend: 'down' },
  pendingPayments: { value: 6, delta: 0, trend: 'neutral' },
};

export const kitchenKpis = {
  newOrders: { value: 12, delta: 0, trend: 'alert' },
  inProgress: { value: 18, delta: 0, trend: 'warning' },
  readyToServe: { value: 7, delta: 0, trend: 'success' },
  completedToday: { value: 45, delta: 0, trend: 'neutral' },
  avgPrepTime: { value: 18, delta: 0, trend: 'neutral' },
  kitchenEfficiency: { value: 92, delta: 0, trend: 'success' },
};

export const waiterKpis = {
  myActiveTables: { value: 6, delta: 0, trend: 'neutral' },
  activeOrders: { value: 14, delta: 0, trend: 'neutral' },
  readyToServe: { value: 5, delta: 0, trend: 'warning' },
  completedOrders: { value: 18, delta: 0, trend: 'success' },
  newRequests: { value: 3, delta: 0, trend: 'alert' },
};

// ─── 11. CHART DATA ───────────────────────────────────
export const salesOverviewData = [
  { day: 'Mon', revenue: 1400 }, { day: 'Tue', revenue: 2200 }, { day: 'Wed', revenue: 2650 },
  { day: 'Thu', revenue: 2050 }, { day: 'Fri', revenue: 2400 }, { day: 'Sat', revenue: 3200 },
  { day: 'Sun', revenue: 3950 },
];

export const revenueByCategoryData = [
  { name: 'Food', value: 65, color: '#10B981' },
  { name: 'Drinks', value: 20, color: '#3B82F6' },
  { name: 'Desserts', value: 10, color: '#F59E0B' },
  { name: 'Others', value: 5, color: '#8B5CF6' },
];

// ─── 12. CUSTOMER REQUESTS (Waiter) ───────────────────
export const customerRequests = [
  { id: 1, table_number: '7', request: 'Extra Napkins', status: 'new', time: '2 min ago' },
  { id: 2, table_number: '12', request: 'More Water', status: 'new', time: '5 min ago' },
  { id: 3, table_number: '3', request: 'Check on Order', status: 'in_progress', time: '8 min ago' },
];