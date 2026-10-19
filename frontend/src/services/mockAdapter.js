// src/services/mockAdapter.js
import { mockDatabase } from '../data/mockData';

const formatTime = (iso) => iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

// ============================================================================
// AUTH (Login Page)
// ============================================================================
export const mockLogin = (email) => {
  const user = mockDatabase.users.find(u => u.email === email);
  if (!user) throw new Error("Invalid email or password");
  return {
    success: true,
    token: "mock-jwt-token-" + user.id,
    user: { id: user.id, name: user.full_name, role: user.role, email: user.email, avatar: user.avatar_url }
  };
};

// ============================================================================
// 1. ADMIN DASHBOARD (Screenshot 1)
// ============================================================================
export const getAdminDashboardData = () => {
  const db = mockDatabase;
  return {
    stats: {
      totalOrders:     { value: "1,248",    change: "+12.5%", trend: "up" },
      todayRevenue:    { value: "$4,325.50",change: "+8.3%",  trend: "up" },
      availableTables: { value: "24",       change: "+5",    trend: "up" },
      totalCustomers:  { value: "856",      change: "+11.7%", trend: "up" },
      pendingOrders:   { value: "18",       change: "-3",    trend: "down" },
      inventoryAlerts: { value: "7",        change: "-2",    trend: "down" }
    },
    salesOverview: [
      { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
      { name: "Thu", sales: 2600 }, { name: "Fri", sales: 3400 }, { name: "Sat", sales: 2900 }, { name: "Sun", sales: 4250 }
    ],
    revenueByCategory: [
      { name: "Food", value: 65, fill: "#6366F1" },
      { name: "Drinks", value: 20, fill: "#10B981" },
      { name: "Desserts", value: 10, fill: "#F59E0B" },
      { name: "Others", value: 5, fill: "#3B82F6" }
    ],
    revenueTotal: "$4,325.50",
    recentOrders: [
      { id: "ORD-1250", customer: "John Smith",    table: "Table 5",  items: 3, amount: 45.50, status: "Completed", time: "10:30 AM" },
      { id: "ORD-1249", customer: "Sarah Johnson", table: "Table 12", items: 5, amount: 78.20, status: "Preparing", time: "10:25 AM" },
      { id: "ORD-1248", customer: "Michael Brown", table: "Table 3",  items: 2, amount: 32.00, status: "Pending",   time: "10:20 AM" },
      { id: "ORD-1247", customer: "Emily Davis",   table: "Table 7",  items: 4, amount: 67.80, status: "Served",    time: "10:15 AM" },
      { id: "ORD-1246", customer: "David Wilson",  table: "Table 1",  items: 3, amount: 29.40, status: "Completed", time: "10:10 AM" }
    ],
    systemOverview: {
      totalUsers: 56, totalRestaurants: 3, systemStatus: "Operational", storageUsage: "67%", activeSessions: 23
    },
    inventoryAlerts: mockDatabase.ingredients.filter(i => i.current_stock <= i.min_stock_level).map(i => ({
      item: i.name, status: "Low Stock", quantity: `${i.current_stock} ${i.unit} left`, icon: i.image_url
    })),
    systemActivity: [
      { title: "New user registered", desc: "Waiter - John Doe",     time: "2 min ago",  type: "user"    },
      { title: "New order received",  desc: "Order #ORD-1251",        time: "5 min ago",  type: "order"   },
      { title: "Payment received",    desc: "$78.20 from Order #1249", time: "10 min ago", type: "payment" },
      { title: "Low stock alert",     desc: "Tomato is running low",   time: "15 min ago", type: "alert"   }
    ]
  };
};

// ============================================================================
// 2. CASHIER DASHBOARD (Screenshot 2)
// ============================================================================
export const getCashierDashboardData = () => {
  return {
    stats: {
      todayRevenue:    { value: "$4,325.50", change: "+12.3%", trend: "up" },
      totalBills:      { value: "152",       change: "+15.2%", trend: "up" },
      avgBillValue:    { value: "$28.46",    change: "+8.7%",  trend: "up" },
      paymentsReceived:{ value: "$4,200.00", change: "+13.1%", trend: "up" },
      refunds:         { value: "$125.50",   change: "-2.4%",  trend: "down" },
      pendingPayments: { value: "6",         change: "",       trend: "neutral" }
    },
    revenueOverview: [
      { name: "12 AM", value: 500 },  { name: "4 AM", value: 800 },
      { name: "8 AM", value: 1600 },  { name: "12 PM", value: 2450 },
      { name: "4 PM", value: 1900 },  { name: "8 PM", value: 2800 },
      { name: "12 AM", value: 3600 }
    ],
    paymentMethods: [
      { name: "Cash",           value: 45, amount: 1890.00, color: "#10B981" },
      { name: "Card",           value: 35, amount: 1470.00, color: "#3B82F6" },
      { name: "Mobile Banking", value: 15, amount: 630.00,  color: "#F59E0B" },
      { name: "Other",          value: 5,  amount: 210.00,  color: "#8B5CF6" }
    ],
    totalReceived: "$4,200.00",
    recentBills: [
      { id: "BILL-152", table: "Table 5",  customer: "John Smith",    amount: 45.50, method: "Card",          status: "Paid",    time: "10:30 AM" },
      { id: "BILL-151", table: "Table 12", customer: "Sarah Johnson", amount: 78.20, method: "Cash",          status: "Paid",    time: "10:25 AM" },
      { id: "BILL-150", table: "Table 3",  customer: "Michael Brown", amount: 32.00, method: "Mobile Banking", status: "Paid",    time: "10:20 AM" },
      { id: "BILL-149", table: "Table 7",  customer: "Emily Davis",   amount: 67.80, method: "Card",          status: "Paid",    time: "10:15 AM" },
      { id: "BILL-148", table: "Table 1",  customer: "David Wilson",  amount: 29.40, method: "Cash",          status: "Pending", time: "10:10 AM" }
    ],
    pendingPayments: [
      { id: "BILL-154", table: "Table 8",  amount: 54.30, time: "5 min ago"  },
      { id: "BILL-153", table: "Table 10", amount: 36.20, time: "8 min ago"  },
      { id: "BILL-152", table: "Table 9",  amount: 41.70, time: "12 min ago" },
      { id: "BILL-151", table: "Table 6",  amount: 29.90, time: "15 min ago" },
      { id: "BILL-150", table: "Table 14", amount: 63.50, time: "18 min ago" }
    ],
    salesByHour: [
      { hour: "12 AM", sales: 120 }, { hour: "3 AM", sales: 80  },
      { hour: "6 AM", sales: 300 },  { hour: "9 AM", sales: 800 },
      { hour: "12 PM", sales: 1500 },{ hour: "3 PM", sales: 1100},
      { hour: "6 PM", sales: 950 },  { hour: "9 PM", sales: 480 }
    ],
    notifications: [
      { message: "Payment received for Bill #BILL-151 (Table 12)", time: "2 min ago",  color: "green"  },
      { message: "New bill created for Table 8",                   time: "5 min ago",  color: "purple" },
      { message: "Payment pending for Bill #BILL-154 (Table 8)",   time: "8 min ago",  color: "orange" },
      { message: "Refund processed for Bill #BILL-147",            time: "15 min ago", color: "red"    }
    ]
  };
};

// ============================================================================
// 3. KITCHEN DASHBOARD (Screenshot 4)
// ============================================================================
export const getKitchenDashboardData = () => {
  return {
    stats: {
      newOrders:      { value: "12",    sub: "Needs Attention",     color: "red"    },
      inProgress:     { value: "18",    sub: "Being Prepared",      color: "orange" },
      readyToServe:   { value: "7",     sub: "Waiting to be served",color: "green"  },
      completedToday: { value: "45",    sub: "Orders",              color: "blue"   },
      avgPrepTime:    { value: "18 min",sub: "Per Order",           color: "purple" },
      efficiency:     { value: "92%",   sub: "Excellent",           color: "green"  }
    },
    incomingOrders: [
      { id: "ORD-1250", table: "Table 5",  items: 3, time: "10:20 AM", priority: "High"   },
      { id: "ORD-1249", table: "Table 7",  items: 4, time: "10:18 AM", priority: "High"   },
      { id: "ORD-1248", table: "Table 12", items: 5, time: "10:15 AM", priority: "Medium" },
      { id: "ORD-1247", table: "Table 3",  items: 2, time: "10:10 AM", priority: "Medium" },
      { id: "ORD-1246", table: "Table 15", items: 3, time: "10:08 AM", priority: "Low"    }
    ],
    orderStatusOverview: {
      new:        { count: 12, items: [{ id: "ORD-1250", detail: "Table 5 • 3 items",  time: "10:20 AM" }] },
      inProgress: { count: 18, items: [{ id: "ORD-1245", detail: "Table 1 • 3 items",  time: "Started 10:05 AM" }] },
      ready:      { count: 7,  items: [{ id: "ORD-1242", detail: "Table 3 • 2 items",  time: "Ready 10:12 AM" }] },
      completed:  { count: 45, items: [{ id: "ORD-1239", detail: "Table 5 • 3 items",  time: "10:00 AM" }] }
    },
    inProgressOrders: [
      { id: "ORD-1245", table: "Table 1",  items: 3, started: "10:05 AM", stage: "Main Course", progress: 60 },
      { id: "ORD-1244", table: "Table 8",  items: 2, started: "10:02 AM", stage: "Appetizer",   progress: 45 },
      { id: "ORD-1243", table: "Table 10", items: 4, started: "9:58 AM",  stage: "Main Course", progress: 70 },
      { id: "ORD-1242", table: "Table 3",  items: 2, started: "9:55 AM",  stage: "Drinks",      progress: 90 },
      { id: "ORD-1236", table: "Table 14", items: 3, started: "9:50 AM",  stage: "Main Course", progress: 30 }
    ],
    kitchenAlerts: [
      { type: "alert",   title: "Low stock: Chicken Breast", detail: "Only 1.5 kg left",    time: "10 min ago" },
      { type: "alert",   title: "Low stock: Cooking Oil",    detail: "Only 1 L left",          time: "20 min ago" },
      { type: "warning", title: "Order #ORD-1250 is waiting",detail: "for 15 minutes",       time: "25 min ago" },
      { type: "info",    title: "New order received",        detail: "Order #ORD-1251 (Table 6)", time: "30 min ago" }
    ],
    todaySummary: {
      totalOrders: 82, completedOrders: 45, avgPrepTime: "18 min",
      readyToServe: 7, efficiency: "92%", ordersDelayed: 2
    },
    recentCompleted: [
      { id: "ORD-1239", table: "Table 5",  items: 3, time: "10:00 AM" },
      { id: "ORD-1238", table: "Table 7",  items: 4, time: "9:58 AM"  },
      { id: "ORD-1237", table: "Table 12", items: 2, time: "9:55 AM"  },
      { id: "ORD-1236", table: "Table 1",  items: 3, time: "9:50 AM"  },
      { id: "ORD-1235", table: "Table 10", items: 4, time: "9:45 AM"  },
      { id: "ORD-1234", table: "Table 3",  items: 2, time: "9:40 AM"  }
    ]
  };
};

// ============================================================================
// 4. WAITER DASHBOARD (Screenshot 7)
// ============================================================================
export const getWaiterDashboardData = () => {
  return {
    stats: {
      activeTables:    { value: "6",  sub: "of 12 Assigned" },
      activeOrders:    { value: "14", sub: "In Progress" },
      readyToServe:    { value: "5",  sub: "Orders" },
      completedOrders: { value: "18", sub: "Today" },
      newRequests:     { value: "3",  sub: "From Tables" }
    },
    myTables: [
      { table: "Table 5",  guests: 4, status: "Ordering",      lastOrder: "10:20 AM" },
      { table: "Table 7",  guests: 2, status: "Food Preparing", lastOrder: "10:18 AM" },
      { table: "Table 12", guests: 6, status: "Ready to Serve", lastOrder: "10:15 AM" },
      { table: "Table 3",  guests: 3, status: "Ordering",      lastOrder: "10:10 AM" },
      { table: "Table 15", guests: 2, status: "Food Preparing", lastOrder: "10:08 AM" },
      { table: "Table 8",  guests: 5, status: "Ready to Serve", lastOrder: "10:05 AM" }
    ],
    orderStatus: { total: 14, pending: 4, preparing: 5, ready: 5, served: 0 },
    recentOrders: [
      { id: "ORD-1250", table: "Table 5",  items: 3, status: "Preparing", time: "10:20 AM" },
      { id: "ORD-1249", table: "Table 7",  items: 4, status: "Preparing", time: "10:18 AM" },
      { id: "ORD-1248", table: "Table 12", items: 5, status: "Ready",     time: "10:15 AM" },
      { id: "ORD-1247", table: "Table 3",  items: 2, status: "Preparing", time: "10:10 AM" },
      { id: "ORD-1246", table: "Table 15", items: 3, status: "Pending",   time: "10:08 AM" }
    ],
    customerRequests: [
      { table: "Table 7",  request: "Extra Napkins",  time: "2 min ago", status: "New"    },
      { table: "Table 12", request: "More Water",     time: "5 min ago", status: "New"    },
      { table: "Table 3",  request: "Check on Order", time: "8 min ago", status: "In Progress" }
    ],
    todaySummary: { ordersTaken: 28, ordersServed: 18, avgOrderTime: "24 min", revenue: "$1,245.50" },
    floorOverview: [
      { table: "1", status: "available" }, { table: "2", status: "available" },
      { table: "3", status: "ordering"  }, { table: "4", status: "available" },
      { table: "5", status: "ordering"  }, { table: "6", status: "available" },
      { table: "7", status: "preparing" }, { table: "8", status: "available" },
      { table: "9", status: "available" }, { table: "10", status: "available" },
      { table: "11", status: "available" },{ table: "12", status: "ready"     },
      { table: "13", status: "available" },{ table: "14", status: "available" },
      { table: "15", status: "ordering" }, { table: "16", status: "available" },
      { table: "17", status: "available" },{ table: "18", status: "available" }
    ],
    notifications: [
      { message: "Order #ORD-1248 from Table 12 is ready to serve.", time: "2 min ago"  },
      { message: "New request from Table 7: Extra Napkins",          time: "2 min ago"  },
      { message: "Reservation for Table 8 at 7:00 PM",               time: "15 min ago" }
    ]
  };
};

// ============================================================================
// 5. MANAGER DASHBOARD (Screenshot 6)
// ============================================================================
export const getManagerDashboardData = () => {
  return {
    stats: {
      totalOrders:       { value: "128",       change: "+15.6%", trend: "up" },
      todayRevenue:      { value: "$4,325.50", change: "+12.3%", trend: "up" },
      availableTables:   { value: "24 / 36",   change: "+5",     trend: "up" },
      pendingOrders:     { value: "18",        change: "-3",     trend: "down" },
      reservationsToday: { value: "12",        change: "+2",     trend: "up" },
      lowStockItems:     { value: "7",         change: "",       trend: "neutral" }
    },
    salesOverview: [
      { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, { name: "Wed", sales: 1800 },
      { name: "Thu", sales: 2600 }, { name: "Fri", sales: 3400 }, { name: "Sat", sales: 2900 }, { name: "Sun", sales: 4250 }
    ],
    revenueByCategory: [
      { name: "Food", value: 65, fill: "#10B981" },
      { name: "Drinks", value: 20, fill: "#3B82F6" },
      { name: "Desserts", value: 10, fill: "#F59E0B" },
      { name: "Others", value: 5, fill: "#8B5CF6" }
    ],
    revenueTotal: "$4,325.50",
    monthlyPerformance: [
      { name: "Week 1", sales: 3650 }, { name: "Week 2", sales: 5420 },
      { name: "Week 3", sales: 7280 }, { name: "Week 4", sales: 8950 }
    ],
    pendingOrders: [
      { table: "Table 5",  items: 3, status: "Preparing", time: "10:20 AM" },
      { table: "Table 12", items: 5, status: "Preparing", time: "10:18 AM" },
      { table: "Table 7",  items: 2, status: "Pending",   time: "10:15 AM" },
      { table: "Table 3",  items: 4, status: "Pending",   time: "10:10 AM" }
    ],
    todayReservations: [
      { time: "7:00 PM", table: "Table 8",  guests: 2 },
      { time: "7:30 PM", table: "Table 12", guests: 4 },
      { time: "8:00 PM", table: "Table 3",  guests: 3 },
      { time: "8:30 PM", table: "Table 15", guests: 6 }
    ],
    tableStatus: [
      { status: "Available", count: 24, color: "green"  },
      { status: "Occupied",  count: 8,  color: "orange" },
      { status: "Reserved",  count: 4,  color: "blue"   },
      { status: "Cleaning",  count: 2,  color: "purple" },
      { status: "Out of Order", count: 2, color: "red"  }
    ],
    recentOrders: [
      { id: "ORD-1250", table: "Table 5",  customer: "John Smith",    items: 3, amount: 45.50, status: "Completed", time: "10:30 AM" },
      { id: "ORD-1249", table: "Table 12", customer: "Sarah Johnson", items: 5, amount: 78.20, status: "Preparing", time: "10:25 AM" },
      { id: "ORD-1248", table: "Table 3",  customer: "Michael Brown", items: 2, amount: 32.00, status: "Preparing", time: "10:20 AM" },
      { id: "ORD-1247", table: "Table 7",  customer: "Emily Davis",   items: 4, amount: 67.80, status: "Served",    time: "10:15 AM" },
      { id: "ORD-1246", table: "Table 1",  customer: "David Wilson",  items: 3, amount: 29.40, status: "Completed", time: "10:10 AM" }
    ],
    lowStockItems: mockDatabase.ingredients.filter(i => i.current_stock <= i.min_stock_level).map(i => ({
      item: i.name, quantity: `${i.current_stock} ${i.unit} left`, icon: i.image_url
    })),
    notifications: [
      { message: "New order received at Table 5",                 time: "5 min ago"  },
      { message: "Reservation for Table 8 at 7:00 PM",            time: "15 min ago" },
      { message: "Low stock alert for Chicken Breast",            time: "30 min ago" },
      { message: "Payment received for Order #ORD-1247",          time: "1 hour ago" }
    ]
  };
};

// ============================================================================
// 6. CUSTOMER PORTAL (Screenshot 3)
// ============================================================================
export const getCustomerPortalData = () => {
  return {
    categories: [
      { id: 1, name: "Breakfast",  icon: "🍳" }, { id: 2, name: "Lunch",    icon: "🍲" },
      { id: 3, name: "Dinner",     icon: "🍽️" }, { id: 4, name: "Appetizers",icon: "🍟" },
      { id: 5, name: "Drinks",     icon: "🥤" }, { id: 6, name: "Desserts",  icon: "🍰" },
      { id: 7, name: "Salads",     icon: "🥗" }
    ],
    popularDishes: mockDatabase.menu_items.map(item => ({
      ...item,
      rating: 4.5 + (item.id % 5) * 0.1,
      reviews: 100 + item.id * 20,
      isFavorite: mockDatabase.favorites.some(f => f.menu_item_id === item.id)
    })),
    cart: [
      { id: 3, name: "Margherita Pizza",    price: 11.99, quantity: 1, image_url: "/assets/food-placeholders/food-pizza.png" },
      { id: 6, name: "Fresh Orange Juice",  price: 3.49,  quantity: 1, image_url: "/assets/food-placeholders/food-juice.png" },
      { id: 4, name: "Pasta Alfredo",       price: 11.49, quantity: 1, image_url: "/assets/food-placeholders/food-pasta-alfredo.png" },
      { id: 7, name: "Chocolate Lava Cake", price: 5.99,  quantity: 1, image_url: "/assets/food-placeholders/food-chocolate-cake.png" }
    ],
    cartTotals: { subtotal: 32.96, deliveryFee: 2.99, tax: 2.88, total: 38.83 }
  };
};

// ============================================================================
// TEAM-SAFE COMPATIBILITY EXPORTS (Added to prevent breaking team components)
// ============================================================================
export const mockGetMenu = () => mockDatabase.menu_items || [];
export const mockGetTables = () => [
  { id: 1, number: '1', capacity: 4, status: 'available', zone: 'Main Hall' },
  { id: 2, number: '2', capacity: 2, status: 'occupied', zone: 'Main Hall' },
  { id: 3, number: '3', capacity: 6, status: 'reserved', zone: 'VIP Lounge' },
  { id: 4, number: '4', capacity: 4, status: 'available', zone: 'Main Hall' },
  { id: 5, number: '5', capacity: 8, status: 'occupied', zone: 'Terrace' },
  { id: 6, number: '6', capacity: 2, status: 'available', zone: 'Terrace' },
];
export const mockGetStaff = () => mockDatabase.users || [];
export const mockGetOrders = () => getAdminDashboardData().recentOrders;
export const mockCreateOrder = (orderData) => {
  return { 
    success: true, 
    orderId: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
    message: 'Order created successfully.'
  };
};