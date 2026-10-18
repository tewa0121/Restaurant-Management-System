const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ============================================================================
// MOCK DATABASE (Based on your 47-table schema)
// ============================================================================
let db = {
  users: [
    { id: 1, name: "Admin User", role: "Super Administrator", email: "admin@resto.com", avatar: "/avatars/admin.png", restaurant_id: 1 },
    { id: 2, name: "Michael Cashier", role: "Cashier", email: "michael@resto.com", avatar: "/avatars/cashier.png", restaurant_id: 1 },
    { id: 3, name: "Kitchen Staff", role: "Kitchen Staff", email: "chef@resto.com", avatar: "/avatars/chef.png", restaurant_id: 1 },
    { id: 4, name: "John Manager", role: "Restaurant Manager", email: "john@resto.com", avatar: "/avatars/manager.png", restaurant_id: 1 },
    { id: 5, name: "David Waiter", role: "Waiter", email: "david@resto.com", avatar: "/avatars/waiter.png", restaurant_id: 1 }
  ],
  tables: [
    { id: 1, table_number: "1", capacity: 2, status: "available", assigned_waiter_id: 5 },
    { id: 2, table_number: "2", capacity: 2, status: "available", assigned_waiter_id: 5 },
    { id: 3, table_number: "3", capacity: 4, status: "occupied", assigned_waiter_id: 5 },
    { id: 4, table_number: "4", capacity: 4, status: "available", assigned_waiter_id: 5 },
    { id: 5, table_number: "5", capacity: 4, status: "occupied", assigned_waiter_id: 5 },
    { id: 6, table_number: "6", capacity: 2, status: "reserved", assigned_waiter_id: null },
    { id: 7, table_number: "7", capacity: 6, status: "occupied", assigned_waiter_id: 5 },
    { id: 8, table_number: "8", capacity: 4, status: "cleaning", assigned_waiter_id: null },
    { id: 9, table_number: "9", capacity: 2, status: "available", assigned_waiter_id: null },
    { id: 10, table_number: "10", capacity: 4, status: "available", assigned_waiter_id: null },
    { id: 11, table_number: "11", capacity: 2, status: "available", assigned_waiter_id: null },
    { id: 12, table_number: "12", capacity: 6, status: "occupied", assigned_waiter_id: 5 }
  ],
  menu_categories: [
    { id: 1, name: "Breakfast", icon: "🍳" },
    { id: 2, name: "Lunch", icon: "🍲" },
    { id: 3, name: "Dinner", icon: "🍽️" },
    { id: 4, name: "Appetizers", icon: "🍟" },
    { id: 5, name: "Drinks", icon: "🥤" },
    { id: 6, name: "Desserts", icon: "🍰" },
    { id: 7, name: "Salads", icon: "🥗" }
  ],
  menu_items: [
    { id: 1, category_id: 3, name: "Grilled Chicken with Veggies", price: 12.99, rating: 4.7, reviews: 320, image: "/images/chicken.png", is_available: true },
    { id: 2, category_id: 2, name: "Beef Burger with Fries", price: 10.99, rating: 4.6, reviews: 280, image: "/images/burger.png", is_available: true },
    { id: 3, category_id: 3, name: "Margherita Pizza", price: 11.99, rating: 4.8, reviews: 420, image: "/images/pizza.png", is_available: true },
    { id: 4, category_id: 3, name: "Pasta Alfredo", price: 11.49, rating: 4.6, reviews: 210, image: "/images/pasta.png", is_available: true },
    { id: 5, category_id: 3, name: "Chicken Biryani", price: 13.49, rating: 4.7, reviews: 310, image: "/images/biryani.png", is_available: true },
    { id: 6, category_id: 5, name: "Fresh Orange Juice", price: 3.49, rating: 4.5, reviews: 150, image: "/images/juice.png", is_available: true },
    { id: 7, category_id: 6, name: "Chocolate Lava Cake", price: 5.99, rating: 4.9, reviews: 500, image: "/images/cake.png", is_available: true }
  ],
  customers: [
    { id: 1, first_name: "John", last_name: "Smith", email: "john@example.com", phone: "555-1001" },
    { id: 2, first_name: "Sarah", last_name: "Johnson", email: "sarah@example.com", phone: "555-1002" },
    { id: 3, first_name: "Michael", last_name: "Brown", email: "michael@example.com", phone: "555-1003" }
  ],
  orders: [
    { id: 1, order_number: "ORD-1250", customer_id: 1, table_id: 5, waiter_id: 5, status: "completed", total_amount: 45.50, ordered_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 2, order_number: "ORD-1249", customer_id: 2, table_id: 12, waiter_id: 5, status: "preparing", total_amount: 78.20, ordered_at: new Date(Date.now() - 3000000).toISOString() },
    { id: 3, order_number: "ORD-1248", customer_id: 3, table_id: 3, waiter_id: 5, status: "pending", total_amount: 32.00, ordered_at: new Date(Date.now() - 2400000).toISOString() },
    { id: 4, order_number: "ORD-1247", customer_id: 1, table_id: 7, waiter_id: 5, status: "preparing", total_amount: 67.80, ordered_at: new Date(Date.now() - 1800000).toISOString() }
  ],
  order_items: [
    { id: 1, order_id: 1, menu_item_id: 1, quantity: 2, unit_price: 12.99, item_status: "ready", preparation_progress: 100 },
    { id: 2, order_id: 2, menu_item_id: 3, quantity: 3, unit_price: 11.99, item_status: "preparing", preparation_progress: 60 },
    { id: 3, order_id: 2, menu_item_id: 4, quantity: 2, unit_price: 11.49, item_status: "preparing", preparation_progress: 45 },
    { id: 4, order_id: 3, menu_item_id: 2, quantity: 2, unit_price: 10.99, item_status: "pending", preparation_progress: 0 },
    { id: 5, order_id: 4, menu_item_id: 5, quantity: 2, unit_price: 13.49, item_status: "preparing", preparation_progress: 70 }
  ],
  invoices: [
    { id: 1, order_id: 1, invoice_number: "BILL-152", total: 45.50, status: "paid", payment_method: "Card" },
    { id: 2, order_id: 2, invoice_number: "BILL-151", total: 78.20, status: "unpaid", payment_method: "Cash" },
    { id: 3, order_id: 3, invoice_number: "BILL-150", total: 32.00, status: "unpaid", payment_method: "Mobile Banking" },
    { id: 4, order_id: 4, invoice_number: "BILL-149", total: 67.80, status: "paid", payment_method: "Card" }
  ],
  inventory: [
    { id: 1, name: "Tomato", current_stock: 5, min_stock_level: 10, unit: "kg" },
    { id: 2, name: "Chicken Breast", current_stock: 2, min_stock_level: 8, unit: "kg" },
    { id: 3, name: "Cooking Oil", current_stock: 1.5, min_stock_level: 5, unit: "L" },
    { id: 4, name: "Cheese", current_stock: 3, min_stock_level: 5, unit: "kg" }
  ],
  notifications: [
    { id: 1, title: "New user registered", message: "Waiter - John Doe", time: "2 min ago", type: "user" },
    { id: 2, title: "New order received", message: "Order #ORD-1251", time: "5 min ago", type: "order" },
    { id: 3, title: "Payment received", message: "$78.20 from Order #1249", time: "10 min ago", type: "payment" },
    { id: 4, title: "Low stock alert", message: "Tomato is running low", time: "15 min ago", type: "alert" }
  ]
};

