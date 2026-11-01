// ============================================================================
// routes/tableRoutes.js   LAYER 1 of 5  -  the DOOR LIST
// ----------------------------------------------------------------------------
// A route file answers three questions for every URL:
//   - which HTTP method + path?
//   - who is allowed in?        (middleware, run in the order they are written)
//   - which controller handles it?
// ============================================================================
const router = require("express").Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { allowRoles } = require("../middleware/roleMiddleware");
const tableController = require("../controllers/tableController");

// verifyToken runs first for EVERY route below: no valid token -> 401, request stops here.
// If the token is fine, it sets req.user and calls next().
router.use(verifyToken);

// allowRoles(...) runs second: wrong role -> 403. Admin always passes.
// Then, and only then, the controller runs.

// Everyone who works the floor can LOOK at tables
router.get(
  "/",
  allowRoles("waiter", "manager", "cashier"),
  tableController.list,
);
router.get(
  "/:id",
  allowRoles("waiter", "manager", "cashier"),
  tableController.getOne,
);

// Waiters change status during service (seat guests, mark cleaning...)
router.patch(
  "/:id/status",
  allowRoles("waiter", "manager", "cashier"),
  tableController.updateStatus,
);

// Only management changes the floor plan
router.post("/", allowRoles("manager"), tableController.create);
router.put("/:id", allowRoles("manager"), tableController.update);
router.delete("/:id", allowRoles("manager"), tableController.remove);

module.exports = router;
