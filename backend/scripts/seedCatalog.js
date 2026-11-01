/**
 * Safe, repeatable catalog seed.
 *  - uses its OWN connection (does not load config/database.js, so it cannot re-run your
 *    schema/seed code or reset any passwords)
 *  - only INSERTs rows that are missing (matched by name / table number / code)
 *  - never UPDATEs, DELETEs, TRUNCATEs or DROPs anything
 *  - runs in one transaction: if anything fails, nothing is saved
 *
 * Run once the server has started at least one time (so the tables exist):
 *   node scripts/seedCatalog.js
 */
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });
const mysql = require("mysql2/promise");

const RESTAURANT_ID = 1;

const CATEGORIES = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Appetizers",
  "Drinks",
  "Desserts",
  "Salads",
];

const MENU_ITEMS = [
  {
    name: "Grilled Chicken with Veggies",
    cat: "Dinner",
    price: 12.99,
    img: "food-grilled-chicken.png",
    desc: "Tender grilled chicken served with fresh seasonal vegetables.",
  },
  {
    name: "Beef Burger with Fries",
    cat: "Lunch",
    price: 10.99,
    img: "food-burger-fries.png",
    desc: "Juicy beef burger with crispy golden fries.",
  },
  {
    name: "Margherita Pizza",
    cat: "Dinner",
    price: 11.99,
    img: "food-pizza.png",
    desc: "Classic pizza with tomato, mozzarella and basil.",
  },
  {
    name: "Pasta Alfredo",
    cat: "Dinner",
    price: 11.49,
    img: "food-pasta-alfredo.png",
    desc: "Creamy alfredo sauce over fettuccine pasta.",
  },
  {
    name: "Chicken Biryani",
    cat: "Dinner",
    price: 13.49,
    img: "food-biryani.png",
    desc: "Fragrant spiced rice cooked with marinated chicken.",
  },
  {
    name: "Fresh Orange Juice",
    cat: "Drinks",
    price: 3.49,
    img: "food-juice.png",
    desc: "Freshly squeezed orange juice.",
  },
  {
    name: "Chocolate Lava Cake",
    cat: "Desserts",
    price: 5.99,
    img: "food-chocolate-cake.png",
    desc: "Warm chocolate cake with a molten centre.",
  },
  {
    name: "Grilled Steak",
    cat: "Dinner",
    price: 18.99,
    img: "food-steak.png",
    desc: "Char-grilled steak cooked to your liking.",
  },
  {
    name: "Healthy Bowl",
    cat: "Lunch",
    price: 9.99,
    img: "food-healthy-bowl.png",
    desc: "Grains, greens and roasted vegetables.",
  },
  {
    name: "Garden Salad",
    cat: "Salads",
    price: 7.49,
    img: "food-salad.png",
    desc: "Crisp mixed greens with house dressing.",
  },
  {
    name: "Ice Cream Sundae",
    cat: "Desserts",
    price: 4.99,
    img: "food-dessert.png",
    desc: "Vanilla ice cream with chocolate sauce.",
  },
];

const TABLES = [
  ["1", 2, "Main Hall"],
  ["2", 2, "Main Hall"],
  ["3", 4, "Main Hall"],
  ["4", 4, "Main Hall"],
  ["5", 4, "Main Hall"],
  ["6", 2, "Terrace"],
  ["7", 6, "Main Hall"],
  ["8", 4, "Terrace"],
  ["9", 2, "Terrace"],
  ["10", 4, "Terrace"],
  ["11", 2, "Main Hall"],
  ["12", 6, "VIP Lounge"],
  ["13", 4, "Main Hall"],
  ["14", 4, "Main Hall"],
  ["15", 2, "Main Hall"],
  ["16", 8, "VIP Lounge"],
];

const SUPPLIERS = [
  {
    name: "Fresh Farm Produce",
    contact: "Abel Tesfaye",
    phone: "0911000101",
    terms: "Net 7",
  },
  {
    name: "City Meat Market",
    contact: "Hanna Bekele",
    phone: "0911000102",
    terms: "Net 14",
  },
  {
    name: "Dairy Direct",
    contact: "Samuel Girma",
    phone: "0911000103",
    terms: "Net 7",
  },
];