// ============================================================================
// API ROUTES
// ============================================================================

// 1. AUTH
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (user) {
    res.json({ success: true, token: "mock-jwt-token-12345", user });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// 2. ADMIN DASHBOARD
app.get('/api/dashboard/admin', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  
  res.json({
    stats: {
      totalOrders: { value: "1,248", change: "+12.5%" },
      todayRevenue: { value: "$4,325.50", change: "+8.3%" },
      availableTables: { value: db.tables.filter(t => t.status === 'available').length.toString(), change: "+5" },
      totalCustomers: { value: "856", change: "+11.7%" },
      pendingOrders: { value: db.orders.filter(o => o.status === 'pending').length.toString(), change: "-3" },
      inventoryAlerts: { value: db.inventory.filter(i => i.current_stock <= i.min_stock_level).length.toString(), change: "-2" }
    },
    salesOverview: [
      { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
      { name: "Thu", sales: 2600 }, { name: "Fri", sales: 3400 }, { name: "Sat", sales: 2900 }, { name: "Sun", sales: 4250 }
    ],
    revenueByCategory: [
      { name: "Food", value: 65, fill: "#4F46E5" },
      { name: "Drinks", value: 20, fill: "#10B981" },
      { name: "Desserts", value: 10, fill: "#F59E0B" },
      { name: "Others", value: 5, fill: "#3B82F6" }
    ],
    recentOrders: db.orders.map(o => {
      const cust = db.customers.find(c => c.id === o.customer_id);
      return {
        id: o.order_number,
        customer: `${cust.first_name} ${cust.last_name}`,
        table: `Table ${o.table_id}`,
        items: db.order_items.filter(oi => oi.order_id === o.id).length,
        amount: o.total_amount,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }),
    inventoryAlerts: db.inventory.filter(i => i.current_stock <= i.min_stock_level).map(i => ({
      item: i.name,
      status: "Low Stock",
      quantity: `${i.current_stock} ${i.unit} left`
    })),
    systemActivity: db.notifications.map(n => ({
      title: n.title,
      desc: n.message,
      time: n.time,
      icon: n.type
    }))
  });
});

// 3. KITCHEN DASHBOARD
app.get('/api/dashboard/kitchen', (req, res) => {
  const incoming = db.orders.filter(o => o.status === 'pending');
  const inProgress = db.orders.filter(o => o.status === 'preparing');

  res.json({
    stats: {
      newOrders: incoming.length,
      inProgress: inProgress.length,
      readyToServe: db.order_items.filter(oi => oi.item_status === 'ready').length,
      completedToday: 45,
      avgPrepTime: "18 min",
      efficiency: "92%"
    },
    incomingOrders: incoming.map(o => ({
      id: o.order_number,
      table: `Table ${o.table_id}`,
      items: db.order_items.filter(oi => oi.order_id === o.id).length,
      time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      priority: o.total_amount > 50 ? "High" : "Medium"
    })),
    inProgressOrders: inProgress.map(o => {
      const items = db.order_items.filter(oi => oi.order_id === o.id);
      return {
        id: o.order_number,
        table: `Table ${o.table_id}`,
        items: items.length,
        started: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        stage: items[0]?.item_status === 'preparing' ? "Main Course" : "Appetizer",
        progress: items[0]?.preparation_progress || 0
      };
    }),
    alerts: [
      { type: "alert", text: "Low stock: Chicken Breast", detail: "Only 2 kg left", time: "10 min ago" },
      { type: "alert", text: "Low stock: Cooking Oil", detail: "Only 1.5 L left", time: "20 min ago" }
    ]
  });
});

// 4. WAITER DASHBOARD
app.get('/api/dashboard/waiter', (req, res) => {
  const waiterId = 5; // Hardcoded for mock
  const myTables = db.tables.filter(t => t.assigned_waiter_id === waiterId);

  res.json({
    stats: {
      activeTables: myTables.filter(t => t.status === 'occupied').length,
      assignedTables: myTables.length,
      activeOrders: db.orders.filter(o => o.status !== 'completed').length,
      readyToServe: db.order_items.filter(oi => oi.item_status === 'ready').length,
      completedOrders: db.orders.filter(o => o.status === 'completed').length,
      newRequests: 3
    },
    myTables: myTables.map(t => ({
      table: `Table ${t.table_number}`,
      guests: t.capacity,
      status: t.status === 'occupied' ? 'Ordering' : (t.status === 'available' ? 'Available' : 'Food Preparing'),
      lastOrder: "10:20 AM"
    })),
    customerRequests: [
      { table: "Table 7", request: "Extra Napkins", time: "2 min ago", status: "New" },
      { table: "Table 12", request: "More Water", time: "5 min ago", status: "New" },
      { table: "Table 3", request: "Check on Order", time: "8 min ago", status: "In Progress" }
    ],
    floorOverview: db.tables.map(t => ({
      table: t.table_number,
      status: t.status === 'available' ? 'available' : (t.status === 'occupied' ? 'ordering' : 'preparing')
    }))
  });
});

// 5. CASHIER DASHBOARD
app.get('/api/dashboard/cashier', (req, res) => {
  res.json({
    stats: {
      todayRevenue: "$4,325.50",
      totalBills: db.invoices.length.toString(),
      avgBillValue: "$28.46",
      paymentsReceived: "$4,200.00",
      refunds: "$125.50",
      pendingPayments: db.invoices.filter(i => i.status === 'unpaid').length.toString()
    },
    recentBills: db.invoices.map(inv => {
      const order = db.orders.find(o => o.id === inv.order_id);
      const cust = db.customers.find(c => c.id === order.customer_id);
      return {
        id: inv.invoice_number,
        table: `Table ${order.table_id}`,
        customer: `${cust.first_name} ${cust.last_name}`,
        amount: inv.total,
        method: inv.payment_method,
        status: inv.status === 'paid' ? 'Paid' : 'Pending',
        time: new Date(order.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
    }),
    paymentMethods: [
      { name: "Cash", value: 45, amount: 1890.00, color: "#10B981" },
      { name: "Card", value: 35, amount: 1470.00, color: "#3B82F6" },
      { name: "Mobile Banking", value: 15, amount: 630.00, color: "#F59E0B" },
      { name: "Other", value: 5, amount: 210.00, color: "#8B5CF6" }
    ]
  });
});

// 6. CUSTOMER PORTAL (RestoDelight)
app.get('/api/customer/home', (req, res) => {
  res.json({
    categories: db.menu_categories,
    popularDishes: db.menu_items.map(item => ({
      ...item,
      isFavorite: false
    }))
  });
});

app.get('/api/customer/cart', (req, res) => {
  res.json({
    cart: [
      { id: 3, name: "Margherita Pizza", price: 11.99, quantity: 1, image: "/images/pizza.png" },
      { id: 6, name: "Fresh Orange Juice", price: 3.49, quantity: 1, image: "/images/juice.png" },
      { id: 4, name: "Pasta Alfredo", price: 11.49, quantity: 1, image: "/images/pasta.png" },
      { id: 7, name: "Chocolate Lava Cake", price: 5.99, quantity: 1, image: "/images/cake.png" }
    ],
    totals: {
      subtotal: 32.96,
      deliveryFee: 2.99,
      tax: 2.88,
      total: 38.83
    }
  });
});

// 7. MANAGER DASHBOARD
app.get('/api/dashboard/manager', (req, res) => {
  res.json({
    stats: {
      totalOrders: "128",
      todayRevenue: "$4,325.50",
      availableTables: `${db.tables.filter(t => t.status === 'available').length} / 36`,
      pendingOrders: db.orders.filter(o => o.status === 'pending').length.toString(),
      reservationsToday: "12",
      lowStockItems: db.inventory.filter(i => i.current_stock <= i.min_stock_level).length.toString()
    },
    pendingOrders: db.orders.filter(o => o.status === 'pending' || o.status === 'preparing').map(o => ({
      table: `Table ${o.table_id}`,
      items: db.order_items.filter(oi => oi.order_id === o.id).length,
      status: o.status === 'pending' ? 'Pending' : 'Preparing',
      time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })),
    todayReservations: [
      { time: "7:00 PM", table: "Table 8", guests: 2 },
      { time: "7:30 PM", table: "Table 12", guests: 4 },
      { time: "8:00 PM", table: "Table 3", guests: 3 },
      { time: "8:30 PM", table: "Table 15", guests: 6 }
    ],
    tableStatus: [
      { status: "Available", count: db.tables.filter(t => t.status === 'available').length, color: "green" },
      { status: "Occupied", count: db.tables.filter(t => t.status === 'occupied').length, color: "orange" },
      { status: "Reserved", count: db.tables.filter(t => t.status === 'reserved').length, color: "blue" },
      { status: "Cleaning", count: db.tables.filter(t => t.status === 'cleaning').length, color: "purple" }
    ]
  });
});

// ============================================================================
// START SERVER
// ============================================================================
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Mock API running on http://localhost:${PORT}`);
  console.log(`\nAvailable Endpoints:`);
  console.log(`  POST   /api/auth/login`);
  console.log(`  GET    /api/dashboard/admin`);
  console.log(`  GET    /api/dashboard/kitchen`);
  console.log(`  GET    /api/dashboard/waiter`);
  console.log(`  GET    /api/dashboard/cashier`);
  console.log(`  GET    /api/dashboard/manager`);
  console.log(`  GET    /api/customer/home`);
  console.log(`  GET    /api/customer/cart\n`);
});