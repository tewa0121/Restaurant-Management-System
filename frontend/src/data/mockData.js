// src/data/mockData.js
// Matches the 47-table schema AND all 7 UI screenshots exactly.

export const mockDatabase = {
  // ===== RESTAURANTS =====
  restaurants: [
    { id: 1, name: "Main Branch", address: "123 Main St", phone: "555-0100", is_active: true }
  ],

  // ===== USERS & ROLES (Login Screen) =====
  users: [
    { id: 1, restaurant_id: 1, username: "admin",   email: "admin@resto.com",   full_name: "Admin User",      role: "Super Administrator", avatar_url: "/avatars/admin.png",   is_active: true },
    { id: 2, restaurant_id: 1, username: "michael", email: "michael@resto.com", full_name: "Michael Cashier", role: "Cashier",             avatar_url: "/avatars/cashier.png", is_active: true },
    { id: 3, restaurant_id: 1, username: "chef",    email: "chef@resto.com",    full_name: "Kitchen Staff",   role: "Kitchen Staff",       avatar_url: "/avatars/chef.png",    is_active: true },
    { id: 4, restaurant_id: 1, username: "john",    email: "john@resto.com",    full_name: "John Manager",    role: "Restaurant Manager",  avatar_url: "/avatars/manager.png", is_active: true },
    { id: 5, restaurant_id: 1, username: "david",   email: "david@resto.com",   full_name: "David Waiter",    role: "Waiter",              avatar_url: "/avatars/waiter.png",  is_active: true }
  ],

  // ===== CUSTOMERS =====
  customers: [
    { id: 1, first_name: "John",    last_name: "Smith",   email: "john@example.com",    phone: "555-1001", loyalty_points: 120, is_vip: false },
    { id: 2, first_name: "Sarah",   last_name: "Johnson", email: "sarah@example.com",   phone: "555-1002", loyalty_points: 340, is_vip: true },
    { id: 3, first_name: "Michael", last_name: "Brown",   email: "michael@example.com", phone: "555-1003", loyalty_points: 50,  is_vip: false },
    { id: 4, first_name: "Emily",   last_name: "Davis",   email: "emily@example.com",   phone: "555-1004", loyalty_points: 210, is_vip: false },
    { id: 5, first_name: "David",   last_name: "Wilson",  email: "david@example.com",   phone: "555-1005", loyalty_points: 80,  is_vip: false },
    { id: 6, first_name: "Jessica", last_name: "Taylor",  email: "jess@example.com",    phone: "555-1006", loyalty_points: 400, is_vip: true }
  ],

  // ===== EMPLOYEES =====
  employees: [
    { id: 1, restaurant_id: 1, first_name: "David",   last_name: "Waiter",  position: "Waiter",        employee_code: "EMP-001", is_active: true },
    { id: 2, restaurant_id: 1, first_name: "Michael", last_name: "Cashier", position: "Cashier",       employee_code: "EMP-002", is_active: true },
    { id: 3, restaurant_id: 1, first_name: "Kitchen", last_name: "Staff",   position: "Kitchen Staff", employee_code: "EMP-003", is_active: true },
    { id: 4, restaurant_id: 1, first_name: "John",    last_name: "Manager", position: "Manager",       employee_code: "EMP-004", is_active: true }
  ],

  // ===== TABLES (Waiter Floor Overview) =====
  tables: [
    { id: 1,  table_number: "1",  capacity: 2, status: "available",  assigned_waiter_id: 1 },
    { id: 2,  table_number: "2",  capacity: 2, status: "available",  assigned_waiter_id: 1 },
    { id: 3,  table_number: "3",  capacity: 4, status: "occupied",   assigned_waiter_id: 1 },
    { id: 4,  table_number: "4",  capacity: 4, status: "available",  assigned_waiter_id: 1 },
    { id: 5,  table_number: "5",  capacity: 4, status: "occupied",   assigned_waiter_id: 1 },
    { id: 6,  table_number: "6",  capacity: 2, status: "reserved",   assigned_waiter_id: null },
    { id: 7,  table_number: "7",  capacity: 6, status: "occupied",   assigned_waiter_id: 1 },
    { id: 8,  table_number: "8",  capacity: 4, status: "cleaning",   assigned_waiter_id: null },
    { id: 9,  table_number: "9",  capacity: 2, status: "available",  assigned_waiter_id: null },
    { id: 10, table_number: "10", capacity: 4, status: "available",  assigned_waiter_id: null },
    { id: 11, table_number: "11", capacity: 2, status: "available",  assigned_waiter_id: null },
    { id: 12, table_number: "12", capacity: 6, status: "occupied",   assigned_waiter_id: 1 },
    { id: 13, table_number: "13", capacity: 4, status: "available",  assigned_waiter_id: null },
    { id: 14, table_number: "14", capacity: 4, status: "available",  assigned_waiter_id: null },
    { id: 15, table_number: "15", capacity: 2, status: "occupied",   assigned_waiter_id: 1 },
    { id: 16, table_number: "16", capacity: 8, status: "out_of_order", assigned_waiter_id: null }
  ],

  // ===== RESERVATIONS (Manager Dashboard) =====
  reservations: [
    { id: 1, customer_id: 2, table_id: 6,  reservation_date: "2025-05-20", reservation_time: "19:00:00", guest_count: 2, status: "confirmed" },
    { id: 2, customer_id: 4, table_id: 8,  reservation_date: "2025-05-20", reservation_time: "19:30:00", guest_count: 4, status: "pending"   },
    { id: 3, customer_id: 5, table_id: 12, reservation_date: "2025-05-20", reservation_time: "20:00:00", guest_count: 6, status: "confirmed" },
    { id: 4, customer_id: 6, table_id: 3,  reservation_date: "2025-05-20", reservation_time: "20:30:00", guest_count: 6, status: "confirmed" }
  ],

  // ===== MENU =====
  menu_categories: [
    { id: 1, name: "Breakfast" }, { id: 2, name: "Lunch" },  { id: 3, name: "Dinner" },
    { id: 4, name: "Appetizers" },{ id: 5, name: "Drinks" }, { id: 6, name: "Desserts" }, { id: 7, name: "Salads" }
  ],

  menu_items: [
    { id: 1, category_id: 3, name: "Grilled Chicken with Veggies", price: 12.99, image_url: "/assets/food-placeholders/food-grilled-chicken.png", is_available: true },
    { id: 2, category_id: 2, name: "Beef Burger with Fries",       price: 10.99, image_url: "/assets/food-placeholders/food-burger-fries.png",   is_available: true },
    { id: 3, category_id: 3, name: "Margherita Pizza",             price: 11.99, image_url: "/assets/food-placeholders/food-pizza.png",          is_available: true },
    { id: 4, category_id: 3, name: "Pasta Alfredo",                price: 11.49, image_url: "/assets/food-placeholders/food-pasta-alfredo.png",  is_available: true },
    { id: 5, category_id: 3, name: "Chicken Biryani",              price: 13.49, image_url: "/assets/food-placeholders/food-biryani.png",        is_available: true },
    { id: 6, category_id: 5, name: "Fresh Orange Juice",           price: 3.49,  image_url: "/assets/food-placeholders/food-juice.png",          is_available: true },
    { id: 7, category_id: 6, name: "Chocolate Lava Cake",          price: 5.99,  image_url: "/assets/food-placeholders/food-chocolate-cake.png", is_available: true }
  ],

  favorites: [
    { customer_id: 1, menu_item_id: 2 },
    { customer_id: 2, menu_item_id: 3 }
  ],

  // ===== ORDERS (All screens use these exact IDs) =====
  orders: [
    { id: 1, order_number: "ORD-1250", customer_id: 1, table_id: 5,  waiter_id: 1, status: "completed", total_amount: 45.50, ordered_at: "2025-05-20T10:30:00Z" },
    { id: 2, order_number: "ORD-1249", customer_id: 2, table_id: 12, waiter_id: 1, status: "preparing", total_amount: 78.20, ordered_at: "2025-05-20T10:25:00Z" },
    { id: 3, order_number: "ORD-1248", customer_id: 3, table_id: 3,  waiter_id: 1, status: "pending",   total_amount: 32.00, ordered_at: "2025-05-20T10:20:00Z" },
    { id: 4, order_number: "ORD-1247", customer_id: 4, table_id: 7,  waiter_id: 1, status: "served",    total_amount: 67.80, ordered_at: "2025-05-20T10:15:00Z" },
    { id: 5, order_number: "ORD-1246", customer_id: 5, table_id: 1,  waiter_id: 1, status: "completed", total_amount: 29.40, ordered_at: "2025-05-20T10:10:00Z" },
    { id: 6, order_number: "ORD-1245", customer_id: 6, table_id: 5,  waiter_id: 1, status: "preparing", total_amount: 55.00, ordered_at: "2025-05-20T10:05:00Z" },
    { id: 7, order_number: "ORD-1244", customer_id: 1, table_id: 8,  waiter_id: 1, status: "preparing", total_amount: 41.00, ordered_at: "2025-05-20T10:02:00Z" },
    { id: 8, order_number: "ORD-1243", customer_id: 2, table_id: 10, waiter_id: 1, status: "preparing", total_amount: 45.00, ordered_at: "2025-05-20T09:58:00Z" },
    { id: 9, order_number: "ORD-1242", customer_id: 3, table_id: 3,  waiter_id: 1, status: "ready",     total_amount: 30.00, ordered_at: "2025-05-20T09:55:00Z" },
    { id:10, order_number: "ORD-1241", customer_id: 4, table_id: 6,  waiter_id: 1, status: "ready",     total_amount: 22.00, ordered_at: "2025-05-20T09:50:00Z" },
    { id:11, order_number: "ORD-1240", customer_id: 5, table_id: 9,  waiter_id: 1, status: "ready",     total_amount: 18.00, ordered_at: "2025-05-20T09:48:00Z" },
    { id:12, order_number: "ORD-1239", customer_id: 6, table_id: 5,  waiter_id: 1, status: "completed", total_amount: 42.00, ordered_at: "2025-05-20T09:45:00Z" }
  ],

  // ===== ORDER ITEMS (With exact progress bars for Kitchen) =====
  order_items: [
    { id: 1,  order_id: 1,  menu_item_id: 1, quantity: 2, unit_price: 12.99, item_status: "ready",     preparation_progress: 100 },
    { id: 2,  order_id: 1,  menu_item_id: 6, quantity: 3, unit_price: 3.49,  item_status: "ready",     preparation_progress: 100 },
    { id: 3,  order_id: 2,  menu_item_id: 3, quantity: 3, unit_price: 11.99, item_status: "preparing", preparation_progress: 60  },
    { id: 4,  order_id: 2,  menu_item_id: 4, quantity: 2, unit_price: 11.49, item_status: "preparing", preparation_progress: 45  },
    { id: 5,  order_id: 3,  menu_item_id: 2, quantity: 2, unit_price: 10.99, item_status: "pending",   preparation_progress: 0   },
    { id: 6,  order_id: 4,  menu_item_id: 5, quantity: 2, unit_price: 13.49, item_status: "ready",     preparation_progress: 100 },
    { id: 7,  order_id: 4,  menu_item_id: 1, quantity: 3, unit_price: 12.99, item_status: "ready",     preparation_progress: 100 },
    { id: 8,  order_id: 5,  menu_item_id: 2, quantity: 2, unit_price: 10.99, item_status: "ready",     preparation_progress: 100 },
    { id: 9,  order_id: 6,  menu_item_id: 3, quantity: 2, unit_price: 11.99, item_status: "preparing", preparation_progress: 70  },
    { id:10,  order_id: 6,  menu_item_id: 4, quantity: 2, unit_price: 11.49, item_status: "preparing", preparation_progress: 80  },
    { id:11,  order_id: 7,  menu_item_id: 1, quantity: 2, unit_price: 12.99, item_status: "preparing", preparation_progress: 30  },
    { id:12,  order_id: 8,  menu_item_id: 3, quantity: 4, unit_price: 11.99, item_status: "preparing", preparation_progress: 70  },
    { id:13,  order_id: 9,  menu_item_id: 4, quantity: 2, unit_price: 11.49, item_status: "ready",     preparation_progress: 90  },
    { id:14,  order_id:10,  menu_item_id: 7, quantity: 3, unit_price: 5.99,  item_status: "ready",     preparation_progress: 100 }
  ],

  // ===== INVOICES (Cashier Dashboard) =====
  invoices: [
    { id: 1, order_id: 1, invoice_number: "BILL-152", total: 45.50, status: "paid",   payment_method: "Card" },
    { id: 2, order_id: 2, invoice_number: "BILL-151", total: 78.20, status: "paid",   payment_method: "Cash" },
    { id: 3, order_id: 3, invoice_number: "BILL-150", total: 32.00, status: "paid",   payment_method: "Mobile Banking" },
    { id: 4, order_id: 4, invoice_number: "BILL-149", total: 67.80, status: "paid",   payment_method: "Card" },
    { id: 5, order_id: 5, invoice_number: "BILL-148", total: 29.40, status: "pending",payment_method: "Cash" },
    { id: 6, order_id: 6, invoice_number: "BILL-154", total: 54.30, status: "pending",payment_method: "-" },
    { id: 7, order_id: 7, invoice_number: "BILL-153", total: 36.20, status: "pending",payment_method: "-" }
  ],

  // ===== CUSTOMER REQUESTS (Waiter Dashboard) =====
  customer_requests: [
    { id: 1, table_id: 7,  request_text: "Extra Napkins",  status: "new",         created_at: "2025-05-20T10:28:00Z" },
    { id: 2, table_id: 12, request_text: "More Water",     status: "new",         created_at: "2025-05-20T10:25:00Z" },
    { id: 3, table_id: 3,  request_text: "Check on Order", status: "in_progress", created_at: "2025-05-20T10:22:00Z" }
  ],

  // ===== INVENTORY (Low Stock Alerts) =====
  ingredients: [
    { id: 1, name: "Tomato",         unit: "kg", current_stock: 5.00, min_stock_level: 10.00, image_url: "🍅" },
    { id: 2, name: "Chicken Breast", unit: "kg", current_stock: 2.00, min_stock_level: 8.00,  image_url: "🍗" },
    { id: 3, name: "Cooking Oil",    unit: "L",  current_stock: 1.50, min_stock_level: 5.00,  image_url: "🛢️" },
    { id: 4, name: "Cheese",         unit: "kg", current_stock: 3.00, min_stock_level: 5.00,  image_url: "🧀" }
  ],

  // ===== NOTIFICATIONS (System Activity Feed) =====
  notifications: [
    { id: 1, title: "New user registered",   message: "Waiter - John Doe",            type: "user",    created_at: "2025-05-20T10:33:00Z" },
    { id: 2, title: "New order received",    message: "Order #ORD-1251",               type: "order",   created_at: "2025-05-20T10:30:00Z" },
    { id: 3, title: "Payment received",      message: "$78.20 from Order #1249",       type: "payment", created_at: "2025-05-20T10:25:00Z" },
    { id: 4, title: "Low stock alert",       message: "Tomato is running low",         type: "alert",   created_at: "2025-05-20T10:20:00Z" }
  ]
};