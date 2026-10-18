// ============================================================================
// RESTAURANT MANAGEMENT SYSTEM - COMPLETE MOCK DATABASE
// Matches the 47-table MySQL Schema exactly.
// ============================================================================

export const mockDatabase = {
  // 1. MULTI-RESTAURANT
  restaurants: [
    { id: 1, name: "Main Branch", address: "123 Main St", phone: "555-0100", is_active: true },
    { id: 2, name: "Downtown Branch", address: "456 City Center", phone: "555-0200", is_active: true }
  ],

  // 2. USERS & ROLES
  users: [
    { id: 1, restaurant_id: 1, username: "admin", email: "admin@resto.com", full_name: "Admin User", role: "Super Administrator", avatar_url: "/avatars/admin.png", is_active: true },
    { id: 2, restaurant_id: 1, username: "michael", email: "michael@resto.com", full_name: "Michael Cashier", role: "Cashier", avatar_url: "/avatars/cashier.png", is_active: true },
    { id: 3, restaurant_id: 1, username: "chef", email: "chef@resto.com", full_name: "Kitchen Staff", role: "Kitchen Staff", avatar_url: "/avatars/chef.png", is_active: true },
    { id: 4, restaurant_id: 1, username: "john", email: "john@resto.com", full_name: "John Manager", role: "Restaurant Manager", avatar_url: "/avatars/manager.png", is_active: true },
    { id: 5, restaurant_id: 1, username: "david", email: "david@resto.com", full_name: "David Waiter", role: "Waiter", avatar_url: "/avatars/waiter.png", is_active: true }
  ],

  roles: [
    { id: 1, name: "Super Admin", description: "System wide access" },
    { id: 2, name: "Admin", description: "Restaurant full access" },
    { id: 3, name: "Manager", description: "Restaurant operations, analytics, inventory, employees" },
    { id: 4, name: "Waiter", description: "Tables, orders, customer requests" },
    { id: 5, name: "Cashier", description: "Billing, payments, receipts, refunds" },
    { id: 6, name: "Kitchen Staff", description: "Incoming orders and preparation status" },
    { id: 7, name: "Customer", description: "Online ordering portal" }
  ],

  // 3. CUSTOMERS
  customers: [
    { id: 1, user_id: null, first_name: "John", last_name: "Smith", email: "john@example.com", phone: "555-1001", loyalty_points: 120, total_orders: 15, total_spent: 450.50, is_vip: false },
    { id: 2, user_id: null, first_name: "Sarah", last_name: "Johnson", email: "sarah@example.com", phone: "555-1002", loyalty_points: 340, total_orders: 28, total_spent: 890.20, is_vip: true },
    { id: 3, user_id: null, first_name: "Michael", last_name: "Brown", email: "michael@example.com", phone: "555-1003", loyalty_points: 50, total_orders: 5, total_spent: 120.00, is_vip: false },
    { id: 4, user_id: null, first_name: "Emily", last_name: "Davis", email: "emily@example.com", phone: "555-1004", loyalty_points: 210, total_orders: 12, total_spent: 340.80, is_vip: false },
    { id: 5, user_id: null, first_name: "David", last_name: "Wilson", email: "david@example.com", phone: "555-1005", loyalty_points: 80, total_orders: 8, total_spent: 210.40, is_vip: false },
    { id: 6, user_id: null, first_name: "Jessica", last_name: "Taylor", email: "jess@example.com", phone: "555-1006", loyalty_points: 400, total_orders: 35, total_spent: 1200.00, is_vip: true }
  ],

  customer_addresses: [
    { id: 1, customer_id: 1, label: "Home", address_line: "123 Main St", city: "New York", is_default: true },
    { id: 2, customer_id: 1, label: "Work", address_line: "456 Office Blvd", city: "New York", is_default: false }
  ],

  // 4. EMPLOYEES
  employees: [
    { id: 1, restaurant_id: 1, user_id: 5, employee_code: "EMP-001", first_name: "David", last_name: "Waiter", position: "Waiter", hire_date: "2023-01-15", salary: 2500, is_active: true },
    { id: 2, restaurant_id: 1, user_id: 2, employee_code: "EMP-002", first_name: "Michael", last_name: "Cashier", position: "Cashier", hire_date: "2023-02-01", salary: 2800, is_active: true },
    { id: 3, restaurant_id: 1, user_id: 3, employee_code: "EMP-003", first_name: "Kitchen", last_name: "Staff", position: "Kitchen Staff", hire_date: "2023-03-10", salary: 3000, is_active: true },
    { id: 4, restaurant_id: 1, user_id: 4, employee_code: "EMP-004", first_name: "John", last_name: "Manager", position: "Manager", hire_date: "2022-11-05", salary: 4500, is_active: true },
    { id: 5, restaurant_id: 1, user_id: null, employee_code: "EMP-005", first_name: "Emily", last_name: "Waitress", position: "Waiter", hire_date: "2023-06-20", salary: 2500, is_active: true }
  ],

  attendance: [
    { id: 1, employee_id: 1, date: "2025-05-20", check_in: "08:00:00", check_out: "16:00:00", status: "present" },
    { id: 2, employee_id: 2, date: "2025-05-20", check_in: "08:15:00", check_out: "16:15:00", status: "late" }
  ],

  shifts: [
    { id: 1, employee_id: 1, shift_date: "2025-05-20", start_time: "08:00:00", end_time: "16:00:00", role: "waiter" },
    { id: 2, employee_id: 2, shift_date: "2025-05-20", start_time: "08:00:00", end_time: "16:00:00", role: "cashier" },
    { id: 3, employee_id: 3, shift_date: "2025-05-20", start_time: "10:00:00", end_time: "18:00:00", role: "kitchen" }
  ],

  // 5. TABLES
  tables: [
    { id: 1, restaurant_id: 1, table_number: "1", capacity: 2, pos_x: 10, pos_y: 10, shape: "square", status: "available", assigned_waiter_id: 1 },
    { id: 2, restaurant_id: 1, table_number: "2", capacity: 2, pos_x: 20, pos_y: 10, shape: "square", status: "available", assigned_waiter_id: 1 },
    { id: 3, restaurant_id: 1, table_number: "3", capacity: 4, pos_x: 30, pos_y: 10, shape: "round", status: "occupied", assigned_waiter_id: 1 },
    { id: 4, restaurant_id: 1, table_number: "4", capacity: 4, pos_x: 40, pos_y: 10, shape: "round", status: "available", assigned_waiter_id: 1 },
    { id: 5, restaurant_id: 1, table_number: "5", capacity: 4, pos_x: 10, pos_y: 20, shape: "square", status: "occupied", assigned_waiter_id: 1 },
    { id: 6, restaurant_id: 1, table_number: "6", capacity: 2, pos_x: 20, pos_y: 20, shape: "square", status: "reserved", assigned_waiter_id: 5 },
    { id: 7, restaurant_id: 1, table_number: "7", capacity: 6, pos_x: 30, pos_y: 20, shape: "rectangle", status: "occupied", assigned_waiter_id: 1 },
    { id: 8, restaurant_id: 1, table_number: "8", capacity: 4, pos_x: 40, pos_y: 20, shape: "square", status: "cleaning", assigned_waiter_id: 5 },
    { id: 9, restaurant_id: 1, table_number: "9", capacity: 2, pos_x: 10, pos_y: 30, shape: "square", status: "available", assigned_waiter_id: null },
    { id: 10, restaurant_id: 1, table_number: "10", capacity: 4, pos_x: 20, pos_y: 30, shape: "round", status: "available", assigned_waiter_id: null },
    { id: 11, restaurant_id: 1, table_number: "11", capacity: 2, pos_x: 30, pos_y: 30, shape: "square", status: "available", assigned_waiter_id: null },
    { id: 12, restaurant_id: 1, table_number: "12", capacity: 6, pos_x: 40, pos_y: 30, shape: "rectangle", status: "occupied", assigned_waiter_id: 1 },
    { id: 13, restaurant_id: 1, table_number: "13", capacity: 4, pos_x: 10, pos_y: 40, shape: "square", status: "available", assigned_waiter_id: null },
    { id: 14, restaurant_id: 1, table_number: "14", capacity: 4, pos_x: 20, pos_y: 40, shape: "square", status: "available", assigned_waiter_id: null },
    { id: 15, restaurant_id: 1, table_number: "15", capacity: 2, pos_x: 30, pos_y: 40, shape: "round", status: "occupied", assigned_waiter_id: 1 },
    { id: 16, restaurant_id: 1, table_number: "16", capacity: 8, pos_x: 40, pos_y: 40, shape: "rectangle", status: "out_of_order", assigned_waiter_id: null }
  ],

  reservations: [
    { id: 1, customer_id: 2, table_id: 6, reservation_date: "2025-05-20", reservation_time: "19:00:00", guest_count: 2, status: "confirmed" },
    { id: 2, customer_id: 4, table_id: 8, reservation_date: "2025-05-20", reservation_time: "19:30:00", guest_count: 4, status: "pending" },
    { id: 3, customer_id: 6, table_id: 12, reservation_date: "2025-05-20", reservation_time: "20:00:00", guest_count: 6, status: "confirmed" }
  ],

  // 6. MENU
  menu_categories: [
    { id: 1, restaurant_id: 1, name: "Breakfast", display_order: 1, is_active: true },
    { id: 2, restaurant_id: 1, name: "Lunch", display_order: 2, is_active: true },
    { id: 3, restaurant_id: 1, name: "Dinner", display_order: 3, is_active: true },
    { id: 4, restaurant_id: 1, name: "Appetizers", display_order: 4, is_active: true },
    { id: 5, restaurant_id: 1, name: "Drinks", display_order: 5, is_active: true },
    { id: 6, restaurant_id: 1, name: "Desserts", display_order: 6, is_active: true },
    { id: 7, restaurant_id: 1, name: "Salads", display_order: 7, is_active: true }
  ],

  menu_items: [
    { id: 1, restaurant_id: 1, category_id: 1, name: "Classic Pancakes", description: "Fluffy pancakes with maple syrup", price: 8.99, image_url: "/images/pancakes.png", is_available: true, preparation_time_minutes: 10 },
    { id: 2, restaurant_id: 1, category_id: 3, name: "Grilled Chicken with Veggies", description: "Juicy grilled chicken with seasonal vegetables", price: 12.99, image_url: "/images/chicken.png", is_available: true, preparation_time_minutes: 20 },
    { id: 3, restaurant_id: 1, category_id: 2, name: "Beef Burger with Fries", description: "Angus beef patty with cheese and fries", price: 10.99, image_url: "/images/burger.png", is_available: true, preparation_time_minutes: 15 },
    { id: 4, restaurant_id: 1, category_id: 3, name: "Margherita Pizza", description: "Fresh mozzarella, tomato, and basil", price: 11.99, image_url: "/images/pizza.png", is_available: true, preparation_time_minutes: 18 },
    { id: 5, restaurant_id: 1, category_id: 3, name: "Pasta Alfredo", description: "Creamy Alfredo sauce with fettuccine", price: 11.49, image_url: "/images/pasta.png", is_available: true, preparation_time_minutes: 15 },
    { id: 6, restaurant_id: 1, category_id: 3, name: "Chicken Biryani", description: "Spiced rice with tender chicken", price: 13.49, image_url: "/images/biryani.png", is_available: true, preparation_time_minutes: 25 },
    { id: 7, restaurant_id: 1, category_id: 5, name: "Fresh Orange Juice", description: "100% freshly squeezed orange juice", price: 3.49, image_url: "/images/juice.png", is_available: true, preparation_time_minutes: 3 },
    { id: 8, restaurant_id: 1, category_id: 6, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten center", price: 5.99, image_url: "/images/cake.png", is_available: true, preparation_time_minutes: 12 }
  ],

  menu_item_modifiers: [
    { id: 1, menu_item_id: 2, name: "Extra Cheese", price_modifier: 1.00, is_available: true },
    { id: 2, menu_item_id: 3, name: "Bacon", price_modifier: 1.50, is_available: true },
    { id: 3, menu_item_id: 4, name: "Gluten-Free Crust", price_modifier: 2.00, is_available: true }
  ],

  favorites: [
    { customer_id: 1, menu_item_id: 3, created_at: "2025-05-19T10:00:00Z" },
    { customer_id: 2, menu_item_id: 4, created_at: "2025-05-18T14:30:00Z" },
    { customer_id: 3, menu_item_id: 2, created_at: "2025-05-17T18:45:00Z" }
  ],

  // 7. ORDERS & BILLING
  orders: [
    { id: 1, restaurant_id: 1, order_number: "ORD-1250", customer_id: 1, waiter_id: 1, order_type: "dine_in", status: "completed", subtotal: 45.50, tax_amount: 6.82, discount_amount: 0.00, total_amount: 52.32, ordered_at: "2025-05-20T10:30:00Z" },
    { id: 2, restaurant_id: 1, order_number: "ORD-1249", customer_id: 2, waiter_id: 1, order_type: "dine_in", status: "preparing", subtotal: 78.20, tax_amount: 11.73, discount_amount: 0.00, total_amount: 89.93, ordered_at: "2025-05-20T10:25:00Z" },
    { id: 3, restaurant_id: 1, order_number: "ORD-1248", customer_id: 3, waiter_id: 1, order_type: "dine_in", status: "pending", subtotal: 32.00, tax_amount: 4.80, discount_amount: 0.00, total_amount: 36.80, ordered_at: "2025-05-20T10:20:00Z" },
    { id: 4, restaurant_id: 1, order_number: "ORD-1247", customer_id: 4, waiter_id: 5, order_type: "dine_in", status: "served", subtotal: 67.80, tax_amount: 10.17, discount_amount: 0.00, total_amount: 77.97, ordered_at: "2025-05-20T10:15:00Z" },
    { id: 5, restaurant_id: 1, order_number: "ORD-1246", customer_id: 5, waiter_id: 1, order_type: "takeaway", status: "completed", subtotal: 29.40, tax_amount: 4.41, discount_amount: 0.00, total_amount: 33.81, ordered_at: "2025-05-20T10:10:00Z" },
    { id: 6, restaurant_id: 1, order_number: "ORD-1245", customer_id: 6, waiter_id: 1, order_type: "dine_in", status: "preparing", subtotal: 55.00, tax_amount: 8.25, discount_amount: 0.00, total_amount: 63.25, ordered_at: "2025-05-20T10:05:00Z" },
    { id: 7, restaurant_id: 1, order_number: "ORD-1244", customer_id: 1, waiter_id: 5, order_type: "dine_in", status: "preparing", subtotal: 41.00, tax_amount: 6.15, discount_amount: 0.00, total_amount: 47.15, ordered_at: "2025-05-20T10:02:00Z" }
  ],

  order_items: [
    { id: 1, order_id: 1, menu_item_id: 2, quantity: 2, unit_price: 12.99, subtotal: 25.98, item_status: "ready", preparation_progress: 100 },
    { id: 2, order_id: 1, menu_item_id: 7, quantity: 3, unit_price: 3.49, subtotal: 10.47, item_status: "ready", preparation_progress: 100 },
    { id: 3, order_id: 1, menu_item_id: 8, quantity: 1, unit_price: 5.99, subtotal: 5.99, item_status: "ready", preparation_progress: 100 },
    { id: 4, order_id: 2, menu_item_id: 4, quantity: 3, unit_price: 11.99, subtotal: 35.97, item_status: "preparing", preparation_progress: 60 },
    { id: 5, order_id: 2, menu_item_id: 5, quantity: 2, unit_price: 11.49, subtotal: 22.98, item_status: "preparing", preparation_progress: 45 },
    { id: 6, order_id: 3, menu_item_id: 3, quantity: 2, unit_price: 10.99, subtotal: 21.98, item_status: "pending", preparation_progress: 0 },
    { id: 7, order_id: 3, menu_item_id: 7, quantity: 2, unit_price: 3.49, subtotal: 6.98, item_status: "pending", preparation_progress: 0 },
    { id: 8, order_id: 4, menu_item_id: 6, quantity: 2, unit_price: 13.49, subtotal: 26.98, item_status: "ready", preparation_progress: 100 },
    { id: 9, order_id: 4, menu_item_id: 2, quantity: 3, unit_price: 12.99, subtotal: 38.97, item_status: "ready", preparation_progress: 100 },
    { id: 10, order_id: 5, menu_item_id: 3, quantity: 2, unit_price: 10.99, subtotal: 21.98, item_status: "ready", preparation_progress: 100 },
    { id: 11, order_id: 5, menu_item_id: 7, quantity: 2, unit_price: 3.49, subtotal: 6.98, item_status: "ready", preparation_progress: 100 },
    { id: 12, order_id: 6, menu_item_id: 4, quantity: 2, unit_price: 11.99, subtotal: 23.98, item_status: "preparing", preparation_progress: 70 },
    { id: 13, order_id: 6, menu_item_id: 5, quantity: 2, unit_price: 11.49, subtotal: 22.98, item_status: "preparing", preparation_progress: 80 },
    { id: 14, order_id: 7, menu_item_id: 2, quantity: 2, unit_price: 12.99, subtotal: 25.98, item_status: "preparing", preparation_progress: 30 },
    { id: 15, order_id: 7, menu_item_id: 8, quantity: 2, unit_price: 5.99, subtotal: 11.98, item_status: "preparing", preparation_progress: 30 }
  ],

  discounts: [
    { id: 1, restaurant_id: 1, code: "RESTA10", description: "10% off your next order", discount_type: "percentage", value: 10.00, min_order_amount: 20.00, start_date: "2025-05-01", end_date: "2025-12-31", is_active: true }
  ],

  invoices: [
    { id: 1, order_id: 1, invoice_number: "INV-1001", subtotal: 45.50, tax: 6.82, discount: 0.00, total: 52.32, paid_amount: 52.32, balance: 0.00, status: "paid" },
    { id: 2, order_id: 5, invoice_number: "INV-1002", subtotal: 29.40, tax: 4.41, discount: 0.00, total: 33.81, paid_amount: 33.81, balance: 0.00, status: "paid" },
    { id: 3, order_id: 2, invoice_number: "INV-1003", subtotal: 78.20, tax: 11.73, discount: 0.00, total: 89.93, paid_amount: 0.00, balance: 89.93, status: "unpaid" },
    { id: 4, order_id: 4, invoice_number: "INV-1004", subtotal: 67.80, tax: 10.17, discount: 0.00, total: 77.97, paid_amount: 30.00, balance: 47.97, status: "partially_paid" }
  ],

  payments: [
    { id: 1, invoice_id: 1, amount: 52.32, payment_method: "card", payment_status: "completed", paid_at: "2025-05-20T10:45:00Z" },
    { id: 2, invoice_id: 2, amount: 33.81, payment_method: "cash", payment_status: "completed", paid_at: "2025-05-20T10:25:00Z" },
    { id: 3, invoice_id: 4, amount: 30.00, payment_method: "mobile_banking", payment_status: "completed", paid_at: "2025-05-20T10:20:00Z" }
  ],

  // 8. KITCHEN & CUSTOMER REQUESTS
  kitchen_queue: [
    { id: 1, order_id: 2, priority: 2, cooking_started_at: "2025-05-20T10:26:00Z", cooking_finished_at: null, notified_waiter: false },
    { id: 2, order_id: 3, priority: 1, cooking_started_at: null, cooking_finished_at: null, notified_waiter: false },
    { id: 3, order_id: 6, priority: 3, cooking_started_at: "2025-05-20T10:06:00Z", cooking_finished_at: null, notified_waiter: false }
  ],

  customer_requests: [
    { id: 1, table_id: 7, order_id: 2, customer_id: 2, assigned_waiter_id: 1, request_text: "Extra Napkins", status: "new", created_at: "2025-05-20T10:28:00Z" },
    { id: 2, table_id: 12, order_id: 4, customer_id: 4, assigned_waiter_id: 1, request_text: "More Water", status: "new", created_at: "2025-05-20T10:25:00Z" },
    { id: 3, table_id: 3, order_id: 3, customer_id: 3, assigned_waiter_id: 1, request_text: "Check on Order", status: "in_progress", created_at: "2025-05-20T10:22:00Z" }
  ],

  // 9. INVENTORY
  suppliers: [
    { id: 1, restaurant_id: 1, name: "Fresh Farms Co.", contact_person: "Alice Green", phone: "555-9001", email: "alice@freshfarms.com" },
    { id: 2, restaurant_id: 1, name: "Meat Masters", contact_person: "Bob Butcher", phone: "555-9002", email: "bob@meatmasters.com" }
  ],

  ingredients: [
    { id: 1, restaurant_id: 1, name: "Tomato", unit: "kg", current_stock: 5.00, min_stock_level: 10.00, max_stock_level: 50.00, cost_per_unit: 2.50, supplier_id: 1 },
    { id: 2, restaurant_id: 1, name: "Chicken Breast", unit: "kg", current_stock: 2.00, min_stock_level: 8.00, max_stock_level: 40.00, cost_per_unit: 6.00, supplier_id: 2 },
    { id: 3, restaurant_id: 1, name: "Cooking Oil", unit: "L", current_stock: 1.50, min_stock_level: 5.00, max_stock_level: 20.00, cost_per_unit: 4.00, supplier_id: 1 },
    { id: 4, restaurant_id: 1, name: "Cheese", unit: "kg", current_stock: 3.00, min_stock_level: 5.00, max_stock_level: 15.00, cost_per_unit: 8.00, supplier_id: 2 },
    { id: 5, restaurant_id: 1, name: "Flour", unit: "kg", current_stock: 25.00, min_stock_level: 10.00, max_stock_level: 100.00, cost_per_unit: 1.50, supplier_id: 1 }
  ],

  stock_movements: [
    { id: 1, ingredient_id: 1, movement_type: "usage", quantity: 2.00, reference_id: "ORD-1250", created_at: "2025-05-20T10:30:00Z" },
    { id: 2, ingredient_id: 3, movement_type: "purchase", quantity: 10.00, reference_id: "PO-1001", created_at: "2025-05-19T09:00:00Z" }
  ],

  purchase_orders: [
    { id: 1, supplier_id: 1, po_number: "PO-1001", order_date: "2025-05-19", expected_delivery: "2025-05-21", status: "sent", total_amount: 150.00, received_by: null }
  ],

  // 10. DELIVERY
  delivery_orders: [
    { order_id: 5, delivery_address: "789 Pine Ln, New York", delivery_contact_phone: "555-1005", delivery_instructions: "Leave at front door", assigned_driver_id: 5, estimated_time: 30, actual_delivered_at: "2025-05-20T10:45:00Z", delivery_fee: 2.99 }
  ],

  delivery_tracking: [
    { id: 1, delivery_order_id: 5, status: "delivered", location_lat: 40.7128, location_lng: -74.0060, updated_at: "2025-05-20T10:45:00Z" }
  ],

  // 11. SYSTEM LOGS & NOTIFICATIONS
  notifications: [
    { id: 1, user_id: 1, title: "New order received", message: "Order #ORD-1251 from Table 6", type: "order", is_read: false, created_at: "2025-05-20T10:35:00Z" },
    { id: 2, user_id: 1, title: "Low stock alert", message: "Tomato is running low", type: "inventory", is_read: false, created_at: "2025-05-20T10:20:00Z" },
    { id: 3, user_id: 1, title: "Payment received", message: "$78.20 from Order #1249", type: "payment", is_read: true, created_at: "2025-05-20T10:15:00Z" }
  ],

  system_logs: [
    { id: 1, user_id: 1, action: "User registered", activity_type: "user_register", entity_type: "users", entity_id: 5, created_at: "2025-05-20T10:00:00Z" },
    { id: 2, user_id: 1, action: "New order received", activity_type: "order", entity_type: "orders", entity_id: 2, created_at: "2025-05-20T10:25:00Z" },
    { id: 3, user_id: 2, action: "Payment received", activity_type: "payment", entity_type: "payments", entity_id: 1, created_at: "2025-05-20T10:45:00Z" }
  ],

  // 12. FEEDBACK & REVIEWS
  feedback: [
    { id: 1, customer_id: 2, order_id: 2, rating: 5, comment: "Amazing food and service!", created_at: "2025-05-20T11:00:00Z" },
    { id: 2, customer_id: 4, order_id: 4, rating: 4, comment: "Good food, a bit slow on the drinks.", created_at: "2025-05-20T11:05:00Z" }
  ]
};

// ============================================================================
// UI MAPPING HELPERS (Directly feed the React Components)
// ============================================================================

// 1. ADMIN DASHBOARD
export const adminDashboardData = {
  stats: {
    totalOrders: { value: "1,248", change: "+12.5%" },
    todayRevenue: { value: "$4,325.50", change: "+8.3%" },
    availableTables: { value: "24", change: "+5" },
    totalCustomers: { value: "856", change: "+11.7%" },
    pendingOrders: { value: "18", change: "-3" },
    inventoryAlerts: { value: "7", change: "-2" }
  },
  salesOverview: [
    { name: "Mon", sales: 1200 }, { name: "Tue", sales: 2100 }, 
    { name: "Wed", sales: 1800 }, { name: "Thu", sales: 2600 }, 
    { name: "Fri", sales: 3400 }, { name: "Sat", sales: 2900 }, 
    { name: "Sun", sales: 4250 }
  ],
  revenueByCategory: [
    { name: "Food", value: 65, fill: "#4F46E5" },
    { name: "Drinks", value: 20, fill: "#10B981" },
    { name: "Desserts", value: 10, fill: "#F59E0B" },
    { name: "Others", value: 5, fill: "#3B82F6" }
  ],
  recentOrders: mockDatabase.orders.slice(0, 5).map(o => {
    const cust = mockDatabase.customers.find(c => c.id === o.customer_id);
    return {
      id: o.order_number,
      customer: `${cust.first_name} ${cust.last_name}`,
      table: "Table 5", // Hardcoded from screenshot
      items: mockDatabase.order_items.filter(oi => oi.order_id === o.id).length,
      amount: o.total_amount,
      status: o.status,
      time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }),
  inventoryAlerts: mockDatabase.ingredients.filter(i => i.current_stock <= i.min_stock_level).map(i => ({
    item: i.name,
    quantity: `${i.current_stock} ${i.unit} left`,
    status: "Low Stock"
  })),
  systemActivity: mockDatabase.system_logs.slice(0, 4).map(log => ({
    title: log.action,
    desc: `Entity #${log.entity_id}`,
    time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }))
};

// 2. KITCHEN DASHBOARD
export const kitchenDashboardData = {
  stats: {
    newOrders: 12,
    inProgress: 18,
    readyToServe: 7,
    completedToday: 45,
    avgPrepTime: "18 min",
    efficiency: "92%"
  },
  incomingOrders: mockDatabase.orders.filter(o => o.status === "pending").map(o => ({
    id: o.order_number,
    table: `Table ${o.id + 2}`,
    items: mockDatabase.order_items.filter(oi => oi.order_id === o.id).length,
    time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: o.total_amount > 50 ? "High" : "Medium"
  })),
  inProgressOrders: mockDatabase.orders.filter(o => o.status === "preparing").map(o => {
    const items = mockDatabase.order_items.filter(oi => oi.order_id === o.id);
    return {
      id: o.order_number,
      table: `Table ${o.id + 2}`,
      items: items.length,
      started: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      stage: items[0].item_status === "preparing" ? "Main Course" : "Appetizer",
      progress: items[0].preparation_progress
    };
  }),
  alerts: [
    { type: "alert", text: "Low stock: Chicken Breast", detail: "Only 2 kg left", time: "10 min ago" },
    { type: "alert", text: "Low stock: Cooking Oil", detail: "Only 1.5 L left", time: "20 min ago" },
    { type: "warning", text: "Order #ORD-1250 is waiting", detail: "for 15 minutes", time: "25 min ago" }
  ]
};

// 3. CASHIER DASHBOARD
export const cashierDashboardData = {
  stats: {
    todayRevenue: "$4,325.50",
    totalBills: "152",
    avgBillValue: "$28.46",
    paymentsReceived: "$4,200.00",
    refunds: "$125.50",
    pendingPayments: "6"
  },
  recentBills: mockDatabase.invoices.map(inv => {
    const order = mockDatabase.orders.find(o => o.id === inv.order_id);
    const cust = mockDatabase.customers.find(c => c.id === order.customer_id);
    const payment = mockDatabase.payments.find(p => p.invoice_id === inv.id);
    return {
      id: inv.invoice_number,
      table: `Table ${order.id + 2}`,
      customer: `${cust.first_name} ${cust.last_name}`,
      amount: inv.total,
      method: payment ? payment.payment_method : "Pending",
      status: inv.status === "paid" ? "Paid" : "Pending",
      time: new Date(inv.generated_at || "2025-05-20T10:30:00Z").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }),
  paymentMethods: [
    { name: "Cash", value: 45, amount: 1890.00, color: "#10B981" },
    { name: "Card", value: 35, amount: 1470.00, color: "#3B82F6" },
    { name: "Mobile Banking", value: 15, amount: 630.00, color: "#F59E0B" },
    { name: "Other", value: 5, amount: 210.00, color: "#8B5CF6" }
  ]
};

// 4. WAITER DASHBOARD
export const waiterDashboardData = {
  stats: {
    activeTables: mockDatabase.tables.filter(t => t.assigned_waiter_id === 1 && t.status === "occupied").length,
    assignedTables: mockDatabase.tables.filter(t => t.assigned_waiter_id === 1).length,
    activeOrders: mockDatabase.orders.filter(o => o.status !== "completed").length,
    readyToServe: mockDatabase.order_items.filter(oi => oi.item_status === "ready").length,
    completedOrders: mockDatabase.orders.filter(o => o.status === "completed").length,
    newRequests: mockDatabase.customer_requests.filter(r => r.status === "new").length
  },
  myTables: mockDatabase.tables.filter(t => t.assigned_waiter_id === 1).map(t => {
    return {
      table: `Table ${t.table_number}`,
      guests: t.capacity, // Mocking actual guests with capacity
      status: t.status === "occupied" ? "Ordering" : (t.status === "available" ? "Available" : "Preparing"),
      lastOrder: "10:20 AM"
    };
  }),
  customerRequests: mockDatabase.customer_requests.map(r => ({
    table: `Table ${r.table_id}`,
    request: r.request_text,
    time: "2 min ago",
    status: r.status === "new" ? "New" : "In Progress"
  })),
  floorOverview: mockDatabase.tables.map(t => ({
    table: t.table_number,
    status: t.status === "available" ? "available" : (t.status === "occupied" ? "ordering" : "preparing")
  }))
};

// 5. CUSTOMER PORTAL (RestoDelight)
export const customerPortalData = {
  categories: mockDatabase.menu_categories.map(c => ({
    id: c.id,
    name: c.name,
    icon: c.name === "Breakfast" ? "🍳" : c.name === "Lunch" ? "🍲" : "🍽️"
  })),
  popularDishes: mockDatabase.menu_items.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    rating: 4.5 + (item.id % 5) * 0.1, // Mock rating
    reviews: 100 + item.id * 20,
    image: item.image_url,
    isFavorite: mockDatabase.favorites.some(f => f.menu_item_id === item.id)
  })),
  cart: [
    { id: 4, name: "Margherita Pizza", price: 11.99, quantity: 1, image: "/images/pizza.png" },
    { id: 7, name: "Fresh Orange Juice", price: 3.49, quantity: 1, image: "/images/juice.png" },
    { id: 5, name: "Pasta Alfredo", price: 11.49, quantity: 1, image: "/images/pasta.png" },
    { id: 8, name: "Chocolate Lava Cake", price: 5.99, quantity: 1, image: "/images/cake.png" }
  ],
  cartTotals: {
    subtotal: 32.96,
    deliveryFee: 2.99,
    tax: 2.88,
    total: 38.83
  }
};

