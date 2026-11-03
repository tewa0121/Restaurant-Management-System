const express = require('express');
const controller = require('../controllers/reportController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate } = require('../utils/validate');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const rangeQuery = {
  from: { type: 'date', label: 'From' },
  to: { type: 'date', label: 'To' },
  format: { type: 'string', lowercase: true, in: ['json', 'csv'], default: 'json', label: 'Format' },
};

router.use(verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER));

router.get('/summary', validate({ query: rangeQuery }), controller.summary);
router.get('/sales', validate({ query: { ...rangeQuery, groupBy: { type: 'string', lowercase: true, in: ['day', 'month'], default: 'day' } } }), controller.sales);
router.get('/payment-methods', validate({ query: rangeQuery }), controller.paymentMethods);
router.get('/categories', validate({ query: rangeQuery }), controller.categories);
router.get('/top-items', validate({ query: { ...rangeQuery, limit: { type: 'integer', min: 1, max: 100, default: 10 } } }), controller.topItems);
router.get('/staff', validate({ query: rangeQuery }), controller.staff);
router.get('/inventory', validate({ query: rangeQuery }), controller.inventory);

module.exports = router;