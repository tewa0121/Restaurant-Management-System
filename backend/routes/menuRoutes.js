// ============================================================================
// routes/menuRoutes.js   -  LAYER 1: the doors of the MENU module
// ----------------------------------------------------------------------------
// Mounted in routes/index.js with:   router.use('/menu', require('./menuRoutes'));
//
// ORDER MATTERS. Express checks routes top to bottom and uses the FIRST match.
// "/:id" matches ANY single word, so if it came first, the URL /menu/categories
// would be read as "dish number 'categories'". That is why the fixed words
// (/categories, /manage) are written BEFORE /:id.
//
// Public routes have no middleware (customers browse without logging in).
// Protected routes: verifyToken (who are you?) -> allowRoles (are you allowed?) -> controller.
// Admin always passes allowRoles.
// ============================================================================
const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const menu = require("../controllers/menuController");

// ---------- PUBLIC ----------
router.get("/", menu.list);
router.get("/categories", menu.listCategories);

// ---------- fixed words BEFORE /:id ----------
router.get(
  "/manage",
  verifyToken,
  allowRoles("manager", "kitchen"),
  menu.listAll,
);
router.post(
  "/categories",
  verifyToken,
  allowRoles("manager"),
  menu.createCategory,
);
router.put(
  "/categories/:id",
  verifyToken,
  allowRoles("manager"),
  menu.updateCategory,
);
router.delete(
  "/categories/:id",
  verifyToken,
  allowRoles("manager"),
  menu.removeCategory,
);

// ---------- one dish ----------
router.get("/:id", menu.getOne); // PUBLIC
router.post("/", verifyToken, allowRoles("manager"), menu.create);
router.put("/:id", verifyToken, allowRoles("manager"), menu.update);
router.patch(
  "/:id/availability",
  verifyToken,
  allowRoles("manager", "kitchen"),
  menu.setAvailability,
); // the kitchen can mark "sold out"
router.delete("/:id", verifyToken, allowRoles("manager"), menu.remove);

module.exports = router;
