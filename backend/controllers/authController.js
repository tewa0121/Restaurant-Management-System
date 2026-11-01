const authService = require("../services/authService");

// Messages thrown by authService that are the user's fault (not server errors)
const CLIENT_ERRORS = [
  ["Please provide", 400],
  ["required", 400],
  ["at least 6", 400],
  ["Invalid email", 401],
  ["deactivated", 403],
  ["No role is assigned", 403],
  ["already exists", 409],
];

const statusFor = (err) => {
  if (err.status) return err.status;
  const match = CLIENT_ERRORS.find(([text]) =>
    String(err.message).includes(text),
  );
  return match ? match[1] : null;
};

// Sends a clean error for user mistakes, passes real server errors to errorHandler
const handleError = (err, res, next) => {
  const status = statusFor(err);
  if (status)
    return res.status(status).json({ success: false, message: err.message });
  return next(err);
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.authenticateUser(email, password);
    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return handleError(err, res, next);
  }
};

// Public customer sign-up. Staff accounts are created by an admin, never from here.
exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;
    const result = await authService.registerCustomer({
      fullName,
      email,
      phone,
      password,
    });
    return res.status(201).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return handleError(err, res, next);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserProfile(req.user.id);

    // Never send password_hash (or any other private column) to the browser
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        name: user.full_name || user.name,
        email: user.email,
        phone: user.phone || null,
        role: String(user.role || req.user.role || "").toLowerCase(),
        avatar: user.avatar_url || null,
      },
    });
  } catch (err) {
    if (String(err.message).includes("User not found")) {
      return res.status(404).json({ success: false, message: err.message });
    }
    return next(err);
  }
};
