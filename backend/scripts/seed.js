require('dotenv').config();

const db = require('../config/database');
const { restaurantId } = require('../config/auth');

const FORCE = process.argv.includes('--force');

const pad = (n) => String(n).padStart(2, '0');
const stamp = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
const dateOnly = (date) => stamp(date).slice(0, 10);
const round2 = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

function random(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SUPPLIERS = [
  ['Fresh Farms Ltd', 'Abel Tesfaye', '+251911000101', 'abel@freshfarms.example', 'Net 15'],
  ['Addis Dairy', 'Hana Bekele', '+251911000102', 'hana@addisdairy.example', 'Net 30'],
  ['Bole Bakery Supplies', 'Samuel Girma', '+251911000103', 'samuel@bolebakery.example', 'Cash on delivery'],
];

const INGREDIENTS = [
  ['Beef', 'kg', 25, 10, 60, 450, '🥩', 'Fresh Farms Ltd'],
  ['Chicken', 'kg', 18, 8, 40, 280, '🍗', 'Fresh Farms Ltd'],
  ['Teff Flour', 'kg', 40, 15, 100, 95, '🌾', 'Bole Bakery Supplies'],
  ['Wheat Flour', 'kg', 0, 10, 80, 60, '🌾', 'Bole Bakery Supplies'],
  ['Tomato', 'kg', 12, 8, 30, 45, '🍅', 'Fresh Farms Ltd'],
  ['Onion', 'kg', 20, 8, 40, 35, '🧅', 'Fresh Farms Ltd'],
  ['Cheese', 'kg', 3, 5, 20, 520, '🧀', 'Addis Dairy'],
  ['Milk', 'l', 30, 10, 60, 55, '🥛', 'Addis Dairy'],
  ['Coffee Beans', 'kg', 9, 4, 20, 600, '☕', 'Fresh Farms Ltd'],
  ['Eggs', 'pcs', 120, 40, 300, 8, '🥚', 'Addis Dairy'],
  ['Rice', 'kg', 50, 15, 100, 70, '🍚', 'Fresh Farms Ltd'],
  ['Cooking Oil', 'l', 22, 8, 50, 180, '🫒', 'Fresh Farms Ltd'],
];

const MENU = [
  ['Breakfast', 'Firfir', 'Shredded injera sauteed in spiced berbere sauce', 120, 12, [['Teff Flour', 0.15], ['Onion', 0.05], ['Tomato', 0.05]]],
  ['Breakfast', 'Scrambled Eggs', 'Three eggs with tomato and onion', 90, 8, [['Eggs', 3], ['Onion', 0.05], ['Tomato', 0.05]]],
  ['Appetizers', 'Sambusa', 'Crispy pastry filled with spiced beef', 60, 10, [['Wheat Flour', 0.08], ['Beef', 0.05], ['Onion', 0.05]]],
  ['Appetizers', 'Garden Salad', 'Fresh seasonal vegetables', 85, 6, [['Tomato', 0.15], ['Onion', 0.05]]],
  ['Main Course', 'Doro Wat', 'Spicy chicken stew with a boiled egg and injera', 350, 25, [['Chicken', 0.4], ['Onion', 0.2], ['Eggs', 1], ['Teff Flour', 0.1]]],
  ['Main Course', 'Kitfo', 'Minced beef with spiced butter and cheese', 420, 15, [['Beef', 0.3], ['Cheese', 0.05]]],
  ['Main Course', 'Beef Tibs', 'Sauteed beef cubes with onions and peppers', 380, 18, [['Beef', 0.3], ['Onion', 0.1], ['Cooking Oil', 0.03]]],
  ['Main Course', 'Beef Burger', 'Grilled beef patty with cheese and fresh vegetables', 220, 15, [['Beef', 0.2], ['Cheese', 0.03], ['Wheat Flour', 0.1]]],
  ['Main Course', 'Vegetable Plate', 'Rice with seasonal vegetables', 190, 12, [['Tomato', 0.2], ['Rice', 0.2]]],
  ['Drinks', 'Ethiopian Coffee', 'Traditionally brewed coffee', 40, 5, [['Coffee Beans', 0.02]]],
  ['Drinks', 'Macchiato', 'Espresso with steamed milk', 55, 4, [['Coffee Beans', 0.02], ['Milk', 0.1]]],
  ['Drinks', 'Fresh Orange Juice', 'Freshly squeezed', 70, 5, []],
  ['Drinks', 'Tea', 'Spiced black tea', 30, 3, []],
  ['Drinks', 'Soft Drink', 'Chilled bottle', 35, 1, []],
  ['Desserts', 'Chocolate Cake', 'Rich chocolate layer cake', 110, 3, []],
  ['Desserts', 'Fruit Salad', 'Seasonal fruit', 75, 5, []],
];

const MODIFIERS = [
  ['Beef Burger', 'Extra cheese', 25, [['Cheese', 0.03]]],
  ['Beef Burger', 'Extra patty', 80, [['Beef', 0.2]]],
  ['Macchiato', 'Extra shot', 15, [['Coffee Beans', 0.01]]],
  ['Doro Wat', 'Extra egg', 15, [['Eggs', 1]]],
];

const CUSTOMERS = [
  ['Abebe', 'Kebede', '+251911223344', 'abebe.k@example.com'],
  ['Tigist', 'Alemu', '+251922334455', 'tigist.a@example.com'],
  ['Yonas', 'Haile', '+251933445566', 'yonas.h@example.com'],
  ['Meron', 'Tadesse', '+251944556677', 'meron.t@example.com'],
];

async function waitForSchema() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const [[row]] = await db.query('SELECT COUNT(*) AS total FROM roles');
      if (row.total >= 6) return;
    } catch (err) {
      if (attempt === 59) throw err;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
}

