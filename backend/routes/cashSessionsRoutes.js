const express = require('express');
const controller = require('../controllers/cashSessionController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const billingStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER];
const money = { type: 'number', min: 0, max: 99999999, strip: /[^0-9.\-]/g };

router.use(verifyToken, authorize(billingStaff));

router.post(
  '/open',
  validate({
    body: {
      openingAmount: { ...money, default: 0, label: 'Opening amount' },
      notes: { type: 'string', maxLength: 1000, label: 'Notes' },
    },
  }),
  controller.open
);

router.get('/current', controller.current);

router.get(
  '/',
  validate({ query: { open: { type: 'boolean' }, ...paginationQuery } }),
  controller.list
);

router.get('/:id', validate({ params: idParam }), controller.get);

router.post(
  '/:id/close',
  validate({
    params: idParam,
    body: {
      countedAmount: { ...money, required: true, label: 'Counted amount' },
      notes: { type: 'string', maxLength: 1000, label: 'Notes' },
    },
  }),
  controller.close
);

module.exports = router;