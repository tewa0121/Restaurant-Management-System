const mysql = require("mysql2");
require("dotenv").config();

// ==============================
// DATABASE CONNECTION POOL
// ==============================
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  port: process.env.DB_PORT || 3306,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'restaurant_db',
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// ==============================
// VERIFY & ESTABLISH CONNECTION
// ==============================
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to MySQL database successfully.");
    initializeDatabase();
    connection.release();
  }
});

// ==============================
// INITIALIZE DATABASE SCHEMA
// ==============================
async function initializeDatabase() {
  try {
    // ---- 1. RESTAURANTS ----
    const restaurantsTable = `
      CREATE TABLE IF NOT EXISTS restaurants (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL,
        address TEXT,
        phone VARCHAR(20),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB;
    `;

    const restaurantSettingsTable = `
      CREATE TABLE IF NOT EXISTS restaurant_settings (
        restaurant_id BIGINT NOT NULL,
        setting_key VARCHAR(100) NOT NULL,
        setting_value TEXT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (restaurant_id, setting_key),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 2. USERS & ROLES ----
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NULL,
        full_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        avatar_url VARCHAR(255) NULL,
        language CHAR(2) NOT NULL DEFAULT 'en',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const rolesTable = `
      CREATE TABLE IF NOT EXISTS roles (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(50) UNIQUE NOT NULL,
        description TEXT
      ) ENGINE=InnoDB;
    `;

    const userRolesTable = `
      CREATE TABLE IF NOT EXISTS user_roles (
        user_id BIGINT NOT NULL,
        role_id INT NOT NULL,
        assigned_by BIGINT,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, role_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const employeesTable = `
      CREATE TABLE IF NOT EXISTS employees (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        user_id BIGINT NULL,
        employee_code VARCHAR(20) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        position VARCHAR(50) NOT NULL,
        department VARCHAR(50),
        hire_date DATE NOT NULL,
        salary DECIMAL(10,2),
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        emergency_contact VARCHAR(100),
        photo_url VARCHAR(255) NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    // ---- 3. CUSTOMERS ----
    const customersTable = `
      CREATE TABLE IF NOT EXISTS customers (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100),
        phone VARCHAR(20) NOT NULL,
        loyalty_points INT DEFAULT 0,
        total_orders INT DEFAULT 0,
        total_spent DECIMAL(10,2) DEFAULT 0.00,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_vip BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const customerAddressesTable = `
      CREATE TABLE IF NOT EXISTS customer_addresses (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_id BIGINT NOT NULL,
        label VARCHAR(50) NOT NULL,
        address_line TEXT NOT NULL,
        city VARCHAR(100) NULL,
        phone VARCHAR(20) NULL,
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 4. TABLES & RESERVATIONS ----
    const tablesTable = `
      CREATE TABLE IF NOT EXISTS tables (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        table_number VARCHAR(10) NOT NULL,
        capacity INT NOT NULL,
        pos_x INT NOT NULL DEFAULT 0,
        pos_y INT NOT NULL DEFAULT 0,
        shape ENUM('square','round','rectangle') DEFAULT 'square',
        section VARCHAR(50) NULL,
        assigned_waiter_id BIGINT NULL,
        status ENUM('available','reserved','occupied','cleaning','out_of_order') DEFAULT 'available',
        qr_code_url VARCHAR(255) NULL,
        parent_table_id BIGINT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_table_restaurant (restaurant_id, table_number),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (parent_table_id) REFERENCES tables(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_waiter_id) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const reservationsTable = `
      CREATE TABLE IF NOT EXISTS reservations (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_id BIGINT NOT NULL,
        table_id BIGINT NOT NULL,
        reservation_date DATE NOT NULL,
        reservation_time TIME NOT NULL,
        guest_count INT NOT NULL,
        special_request TEXT,
        status ENUM('pending','confirmed','seated','cancelled','no_show') DEFAULT 'pending',
        created_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const tableAssignmentsTable = `
      CREATE TABLE IF NOT EXISTS table_assignments (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        table_id BIGINT NOT NULL,
        waiter_id BIGINT NOT NULL,
        customer_id BIGINT NULL,
        guest_count INT NOT NULL DEFAULT 1,
        seated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        released_at TIMESTAMP NULL,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
        FOREIGN KEY (waiter_id) REFERENCES employees(id),
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    // ---- 5. MENU ----
    const menuCategoriesTable = `
      CREATE TABLE IF NOT EXISTS menu_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        name VARCHAR(50) NOT NULL,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const menuItemsTable = `
      CREATE TABLE IF NOT EXISTS menu_items (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        category_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(255),
        is_available BOOLEAN DEFAULT TRUE,
        preparation_time_minutes INT DEFAULT 15,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES menu_categories(id)
      ) ENGINE=InnoDB;
    `;

    const menuItemModifiersTable = `
      CREATE TABLE IF NOT EXISTS menu_item_modifiers (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        menu_item_id BIGINT NOT NULL,
        name VARCHAR(100) NOT NULL,
        price_modifier DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        is_available BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const favoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
        customer_id BIGINT NOT NULL,
        menu_item_id BIGINT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (customer_id, menu_item_id),
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 6. ORDERS & BILLING ----
    const discountsTable = `
      CREATE TABLE IF NOT EXISTS discounts (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        code VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        discount_type ENUM('percentage','fixed_amount') NOT NULL,
        value DECIMAL(10,2) NOT NULL,
        min_order_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        first_order_only BOOLEAN DEFAULT FALSE,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        usage_limit INT DEFAULT 1,
        used_count INT DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const ordersTable = `
      CREATE TABLE IF NOT EXISTS orders (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        order_number VARCHAR(20) UNIQUE NOT NULL,
        customer_id BIGINT NULL,
        waiter_id BIGINT NULL,
        discount_id BIGINT NULL,
        order_type ENUM('dine_in','takeaway','delivery','online') NOT NULL,
        status ENUM('pending','preparing','ready','served','completed','cancelled') DEFAULT 'pending',
        subtotal DECIMAL(10,2) NOT NULL,
        tax_amount DECIMAL(10,2) DEFAULT 0.00,
        discount_amount DECIMAL(10,2) DEFAULT 0.00,
        total_amount DECIMAL(10,2) NOT NULL,
        notes TEXT,
        ordered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (waiter_id) REFERENCES employees(id) ON DELETE SET NULL,
        FOREIGN KEY (discount_id) REFERENCES discounts(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const orderTablesTable = `
      CREATE TABLE IF NOT EXISTS order_tables (
        order_id BIGINT NOT NULL,
        table_id BIGINT NOT NULL,
        PRIMARY KEY (order_id, table_id),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const orderItemsTable = `
      CREATE TABLE IF NOT EXISTS order_items (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        order_id BIGINT NOT NULL,
        menu_item_id BIGINT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
        special_instructions TEXT,
        item_status ENUM('pending','preparing','ready') DEFAULT 'pending',
        preparation_progress INT DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
      ) ENGINE=InnoDB;
    `;

    const orderItemModifiersTable = `
      CREATE TABLE IF NOT EXISTS order_item_modifiers (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        order_item_id BIGINT NOT NULL,
        modifier_id BIGINT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        unit_price DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
        FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE,
        FOREIGN KEY (modifier_id) REFERENCES menu_item_modifiers(id)
      ) ENGINE=InnoDB;
    `;

    // ---- 7. KITCHEN & REQUESTS ----
    const kitchenQueueTable = `
      CREATE TABLE IF NOT EXISTS kitchen_queue (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        order_id BIGINT NOT NULL UNIQUE,
        priority INT DEFAULT 0,
        cooking_started_at TIMESTAMP NULL,
        cooking_finished_at TIMESTAMP NULL,
        notified_waiter BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const customerRequestsTable = `
      CREATE TABLE IF NOT EXISTS customer_requests (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        table_id BIGINT NOT NULL,
        order_id BIGINT NULL,
        customer_id BIGINT NULL,
        assigned_waiter_id BIGINT NULL,
        request_text VARCHAR(255) NOT NULL,
        status ENUM('new','in_progress','done') DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL,
        FOREIGN KEY (table_id) REFERENCES tables(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL,
        FOREIGN KEY (assigned_waiter_id) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    // ---- 8. INVOICES & PAYMENTS ----
    const invoicesTable = `
      CREATE TABLE IF NOT EXISTS invoices (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        order_id BIGINT NOT NULL,
        invoice_number VARCHAR(20) UNIQUE NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        tax DECIMAL(10,2) NOT NULL,
        discount DECIMAL(10,2) DEFAULT 0.00,
        total DECIMAL(10,2) NOT NULL,
        paid_amount DECIMAL(10,2) DEFAULT 0.00,
        balance DECIMAL(10,2) GENERATED ALWAYS AS (total - paid_amount) STORED,
        status ENUM('unpaid','held','partially_paid','paid','refunded') DEFAULT 'unpaid',
        generated_by BIGINT,
        generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (generated_by) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const paymentsTable = `
      CREATE TABLE IF NOT EXISTS payments (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        invoice_id BIGINT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        payment_method ENUM('cash','card','mobile_banking','telebirr','cbe_birr','paypal','apple_pay','other') NOT NULL,
        transaction_id VARCHAR(100),
        payment_status ENUM('pending','completed','failed','refunded') DEFAULT 'pending',
        received_by BIGINT,
        paid_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
        FOREIGN KEY (received_by) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const refundsTable = `
      CREATE TABLE IF NOT EXISTS refunds (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        payment_id BIGINT NOT NULL,
        invoice_id BIGINT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        reason VARCHAR(255) NOT NULL,
        status ENUM('pending','approved','rejected') DEFAULT 'pending',
        requested_by BIGINT NOT NULL,
        approved_by BIGINT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        processed_at TIMESTAMP NULL,
        FOREIGN KEY (payment_id) REFERENCES payments(id),
        FOREIGN KEY (invoice_id) REFERENCES invoices(id),
        FOREIGN KEY (requested_by) REFERENCES users(id),
        FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const cashSessionsTable = `
      CREATE TABLE IF NOT EXISTS cash_sessions (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        cashier_id BIGINT NOT NULL,
        opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        opening_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        closed_at TIMESTAMP NULL,
        counted_amount DECIMAL(10,2) NULL,
        expected_amount DECIMAL(10,2) NULL,
        notes TEXT NULL,
        FOREIGN KEY (cashier_id) REFERENCES employees(id)
      ) ENGINE=InnoDB;
    `;

    // ---- 9. INVENTORY ----
    const suppliersTable = `
      CREATE TABLE IF NOT EXISTS suppliers (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(100),
        phone VARCHAR(20),
        email VARCHAR(100),
        address TEXT,
        payment_terms VARCHAR(100),
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const ingredientsTable = `
      CREATE TABLE IF NOT EXISTS ingredients (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        restaurant_id BIGINT NOT NULL,
        name VARCHAR(100) NOT NULL,
        unit VARCHAR(20) NOT NULL,
        current_stock DECIMAL(10,2) NOT NULL DEFAULT 0,
        min_stock_level DECIMAL(10,2) NOT NULL,
        max_stock_level DECIMAL(10,2),
        cost_per_unit DECIMAL(10,4) NOT NULL,
        image_url VARCHAR(255) NULL,
        supplier_id BIGINT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const menuItemIngredientsTable = `
      CREATE TABLE IF NOT EXISTS menu_item_ingredients (
        menu_item_id BIGINT NOT NULL,
        ingredient_id BIGINT NOT NULL,
        quantity_required DECIMAL(10,2) NOT NULL,
        PRIMARY KEY (menu_item_id, ingredient_id),
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const modifierIngredientsTable = `
      CREATE TABLE IF NOT EXISTS modifier_ingredients (
        modifier_id BIGINT NOT NULL,
        ingredient_id BIGINT NOT NULL,
        quantity_required DECIMAL(10,2) NOT NULL,
        PRIMARY KEY (modifier_id, ingredient_id),
        FOREIGN KEY (modifier_id) REFERENCES menu_item_modifiers(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const stockMovementsTable = `
      CREATE TABLE IF NOT EXISTS stock_movements (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        ingredient_id BIGINT NOT NULL,
        movement_type ENUM('purchase','usage','adjustment','return') NOT NULL,
        quantity DECIMAL(10,2) NOT NULL,
        reference_id VARCHAR(100),
        note TEXT,
        created_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE,
        FOREIGN KEY (created_by) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const purchaseOrdersTable = `
      CREATE TABLE IF NOT EXISTS purchase_orders (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        supplier_id BIGINT NOT NULL,
        po_number VARCHAR(50) UNIQUE NOT NULL,
        order_date DATE NOT NULL,
        expected_delivery DATE,
        status ENUM('draft','sent','received','cancelled') DEFAULT 'draft',
        total_amount DECIMAL(10,2) NOT NULL,
        received_by BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE,
        FOREIGN KEY (received_by) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const purchaseOrderItemsTable = `
      CREATE TABLE IF NOT EXISTS purchase_order_items (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        purchase_order_id BIGINT NOT NULL,
        ingredient_id BIGINT NOT NULL,
        quantity_ordered DECIMAL(10,2) NOT NULL,
        quantity_received DECIMAL(10,2) DEFAULT 0.00,
        unit_cost DECIMAL(10,4) NOT NULL,
        FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
        FOREIGN KEY (ingredient_id) REFERENCES ingredients(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 10. DELIVERY ----
    const deliveryOrdersTable = `
      CREATE TABLE IF NOT EXISTS delivery_orders (
        order_id BIGINT PRIMARY KEY,
        delivery_address TEXT NOT NULL,
        delivery_contact_phone VARCHAR(20) NOT NULL,
        delivery_instructions TEXT,
        assigned_driver_id BIGINT NULL,
        estimated_time INT NULL,
        actual_delivered_at TIMESTAMP NULL,
        delivery_fee DECIMAL(10,2) DEFAULT 0.00,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_driver_id) REFERENCES employees(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const deliveryTrackingTable = `
      CREATE TABLE IF NOT EXISTS delivery_tracking (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        delivery_order_id BIGINT NOT NULL,
        status ENUM('assigned','picked_up','on_the_way','delivered','failed') NOT NULL,
        location_lat DECIMAL(10,8),
        location_lng DECIMAL(11,8),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (delivery_order_id) REFERENCES delivery_orders(order_id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 11. NOTIFICATIONS, FEEDBACK, LOGS ----
    const notificationsTable = `
      CREATE TABLE IF NOT EXISTS notifications (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        type ENUM('order','reservation','inventory','payment','system') DEFAULT 'system',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const feedbackTable = `
      CREATE TABLE IF NOT EXISTS feedback (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        customer_id BIGINT NOT NULL,
        order_id BIGINT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const systemLogsTable = `
      CREATE TABLE IF NOT EXISTS system_logs (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT,
        action VARCHAR(255) NOT NULL,
        activity_type VARCHAR(50),
        entity_type VARCHAR(50),
        entity_id BIGINT,
        old_value JSON,
        new_value JSON,
        ip_address VARCHAR(45),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    // ---- 12. AUTH & SECURITY ----
    const passwordResetTokensTable = `
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        token_hash CHAR(64) NOT NULL,
        expires_at DATETIME NOT NULL,
        used_at TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const userSessionsTable = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        token_id CHAR(36) NOT NULL UNIQUE,
        ip_address VARCHAR(45),
        user_agent VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_seen_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME NOT NULL,
        revoked_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const userAuthProvidersTable = `
      CREATE TABLE IF NOT EXISTS user_auth_providers (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        provider ENUM('google','microsoft','apple') NOT NULL,
        provider_user_id VARCHAR(255) NOT NULL,
        email VARCHAR(100) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_provider_account (provider, provider_user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ---- 13. HR & ATTENDANCE ----
    const attendanceTable = `
      CREATE TABLE IF NOT EXISTS attendance (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        employee_id BIGINT NOT NULL,
        date DATE NOT NULL,
        check_in TIME,
        check_out TIME,
        status ENUM('present','absent','late','half_day') DEFAULT 'present',
        notes TEXT,
        UNIQUE KEY unique_attendance (employee_id, date),
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const shiftsTable = `
      CREATE TABLE IF NOT EXISTS shifts (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        employee_id BIGINT NOT NULL,
        shift_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        role ENUM('waiter','cashier','kitchen','manager') NOT NULL,
        assigned_by BIGINT,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const employeePerformanceReviewsTable = `
      CREATE TABLE IF NOT EXISTS employee_performance_reviews (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        employee_id BIGINT NOT NULL,
        reviewed_by BIGINT NULL,
        review_date DATE NOT NULL,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comments TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
        FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
      ) ENGINE=InnoDB;
    `;

    const messagesTable = `
      CREATE TABLE IF NOT EXISTS messages (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        sender_id BIGINT NOT NULL,
        recipient_id BIGINT NOT NULL,
        body TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    const permissionsTable = `
      CREATE TABLE IF NOT EXISTS permissions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(100) UNIQUE NOT NULL,
        description TEXT NULL
      ) ENGINE=InnoDB;
    `;

    const rolePermissionsTable = `
      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INT NOT NULL,
        permission_id INT NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      ) ENGINE=InnoDB;
    `;

    // ==============================
    // TABLE CREATION SEQUENCE (FK-safe)
    // ==============================
    const tables = [
      { query: restaurantsTable, name: "restaurants" },
      { query: restaurantSettingsTable, name: "restaurant_settings" },
      { query: usersTable, name: "users" },
      { query: rolesTable, name: "roles" },
      { query: userRolesTable, name: "user_roles" },
      { query: employeesTable, name: "employees" },
      { query: customersTable, name: "customers" },
      { query: customerAddressesTable, name: "customer_addresses" },
      { query: tablesTable, name: "tables" },
      { query: reservationsTable, name: "reservations" },
      { query: tableAssignmentsTable, name: "table_assignments" },
      { query: menuCategoriesTable, name: "menu_categories" },
      { query: menuItemsTable, name: "menu_items" },
      { query: menuItemModifiersTable, name: "menu_item_modifiers" },
      { query: favoritesTable, name: "favorites" },
      { query: discountsTable, name: "discounts" },
      { query: ordersTable, name: "orders" },
      { query: orderTablesTable, name: "order_tables" },
      { query: orderItemsTable, name: "order_items" },
      { query: orderItemModifiersTable, name: "order_item_modifiers" },
      { query: kitchenQueueTable, name: "kitchen_queue" },
      { query: customerRequestsTable, name: "customer_requests" },
      { query: invoicesTable, name: "invoices" },
      { query: paymentsTable, name: "payments" },
      { query: refundsTable, name: "refunds" },
      { query: cashSessionsTable, name: "cash_sessions" },
      { query: suppliersTable, name: "suppliers" },
      { query: ingredientsTable, name: "ingredients" },
      { query: menuItemIngredientsTable, name: "menu_item_ingredients" },
      { query: modifierIngredientsTable, name: "modifier_ingredients" },
      { query: stockMovementsTable, name: "stock_movements" },
      { query: purchaseOrdersTable, name: "purchase_orders" },
      { query: purchaseOrderItemsTable, name: "purchase_order_items" },
      { query: deliveryOrdersTable, name: "delivery_orders" },
      { query: deliveryTrackingTable, name: "delivery_tracking" },
      { query: notificationsTable, name: "notifications" },
      { query: feedbackTable, name: "feedback" },
      { query: systemLogsTable, name: "system_logs" },
      { query: passwordResetTokensTable, name: "password_reset_tokens" },
      { query: userSessionsTable, name: "user_sessions" },
      { query: userAuthProvidersTable, name: "user_auth_providers" },
      { query: attendanceTable, name: "attendance" },
      { query: shiftsTable, name: "shifts" },
      { query: employeePerformanceReviewsTable, name: "employee_performance_reviews" },
      { query: messagesTable, name: "messages" },
      { query: permissionsTable, name: "permissions" },
      { query: rolePermissionsTable, name: "role_permissions" },
    ];

    const promisePool = dbConnection.promise();

    // Execute table construction sequentially
    for (const table of tables) {
      await promisePool.execute(table.query);
    }

    console.log("🚀 Restaurant Database schema created successfully!");

    // Seed base data & test users
    await seedDatabase(promisePool);

    // Execute core querying optimization indexes
    await createIndexes(promisePool);
  } catch (error) {
    console.error("❌ Database schema initialization failed:", error.message);
  }
}

// ==============================
// SEED DATA (Collaborative Team Setup)
// ==============================
async function seedDatabase(promisePool) {
  const seedQueries = [
    `INSERT IGNORE INTO roles (id, name, description) VALUES
      (1, 'Super Admin', 'System wide access'),
      (2, 'Admin', 'Restaurant full access'),
      (3, 'Manager', 'Restaurant operations, analytics, inventory, employees'),
      (4, 'Waiter', 'Tables, orders, customer requests'),
      (5, 'Cashier', 'Billing, payments, receipts, refunds'),
      (6, 'Kitchen Staff', 'Incoming orders and preparation status'),
      (7, 'Customer', 'Online ordering portal')`,

    `INSERT IGNORE INTO restaurants (id, name, address, phone) VALUES
      (1, 'Main Branch', '123 Main St', '555-0100')`,

    `INSERT IGNORE INTO restaurant_settings (restaurant_id, setting_key, setting_value) VALUES
      (1, 'currency', 'ETB'),
      (1, 'tax_rate', '15'),
      (1, 'delivery_fee', '0')`,

    // Pre-seeded users for team testing (Password for all is 'password123')
    `INSERT IGNORE INTO users (id, restaurant_id, username, email, password_hash, full_name, is_active) VALUES 
      (1, 1, 'admin', 'admin@resto.com', 'password123', 'Admin User', TRUE),
      (2, 1, 'michael', 'michael@resto.com', 'password123', 'Michael Cashier', TRUE),
      (3, 1, 'chef', 'chef@resto.com', 'password123', 'Kitchen Staff', TRUE),
      (4, 1, 'john', 'john@resto.com', 'password123', 'John Manager', TRUE),
      (5, 1, 'david', 'david@resto.com', 'password123', 'David Waiter', TRUE)`,

    // Link users to roles
    `INSERT IGNORE INTO user_roles (user_id, role_id) VALUES 
      (1, 2), -- Admin -> Admin
      (2, 5), -- Michael -> Cashier
      (3, 6), -- Chef -> Kitchen Staff
      (4, 3), -- John -> Manager
      (5, 4)  -- David -> Waiter`
  ];

  for (const query of seedQueries) {
    try {
      await promisePool.execute(query);
    } catch (err) {
      console.log("⚠️ Seed notice:", err.sqlMessage);
    }
  }

  console.log("🌱 Collaborative seed data & test accounts verified!");
}

// ==============================
// OPTIMIZATION INDEXES
// ==============================
async function createIndexes(promisePool) {
  const indexes = [
    "CREATE INDEX idx_users_email ON users(email)",
    "CREATE INDEX idx_employees_user ON employees(user_id)",
    "CREATE INDEX idx_orders_restaurant ON orders(restaurant_id)",
    "CREATE INDEX idx_orders_status ON orders(status)",
    "CREATE INDEX idx_orders_ordered_at ON orders(ordered_at)",
    "CREATE INDEX idx_order_items_order ON order_items(order_id)",
    "CREATE INDEX idx_reservations_date ON reservations(reservation_date)",
    "CREATE INDEX idx_invoices_order ON invoices(order_id)",
    "CREATE INDEX idx_payments_invoice ON payments(invoice_id)",
    "CREATE INDEX idx_stock_movements_ingredient ON stock_movements(ingredient_id)",
    "CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read)",
    "CREATE INDEX idx_feedback_customer ON feedback(customer_id)",
    "CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read)",
    "CREATE INDEX idx_table_assignments_active ON table_assignments(table_id, released_at)",
  ];

  for (const indexQuery of indexes) {
    try {
      await promisePool.execute(indexQuery);
    } catch (err) {
      // Silently ignore duplicate index errors if already created by team members
      if (!err.sqlMessage || !err.sqlMessage.includes("Duplicate key name")) {
        // Safe to ignore
      }
    }
  }

  console.log("⚡ Performance optimization indexes verified!");
}

// ==============================
// EXPORT PROMISE-BASED POOL
// ==============================
module.exports = dbConnection.promise();