// name, unit, stock, min, max, cost per unit, supplier
const INGREDIENTS = [
  ["Tomato", "kg", 5.0, 10.0, 40.0, 1.2, "Fresh Farm Produce"],
  ["Chicken Breast", "kg", 2.0, 8.0, 30.0, 6.5, "City Meat Market"],
  ["Cooking Oil", "L", 1.5, 5.0, 20.0, 3.0, "Fresh Farm Produce"],
  ["Cheese", "kg", 3.0, 5.0, 20.0, 8.0, "Dairy Direct"],
  ["Flour", "kg", 25.0, 10.0, 60.0, 0.9, "Fresh Farm Produce"],
  ["Beef", "kg", 12.0, 8.0, 40.0, 9.0, "City Meat Market"],
  ["Rice", "kg", 30.0, 10.0, 80.0, 1.1, "Fresh Farm Produce"],
  ["Oranges", "kg", 15.0, 8.0, 40.0, 1.0, "Fresh Farm Produce"],
];

// menu item, ingredient, quantity per serving
const RECIPES = [
  ["Margherita Pizza", "Tomato", 0.2],
  ["Margherita Pizza", "Cheese", 0.15],
  ["Margherita Pizza", "Flour", 0.25],
  ["Grilled Chicken with Veggies", "Chicken Breast", 0.3],
  ["Grilled Chicken with Veggies", "Cooking Oil", 0.02],
  ["Beef Burger with Fries", "Beef", 0.2],
  ["Beef Burger with Fries", "Cheese", 0.03],
  ["Chicken Biryani", "Chicken Breast", 0.25],
  ["Chicken Biryani", "Rice", 0.2],
  ["Fresh Orange Juice", "Oranges", 0.4],
];