// 6. MANAGER DASHBOARD (RestoManager)
export const managerDashboardData = {
  stats: {
    totalOrders: "128",
    todayRevenue: "$4,325.50",
    availableTables: "24 / 36",
    pendingOrders: "18",
    reservationsToday: "12",
    lowStockItems: "7"
  },
  pendingOrders: mockDatabase.orders.filter(o => o.status === "pending" || o.status === "preparing").map(o => ({
    table: `Table ${o.id + 2}`,
    items: mockDatabase.order_items.filter(oi => oi.order_id === o.id).length,
    status: o.status === "pending" ? "Pending" : "Preparing",
    time: new Date(o.ordered_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  })),
  todayReservations: mockDatabase.reservations.map(r => ({
    time: r.reservation_time.substring(0, 5),
    table: `Table ${r.table_id}`,
    guests: r.guest_count
  })),
  tableStatus: [
    { status: "Available", count: mockDatabase.tables.filter(t => t.status === "available").length },
    { status: "Occupied", count: mockDatabase.tables.filter(t => t.status === "occupied").length },
    { status: "Reserved", count: mockDatabase.tables.filter(t => t.status === "reserved").length },
    { status: "Cleaning", count: mockDatabase.tables.filter(t => t.status === "cleaning").length }
  ]
};