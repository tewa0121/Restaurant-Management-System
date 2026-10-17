// ======================================================
// YEGNA RESTAURANT — COMPLETE MOCK DATA
// ======================================================

// ─── USERS ────────────────────────────────────────────
export const users = [
  { id: 1, username: 'admin',   email: 'admin@yegna.com',   password: 'admin123',   full_name: 'System Admin', phone: '+251911000001', role: 'Admin',         avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 2, username: 'manager', email: 'manager@yegna.com', password: 'manager123', full_name: 'John Manager', phone: '+251911000002', role: 'Manager',       avatar: 'https://i.pravatar.cc/150?img=68' },
  { id: 3, username: 'waiter',  email: 'waiter@yegna.com',  password: 'waiter123',  full_name: 'David Waiter', phone: '+251911000003', role: 'Waiter',        avatar: 'https://i.pravatar.cc/150?img=13' },
  { id: 4, username: 'cashier', email: 'cashier@yegna.com', password: 'cashier123', full_name: 'Michael Cashier', phone: '+251911000004', role: 'Cashier',       avatar: 'https://i.pravatar.cc/150?img=33' },
  { id: 5, username: 'kitchen', email: 'kitchen@yegna.com', password: 'kitchen123', full_name: 'Chef Kitchen', phone: '+251911000005', role: 'Kitchen Staff', avatar: 'https://i.pravatar.cc/150?img=15' },
];

// ─── CUSTOMERS ────────────────────────────────────────
export const customers = [
  { id: 1, first_name: 'John',    last_name: 'Smith',   phone: '+251911100001', email: 'john@example.com', loyalty_points: 450,  total_orders: 22, total_spent: 8450.00,  is_vip: false, avatar: 'https://i.pravatar.cc/150?img=14' },
  { id: 2, first_name: 'Sarah',   last_name: 'Johnson', phone: '+251911100002', email: 'sarah@example.com', loyalty_points: 780,  total_orders: 34, total_spent: 12780.00, is_vip: true,  avatar: 'https://i.pravatar.cc/150?img=20' },
  { id: 3, first_name: 'Michael', last_name: 'Brown',   phone: '+251911100003', email: 'michael@example.com', loyalty_points: 320,  total_orders: 15, total_spent: 5240.00,  is_vip: false, avatar: 'https://i.pravatar.cc/150?img=22' },
  { id: 4, first_name: 'Emily',   last_name: 'Davis',   phone: '+251911100004', email: 'emily@example.com', loyalty_points: 920,  total_orders: 41, total_spent: 15320.00, is_vip: true,  avatar: 'https://i.pravatar.cc/150?img=25' },
  { id: 5, first_name: 'David',   last_name: 'Wilson',  phone: '+251911100005', email: 'david@example.com', loyalty_points: 180,  total_orders: 8,  total_spent: 2890.00,  is_vip: false, avatar: 'https://i.pravatar.cc/150?img=30' },
];

// ─── TABLES ───────────────────────────────────────────
export const tables = Array.from({ length: 18 }, (_, i) => {
  const id = i + 1;
  const statuses = ['available', 'available', 'occupied', 'available', 'reserved', 'cleaning'];
  return { id, table_number: String(id), capacity: id % 3 === 0 ? 4 : (id % 2 === 0 ? 2 : 6), status: statuses[id % statuses.length] };
});

// ─── RESERVATIONS ─────────────────────────────────────
export const reservations = [
  { id: 1, customer_id: 2, table_id: 8,  reservation_date: '2025-05-20', reservation_time: '19:00', guest_count: 2, special_request: 'Window seat', status: 'confirmed' },
  { id: 2, customer_id: 1, table_id: 12, reservation_date: '2025-05-20', reservation_time: '19:30', guest_count: 4, special_request: null, status: 'confirmed' },
  { id: 3, customer_id: 3, table_id: 3,  reservation_date: '2025-05-20', reservation_time: '20:00', guest_count: 3, special_request: 'Birthday cake', status: 'pending' },
];

// ─── MENU CATEGORIES ──────────────────────────────────
export const menuCategories = [
  { id: 1, name: 'Breakfast', icon: '🍳' },
  { id: 2, name: 'Lunch',     icon: '🍽️' },
  { id: 3, name: 'Dinner',    icon: '🥘' },
  { id: 4, name: 'Drinks',    icon: '☕' },
  { id: 5, name: 'Desserts',  icon: '🍰' },
];

