const express = require('express');
const controller = require('../controllers/kitchenController');
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

router.use(verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.KITCHEN));

router.get('/performance', validate({ query: rangeQuery }), controller.performance);
router.get(
  '/reports/:type',
  validate({ params: { type: { type: 'string', lowercase: true, in: ['output', 'speed', 'wastage', 'demand'], required: true } }, query: rangeQuery }),
  controller.report
);

module.exports = router;
