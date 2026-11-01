const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/database");
const userModel = require("../models/userModel");

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      restaurant_id: user.restaurant_id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" },
  );

const publicUser = (user) => ({
  id: user.id,
  name: user.full_name,
  email: user.email,
  phone: user.phone || null,
  role: user.role,
  avatar: user.avatar_url || null,
});

exports.authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Please provide email and password.");
  }

  const user = await userModel.findUserByEmail(
    String(email).trim().toLowerCase(),
  );

  // Same message for "no such user" and "wrong password" so accounts cannot be guessed
  if (!user || !user.password_hash) {
    throw new Error("Invalid email or password.");
  }

  if (!user.is_active) {
    throw new Error("This account has been deactivated.");
  }

  // Real check against the bcrypt hash stored in users.password_hash
  const isMatch = await bcrypt.compare(String(password), user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password.");
  }

  // Frontend and middleware use lowercase roles: admin, manager, waiter, cashier, kitchen, customer
  const role = String(user.role || "")
    .trim()
    .toLowerCase();
  if (!role) {
    throw new Error(
      "No role is assigned to this account. Contact an administrator.",
    );
  }
  const authUser = { ...user, role };

  const token = signToken(authUser);
  await userModel.updateLastLogin(user.id);

  return { token, user: publicUser(authUser) };
};

// Public sign-up: always creates a CUSTOMER account (users + user_roles + customers) in one transaction
exports.registerCustomer = async ({ fullName, email, phone, password }) => {
  if (!fullName || !email || !phone || !password) {
    throw new Error("Full name, email, phone and password are required.");
  }
  if (String(password).length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const existing = await userModel.findUserByEmail(cleanEmail);
  if (existing) {
    const err = new Error("An account with this email already exists.");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const username = `${cleanEmail.split("@")[0]}_${Date.now().toString().slice(-4)}`;
  const [firstName, ...rest] = String(fullName).trim().split(/\s+/);

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [u] = await conn.execute(
      `INSERT INTO users (restaurant_id, username, email, password_hash, full_name, phone)
       VALUES (1, ?, ?, ?, ?, ?)`,
      [
        username,
        cleanEmail,
        passwordHash,
        String(fullName).trim(),
        String(phone).trim(),
      ],
    );
    await conn.execute(
      'INSERT INTO user_roles (user_id, role_id) SELECT ?, id FROM roles WHERE name = "Customer"',
      [u.insertId],
    );
    await conn.execute(
      "INSERT INTO customers (user_id, first_name, last_name, email, phone) VALUES (?, ?, ?, ?, ?)",
      [
        u.insertId,
        firstName,
        rest.join(" ") || "-",
        cleanEmail,
        String(phone).trim(),
      ],
    );

    await conn.commit();

    const authUser = {
      id: u.insertId,
      restaurant_id: 1,
      email: cleanEmail,
      full_name: String(fullName).trim(),
      phone: String(phone).trim(),
      role: "customer",
    };
    return { token: signToken(authUser), user: publicUser(authUser) };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getUserProfile = async (userId) => {
  const user = await userModel.findUserById(userId);
  if (!user) {
    throw new Error("User not found.");
  }
  return user;
};