async function one(sql, params) {
  const [rows] = await db.query(sql, params);
  return rows[0] || null;
}

async function idByName(table, name, extra = '') {
  const row = await one(`SELECT id FROM ${table} WHERE name = ? ${extra} LIMIT 1`, [name]);
  return row ? row.id : null;
}

async function seedSuppliers(log) {
  for (const [name, contact, phone, email, terms] of SUPPLIERS) {
    if (await one('SELECT id FROM suppliers WHERE restaurant_id = ? AND name = ?', [restaurantId, name])) continue;
    await db.query(
      'INSERT INTO suppliers (restaurant_id, name, contact_person, phone, email, payment_terms) VALUES (?, ?, ?, ?, ?, ?)',
      [restaurantId, name, contact, phone, email, terms]
    );
    log.suppliers += 1;
  }
}

async function seedIngredients(log) {
  for (const [name, unit, stock, min, max, cost, icon, supplier] of INGREDIENTS) {
    if (await one('SELECT id FROM ingredients WHERE restaurant_id = ? AND name = ?', [restaurantId, name])) continue;
    const supplierId = await idByName('suppliers', supplier, `AND restaurant_id = ${Number(restaurantId)}`);
    const [result] = await db.query(
      `INSERT INTO ingredients (restaurant_id, name, unit, current_stock, min_stock_level, max_stock_level, cost_per_unit, image_url, supplier_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [restaurantId, name, unit, stock, min, max, cost, icon, supplierId]
    );
    if (stock > 0) {
      await db.query(
        "INSERT INTO stock_movements (ingredient_id, movement_type, quantity, note) VALUES (?, 'adjustment', ?, 'Opening stock')",
        [result.insertId, stock]
      );
    }
    log.ingredients += 1;
  }
}

async function ingredientId(name) {
  return idByName('ingredients', name, `AND restaurant_id = ${Number(restaurantId)}`);
}

async function seedMenu(log) {
  let order = 0;
  for (const category of [...new Set(MENU.map((item) => item[0]))]) {
    order += 1;
    if (await one('SELECT id FROM menu_categories WHERE restaurant_id = ? AND name = ?', [restaurantId, category])) continue;
    await db.query('INSERT INTO menu_categories (restaurant_id, name, display_order, is_active) VALUES (?, ?, ?, TRUE)', [restaurantId, category, order]);
    log.categories += 1;
  }

  for (const [category, name, description, price, prep, recipe] of MENU) {
    if (await one('SELECT id FROM menu_items WHERE restaurant_id = ? AND name = ?', [restaurantId, name])) continue;
    const categoryId = await idByName('menu_categories', category, `AND restaurant_id = ${Number(restaurantId)}`);
    const [result] = await db.query(
      `INSERT INTO menu_items (restaurant_id, category_id, name, description, price, is_available, preparation_time_minutes)
       VALUES (?, ?, ?, ?, ?, TRUE, ?)`,
      [restaurantId, categoryId, name, description, price, prep]
    );
    for (const [ingredient, quantity] of recipe) {
      await db.query('INSERT INTO menu_item_ingredients (menu_item_id, ingredient_id, quantity_required) VALUES (?, ?, ?)', [
        result.insertId,
        await ingredientId(ingredient),
        quantity,
      ]);
    }
    log.menuItems += 1;
  }

  for (const [itemName, name, price, recipe] of MODIFIERS) {
    const itemId = await idByName('menu_items', itemName, `AND restaurant_id = ${Number(restaurantId)}`);
    if (!itemId || (await one('SELECT id FROM menu_item_modifiers WHERE menu_item_id = ? AND name = ?', [itemId, name]))) continue;
    const [result] = await db.query('INSERT INTO menu_item_modifiers (menu_item_id, name, price_modifier, is_available) VALUES (?, ?, ?, TRUE)', [itemId, name, price]);
    for (const [ingredient, quantity] of recipe) {
      await db.query('INSERT INTO modifier_ingredients (modifier_id, ingredient_id, quantity_required) VALUES (?, ?, ?)', [
        result.insertId,
        await ingredientId(ingredient),
        quantity,
      ]);
    }
  }
}

async function seedTables(log) {
  const layout = [];
  for (let number = 1; number <= 12; number += 1) {
    const section = number <= 6 ? 'Main Hall' : number <= 9 ? 'Patio' : 'VIP';
    layout.push([String(number), number % 2 === 0 ? 4 : 2, section, number <= 9 ? 'square' : 'round', number <= 9 ? 4 : number === 12 ? 8 : 6]);
  }
  for (const [tableNumber, capacity, section, shape, seats] of layout) {
    if (await one('SELECT id FROM `tables` WHERE restaurant_id = ? AND table_number = ?', [restaurantId, tableNumber])) continue;
    const column = (Number(tableNumber) - 1) % 4;
    const line = Math.floor((Number(tableNumber) - 1) / 4);
    await db.query(
      'INSERT INTO `tables` (restaurant_id, table_number, capacity, pos_x, pos_y, shape, section, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [restaurantId, tableNumber, Math.max(capacity, seats > 4 ? seats : capacity), 40 + column * 160, 40 + line * 140, shape, section, 'available']
    );
    log.tables += 1;
  }
}

async function seedDiscounts(log) {
  const start = dateOnly(new Date());
  const end = dateOnly(new Date(Date.now() + 365 * 86400000));
  const rows = [
    ['WELCOME10', 'Welcome offer: 10% off your first order', 'percentage', 10, 100, 1],
    ['SAVE50', 'Save 50 on orders over 300', 'fixed_amount', 50, 300, 0],
  ];
  for (const [code, description, type, value, minimum, firstOnly] of rows) {
    if (await one('SELECT id FROM discounts WHERE LOWER(code) = LOWER(?)', [code])) continue;
    await db.query(
      `INSERT INTO discounts (restaurant_id, code, description, discount_type, value, min_order_amount, first_order_only, start_date, end_date, usage_limit, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 500, TRUE)`,
      [restaurantId, code, description, type, value, minimum, firstOnly, start, end]
    );
    log.discounts += 1;
  }
}

async function seedPeople(log) {
  if (!(await one("SELECT id FROM employees WHERE restaurant_id = ? AND position = 'Delivery Driver'", [restaurantId]))) {
    const row = await one("SELECT COALESCE(MAX(CAST(SUBSTRING(employee_code, 5) AS UNSIGNED)), 0) + 1 AS next FROM employees WHERE employee_code LIKE 'EMP-%'", []);
    await db.query(
      `INSERT INTO employees (restaurant_id, employee_code, first_name, last_name, position, department, hire_date, salary, phone)
       VALUES (?, ?, 'Dawit', 'Rider', 'Delivery Driver', 'Delivery', ?, 6000, '+251922000000')`,
      [restaurantId, `EMP-${String(row.next).padStart(3, '0')}`, dateOnly(new Date())]
    );
    log.employees += 1;
  }
  for (const [first, last, phone, email] of CUSTOMERS) {
    if (await one('SELECT id FROM customers WHERE phone = ?', [phone])) continue;
    await db.query('INSERT INTO customers (first_name, last_name, phone, email) VALUES (?, ?, ?, ?)', [first, last, phone, email]);
    log.customers += 1;
  }
}

async function seedHistory(log) {
  const existing = await one('SELECT COUNT(*) AS total FROM orders WHERE restaurant_id = ?', [restaurantId]);
  if (Number(existing.total) >= 10 && !FORCE) return false;

  const items = (await db.query('SELECT id, name, price FROM menu_items WHERE restaurant_id = ? AND is_available = TRUE', [restaurantId]))[0];
  const tables = (await db.query('SELECT id FROM `tables` WHERE restaurant_id = ? ORDER BY id', [restaurantId]))[0];
  const customers = (await db.query('SELECT id FROM customers WHERE user_id IS NULL ORDER BY id', []))[0];
  const waiter = await one("SELECT id FROM employees WHERE restaurant_id = ? AND position = 'Waiter' LIMIT 1", [restaurantId]);
  const cashier = await one("SELECT id FROM employees WHERE restaurant_id = ? AND position = 'Cashier' LIMIT 1", [restaurantId]);
  const taxRate = Number((await one("SELECT setting_value AS v FROM restaurant_settings WHERE restaurant_id = ? AND setting_key = 'tax_rate'", [restaurantId]))?.v || 15);
  if (!items.length || !tables.length) return false;

  const rand = random(20260101);
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const methods = ['cash', 'cash', 'card', 'telebirr', 'telebirr', 'cbe_birr'];

  const createOrder = async ({ orderedAt, status, type, live }) => {
    const lines = Array.from({ length: 1 + Math.floor(rand() * 3) }, () => ({ item: pick(items), quantity: 1 + Math.floor(rand() * 2) }));
    const subtotal = round2(lines.reduce((sum, line) => sum + Number(line.item.price) * line.quantity, 0));
    const tax = round2((subtotal * taxRate) / 100);
    const total = round2(subtotal + tax);
    const customer = type === 'dine_in' && rand() < 0.6 ? null : pick(customers);

    const [order] = await db.query(
      `INSERT INTO orders (restaurant_id, order_number, customer_id, waiter_id, order_type, status, subtotal, tax_amount, discount_amount, total_amount, ordered_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
      [restaurantId, `S${Date.now()}${Math.floor(rand() * 1e6)}`.slice(0, 20), customer ? customer.id : null, type === 'dine_in' ? waiter && waiter.id : null, type, status, subtotal, tax, total, stamp(orderedAt)]
    );
    const orderId = order.insertId;
    await db.query('UPDATE orders SET order_number = ? WHERE id = ?', [`ORD-${String(orderId).padStart(4, '0')}`, orderId]);

    for (const line of lines) {
      await db.query(
        'INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, item_status, preparation_progress) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, line.item.id, line.quantity, line.item.price, status === 'completed' || status === 'ready' ? 'ready' : status === 'preparing' ? 'preparing' : 'pending', status === 'completed' || status === 'ready' ? 100 : 0]
      );
    }
    const table = type === 'dine_in' ? pick(tables) : null;
    if (table) await db.query('INSERT INTO order_tables (order_id, table_id) VALUES (?, ?)', [orderId, table.id]);

    const started = new Date(orderedAt.getTime() + 2 * 60000);
    const finished = new Date(started.getTime() + (10 + Math.floor(rand() * 15)) * 60000);
    await db.query('INSERT INTO kitchen_queue (order_id, priority, cooking_started_at, cooking_finished_at) VALUES (?, 0, ?, ?)', [
      orderId,
      status === 'pending' ? null : stamp(started),
      ['ready', 'completed'].includes(status) ? stamp(finished) : null,
    ]);

    if (status === 'completed') {
      const generated = new Date(finished.getTime() + 20 * 60000);
      const [invoice] = await db.query(
        'INSERT INTO invoices (order_id, invoice_number, subtotal, tax, discount, total, paid_amount, status, generated_by, generated_at) VALUES (?, ?, ?, ?, 0, ?, ?, ?, ?, ?)',
        [orderId, `S${Date.now()}${Math.floor(rand() * 1e6)}`.slice(0, 20), subtotal, tax, total, total, 'paid', cashier && cashier.id, stamp(generated)]
      );
      await db.query('UPDATE invoices SET invoice_number = ? WHERE id = ?', [`INV-${String(invoice.insertId).padStart(4, '0')}`, invoice.insertId]);
      const method = pick(methods);
      await db.query(
        "INSERT INTO payments (invoice_id, amount, payment_method, transaction_id, payment_status, received_by, paid_at) VALUES (?, ?, ?, ?, 'completed', ?, ?)",
        [invoice.insertId, total, method, method === 'cash' || method === 'card' ? null : `SEED-${invoice.insertId}-${Math.floor(rand() * 1e6)}`, cashier && cashier.id, stamp(new Date(generated.getTime() + 5 * 60000))]
      );
      if (customer) await db.query('UPDATE customers SET total_orders = total_orders + 1, total_spent = total_spent + ? WHERE id = ?', [total, customer.id]);
    }
    if (live && table) {
      await db.query('UPDATE `tables` SET status = ?, assigned_waiter_id = ? WHERE id = ?', ['occupied', waiter && waiter.id, table.id]);
      if (waiter) await db.query('INSERT INTO table_assignments (table_id, waiter_id, guest_count) VALUES (?, ?, 2)', [table.id, waiter.id]);
    }
    log.orders += 1;
    return orderId;
  };

  for (let daysAgo = 13; daysAgo >= 0; daysAgo -= 1) {
    const count = 2 + Math.floor(rand() * 3);
    for (let index = 0; index < count; index += 1) {
      const when = new Date();
      when.setDate(when.getDate() - daysAgo);
      if (daysAgo === 0) when.setTime(Date.now() - (2 + index * 2) * 3600000);
      else when.setHours(9 + Math.floor(rand() * 12), Math.floor(rand() * 60), 0, 0);
      const cancelled = rand() < 0.05;
      await createOrder({ orderedAt: when, status: cancelled ? 'cancelled' : 'completed', type: pick(['dine_in', 'dine_in', 'takeaway', 'online']) });
    }
  }

  const free = tables.length;
  for (const [offset, status] of [[5, 'pending'], [12, 'preparing'], [22, 'ready']]) {
    await createOrder({ orderedAt: new Date(Date.now() - offset * 60000), status, type: status === 'pending' ? 'takeaway' : 'dine_in', live: status !== 'pending' && free > 0 });
  }
  return true;
}

async function main() {
  if (process.env.NODE_ENV === 'production' && !FORCE) {
    throw new Error('Refusing to seed demo data in production. Re-run with --force if you really mean it.');
  }
  await waitForSchema();

  const log = { suppliers: 0, ingredients: 0, categories: 0, menuItems: 0, tables: 0, discounts: 0, employees: 0, customers: 0, orders: 0 };
  await seedSuppliers(log);
  await seedIngredients(log);
  await seedMenu(log);
  await seedTables(log);
  await seedDiscounts(log);
  await seedPeople(log);
  log.history = await seedHistory(log);

  console.log('Seed finished:', log);
  return log;
}

module.exports = { main };

if (require.main === module) {
  main()
    .then(() => db.end())
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('Seed failed:', err.message);
      process.exit(1);
    });
}