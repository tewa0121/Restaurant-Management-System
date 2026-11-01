// ============================================================================
// routes/authRoutes.js  -  the doors of the AUTH module
// ----------------------------------------------------------------------------
// server.js mounts routes/index.js at /api, and index.js mounts this file at
// /auth, so the final URLs are:
//
//   POST /api/auth/login      public   -> returns { success, token, user }
//   POST /api/auth/register   public   -> creates a CUSTOMER, returns { success, token, user }
//   GET  /api/auth/me         login    -> returns the logged-in user
//
// "public" means NO middleware: a person without a token must be able to reach it,
// otherwise nobody could ever log in.
// ============================================================================
const router = require("express").Router();
const authController = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/login", authController.login);
router.post("/register", authController.register);

// verifyToken sits BEFORE the controller: no valid token -> 401 and the controller never runs.
router.get("/me",  authController.getMe);

module.exports = router;