// ─── MENU ITEMS ───────────────────────────────────────
export const menuItems = [
  { id: 1,  category_id: 1, name: 'Firfir',           price: 120.00, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80', is_available: true },
  { id: 2,  category_id: 1, name: 'Chechebsa',        price: 140.00, image_url: 'https://images.unsplash.com/photo-1627042633145-b780d842ba45?w=400&q=80', is_available: true },
  { id: 3,  category_id: 1, name: 'Enkulal Firfir',   price: 130.00, image_url: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80', is_available: true },
  { id: 4,  category_id: 2, name: 'Doro Wat',         price: 380.00, image_url: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?w=400&q=80', is_available: true },
  { id: 5,  category_id: 2, name: 'Beef Tibs',        price: 420.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 6,  category_id: 2, name: 'Kitfo',            price: 450.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 7,  category_id: 2, name: 'Shiro',            price: 180.00, image_url: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=400&q=80', is_available: true },
  { id: 8,  category_id: 3, name: 'Lamb Tibs',        price: 520.00, image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80', is_available: true },
  { id: 9,  category_id: 3, name: 'Grilled Chicken',  price: 480.00, image_url: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=400&q=80', is_available: true },
  { id: 10, category_id: 4, name: 'Ethiopian Coffee', price: 60.00,  image_url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80', is_available: true },
  { id: 11, category_id: 4, name: 'Macchiato',        price: 70.00,  image_url: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&q=80', is_available: true },
  { id: 12, category_id: 4, name: 'Avocado Juice',    price: 90.00,  image_url: 'https://images.unsplash.com/photo-1622597467836-f3824f1c1f2b?w=400&q=80', is_available: true },
];

// ─── INVENTORY & SUPPLIERS ────────────────────────────
export const suppliers = [
  { id: 1, name: 'Addis Meat Supplier', contact_person: 'Abebe Kebede', phone: '+251911200001', email: 'abebe@meat.et' },
  { id: 2, name: 'Fresh Vegetables PLC', contact_person: 'Sara Tesfaye', phone: '+251911200002', email: 'sara@veg.et' },
];

export const ingredients = [
  { id: 1, name: 'Chicken Breast', unit: 'kg', current_stock: 1.5,  min_stock_level: 5, cost_per_unit: 320.00, supplier_id: 1, image_url: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=200&q=80' },
  { id: 2, name: 'Beef',           unit: 'kg', current_stock: 12.0, min_stock_level: 8, cost_per_unit: 480.00, supplier_id: 1, image_url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200&q=80' },
  { id: 3, name: 'Tomato',         unit: 'kg', current_stock: 2.0,  min_stock_level: 5, cost_per_unit: 60.00,  supplier_id: 2, image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200&q=80' },
  { id: 4, name: 'Cooking Oil',    unit: 'L',  current_stock: 1.0,  min_stock_level: 5, cost_per_unit: 180.00, supplier_id: 2, image_url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200&q=80' },
];

// ─── ORDERS & BILLING ─────────────────────────────────
export const orders = [
  { id: 1, order_number: 'ORD-1250', customer_id: 1, waiter_id: 2, status: 'completed', subtotal: 400.00, tax_amount: 60.00, total_amount: 460.00, table_ids: [5],  ordered_at: '2025-05-20T10:30:00', items: [{ menu_item_id: 4, quantity: 1, price: 380 }, { menu_item_id: 10, quantity: 1, price: 20 }] },
  { id: 2, order_number: 'ORD-1249', customer_id: 2, waiter_id: 2, status: 'preparing', subtotal: 680.00, tax_amount: 102.00, total_amount: 782.00, table_ids: [12], ordered_at: '2025-05-20T10:25:00', items: [{ menu_item_id: 5, quantity: 1, price: 420 }, { menu_item_id: 7, quantity: 1, price: 180 }] },
  { id: 3, order_number: 'ORD-1248', customer_id: 3, waiter_id: 2, status: 'preparing', subtotal: 320.00, tax_amount: 48.00, total_amount: 368.00, table_ids: [3],  ordered_at: '2025-05-20T10:20:00', items: [{ menu_item_id: 6, quantity: 1, price: 320 }] },
  { id: 4, order_number: 'ORD-1247', customer_id: 4, waiter_id: 2, status: 'ready',     subtotal: 678.00, tax_amount: 101.70, total_amount: 779.70, table_ids: [7],  ordered_at: '2025-05-20T10:15:00', items: [{ menu_item_id: 9, quantity: 1, price: 480 }, { menu_item_id: 2, quantity: 1, price: 198 }] },
  { id: 5, order_number: 'ORD-1246', customer_id: 5, waiter_id: 2, status: 'completed', subtotal: 294.00, tax_amount: 44.10, total_amount: 338.10, table_ids: [1],  ordered_at: '2025-05-20T10:10:00', items: [{ menu_item_id: 7, quantity: 1, price: 180 }, { menu_item_id: 12, quantity: 1, price: 114 }] },
];

export const invoices = [
  { id: 1, order_id: 1, invoice_number: 'BILL-152', subtotal: 400.00, tax: 60.00, total: 460.00, status: 'paid', payment_method: 'card' },
  { id: 2, order_id: 5, invoice_number: 'BILL-151', subtotal: 294.00, tax: 44.10, total: 338.10, status: 'paid', payment_method: 'cash' },
  { id: 3, order_id: 3, invoice_number: 'BILL-150', subtotal: 320.00, tax: 48.00, total: 368.00, status: 'unpaid', payment_method: null },
];

// ─── DASHBOARD KPIs ───────────────────────────────────
export const adminKpis = {
  totalOrders:     { value: 1248,    delta: 12.5, deltaLabel: 'vs yesterday', trend: 'up' },
  todayRevenue:    { value: 4325.50, delta: 8.3,  deltaLabel: 'vs yesterday', trend: 'up' },
  availableTables: { value: 24,      delta: 5,    deltaLabel: 'vs yesterday', trend: 'up' },
  totalCustomers:  { value: 856,     delta: 11.7, deltaLabel: 'vs yesterday', trend: 'up' },
  pendingOrders:   { value: 18,      delta: -3,   deltaLabel: 'vs yesterday', trend: 'down' },
  inventoryAlerts: { value: 7,       delta: 2,    deltaLabel: 'low stock items', trend: 'down' },
};

export const managerKpis = {
  totalOrders:      { value: 128,       delta: 15.6, deltaLabel: 'vs yesterday', trend: 'up' },
  todayRevenue:     { value: 4325.50,   delta: 12.3, deltaLabel: 'vs yesterday', trend: 'up' },
  availableTables:  { value: '24 / 36', delta: 5,    deltaLabel: 'vs yesterday', trend: 'up' },
  pendingOrders:    { value: 18,        delta: -3,   deltaLabel: 'vs yesterday', trend: 'down' },
  reservationsToday:{ value: 12,        delta: 2,    deltaLabel: 'vs yesterday', trend: 'up' },
  lowStockItems:    { value: 7,                       deltaLabel: 'View details', trend: 'neutral' },
};

export const cashierKpis = {
  todayRevenue:     { value: 4325.50, delta: 12.3, deltaLabel: 'vs yesterday', trend: 'up' },
  totalBills:       { value: 152,     delta: 15.2, deltaLabel: 'vs yesterday', trend: 'up' },
  avgBillValue:     { value: 28.46,   delta: 8.7,  deltaLabel: 'vs yesterday', trend: 'up' },
  paymentsReceived: { value: 4200.00, delta: 13.1, deltaLabel: 'vs yesterday', trend: 'up' },
  refunds:          { value: 125.50,  delta: -2.4, deltaLabel: 'vs yesterday', trend: 'down' },
  pendingPayments:  { value: 6,                    deltaLabel: 'Bills',        trend: 'neutral' },
};

export const kitchenKpis = {
  newOrders:         { value: 12, deltaLabel: 'Needs Attention',       trend: 'alert' },
  inProgress:        { value: 18, deltaLabel: 'Being Prepared',        trend: 'warning' },
  readyToServe:      { value: 7,  deltaLabel: 'Waiting to be served',  trend: 'success' },
  completedToday:    { value: 45, deltaLabel: 'Orders',                trend: 'neutral' },
  avgPrepTime:       { value: 18, deltaLabel: 'Per Order',             trend: 'neutral', unit: 'min' },
  kitchenEfficiency: { value: 92, deltaLabel: 'Excellent',             trend: 'success', unit: '%' },
};

export const waiterKpis = {
  myActiveTables:  { value: 6,  deltaLabel: 'of 12 Assigned', trend: 'neutral' },
  activeOrders:    { value: 14, deltaLabel: 'In Progress',    trend: 'neutral' },
  readyToServe:    { value: 5,  deltaLabel: 'Orders',         trend: 'warning' },
  completedOrders: { value: 18, deltaLabel: 'Today',          trend: 'success' },
  newRequests:     { value: 3,  deltaLabel: 'From Tables',    trend: 'alert' },
};

// ─── CHART DATA ───────────────────────────────────────
export const salesOverviewData = [
  { day: 'Mon', revenue: 1400 }, { day: 'Tue', revenue: 2200 }, { day: 'Wed', revenue: 2650 },
  { day: 'Thu', revenue: 2050 }, { day: 'Fri', revenue: 2400 }, { day: 'Sat', revenue: 3200 },
  { day: 'Sun', revenue: 3950 },
];

export const revenueByCategoryData = [
  { name: 'Food',     value: 65, color: '#10B981' },
  { name: 'Drinks',   value: 20, color: '#3B82F6' },
  { name: 'Desserts', value: 10, color: '#F59E0B' },
  { name: 'Others',   value: 5,  color: '#8B5CF6' },
];

export const monthlyPerformanceData = [
  { week: 'Week 1', revenue: 3650 }, { week: 'Week 2', revenue: 5420 },
  { week: 'Week 3', revenue: 7280 }, { week: 'Week 4', revenue: 8950 },
];

export const notifications = [
  { id: 1, user_id: 1, title: 'New order received', message: 'Order #ORD-1250 at Table 5', type: 'order', is_read: false, created_at: '2025-05-20T10:30:00' },
  { id: 2, user_id: 1, title: 'Low stock alert', message: 'Chicken Breast running low', type: 'inventory', is_read: false, created_at: '2025-05-20T09:50:00' },
];