const DISCOUNTS = [
  {
    code: "RESTA10",
    desc: "10% off your order",
    type: "percentage",
    value: 10,
    first: false,
  },
  {
    code: "WELCOME10",
    desc: "10% off your first order",
    type: "percentage",
    value: 10,
    first: true,
  },
];

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const added = {};
  const count = (key) => {
    added[key] = (added[key] || 0) + 1;
  };

  try {
    await conn.beginTransaction();

    // Restaurant must exist (your database.js seed creates id 1)
    await conn.execute(
      'INSERT IGNORE INTO restaurants (id, name, address) VALUES (?, "Main Branch", "123 Main St")',
      [RESTAURANT_ID],
    );

    // 1. Categories (matched by name)
    const catId = {};
    for (const [i, name] of CATEGORIES.entries()) {
      const [rows] = await conn.execute(
        "SELECT id FROM menu_categories WHERE restaurant_id = ? AND name = ?",
        [RESTAURANT_ID, name],
      );
      if (rows.length) {
        catId[name] = rows[0].id;
        continue;
      }
      const [r] = await conn.execute(
        "INSERT INTO menu_categories (restaurant_id, name, display_order) VALUES (?, ?, ?)",
        [RESTAURANT_ID, name, i + 1],
      );
      catId[name] = r.insertId;
      count("categories");
    }

    // 2. Menu items (matched by name)
    const itemId = {};
    for (const it of MENU_ITEMS) {
      const [rows] = await conn.execute(
        "SELECT id FROM menu_items WHERE restaurant_id = ? AND name = ?",
        [RESTAURANT_ID, it.name],
      );
      if (rows.length) {
        itemId[it.name] = rows[0].id;
        continue;
      }
      const [r] = await conn.execute(
        `INSERT INTO menu_items (restaurant_id, category_id, name, description, price, image_url, is_available)
         VALUES (?, ?, ?, ?, ?, ?, TRUE)`,
        [
          RESTAURANT_ID,
          catId[it.cat],
          it.name,
          it.desc,
          it.price,
          `/assets/food-placeholders/${it.img}`,
        ],
      );
      itemId[it.name] = r.insertId;
      count("menu items");
    }

    // 3. Tables (unique by restaurant + table number). Existing tables keep their live status.
    const [wRows] = await conn.execute(
      'SELECT id FROM employees WHERE employee_code = "EMP-003" LIMIT 1',
    );
    const waiterId = wRows.length ? wRows[0].id : null;
    for (const [num, cap, section] of TABLES) {
      const [r] = await conn.execute(
        `INSERT IGNORE INTO tables (restaurant_id, table_number, capacity, section, assigned_waiter_id, status)
         VALUES (?, ?, ?, ?, ?, 'available')`,
        [RESTAURANT_ID, num, cap, section, waiterId],
      );
      if (r.affectedRows) count("tables");
    }

    // 4. Suppliers (matched by name)
    const supId = {};
    for (const s of SUPPLIERS) {
      const [rows] = await conn.execute(
        "SELECT id FROM suppliers WHERE restaurant_id = ? AND name = ?",
        [RESTAURANT_ID, s.name],
      );
      if (rows.length) {
        supId[s.name] = rows[0].id;
        continue;
      }
      const [r] = await conn.execute(
        "INSERT INTO suppliers (restaurant_id, name, contact_person, phone, payment_terms) VALUES (?, ?, ?, ?, ?)",
        [RESTAURANT_ID, s.name, s.contact, s.phone, s.terms],
      );
      supId[s.name] = r.insertId;
      count("suppliers");
    }

    // 5. Ingredients (matched by name; existing stock levels are never changed)
    const ingId = {};
    for (const [name, unit, stock, min, max, cost, supplier] of INGREDIENTS) {
      const [rows] = await conn.execute(
        "SELECT id FROM ingredients WHERE restaurant_id = ? AND name = ?",
        [RESTAURANT_ID, name],
      );
      if (rows.length) {
        ingId[name] = rows[0].id;
        continue;
      }
      const [r] = await conn.execute(
        `INSERT INTO ingredients (restaurant_id, name, unit, current_stock, min_stock_level, max_stock_level, cost_per_unit, supplier_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          RESTAURANT_ID,
          name,
          unit,
          stock,
          min,
          max,
          cost,
          supId[supplier] || null,
        ],
      );
      ingId[name] = r.insertId;
      count("ingredients");
    }

    // 6. Recipes (primary key menu_item + ingredient, so duplicates are ignored)
    for (const [item, ing, qty] of RECIPES) {
      if (!itemId[item] || !ingId[ing]) continue;
      const [r] = await conn.execute(
        "INSERT IGNORE INTO menu_item_ingredients (menu_item_id, ingredient_id, quantity_required) VALUES (?, ?, ?)",
        [itemId[item], ingId[ing], qty],
      );
      if (r.affectedRows) count("recipe lines");
    }

    // 7. Discount codes (code is unique)
    for (const d of DISCOUNTS) {
      const [r] = await conn.execute(
        `INSERT IGNORE INTO discounts
           (restaurant_id, code, description, discount_type, value, min_order_amount, first_order_only, start_date, end_date, usage_limit)
         VALUES (?, ?, ?, ?, ?, 0, ?, '2025-01-01', '2030-12-31', 100000)`,
        [RESTAURANT_ID, d.code, d.desc, d.type, d.value, d.first],
      );
      if (r.affectedRows) count("discount codes");
    }

    await conn.commit();

    const entries = Object.entries(added);
    console.log(
      entries.length
        ? "Added: " + entries.map(([k, v]) => `${v} ${k}`).join(", ")
        : "Nothing to add. Everything already exists.",
    );
  } catch (err) {
    await conn.rollback();
    console.error(
      "Seed failed, nothing was saved:",
      err.sqlMessage || err.message,
    );
    if (err.code === "ER_NO_SUCH_TABLE")
      console.error(
        "Start the server once first so config/database.js creates the tables.",
      );
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
}

main();
