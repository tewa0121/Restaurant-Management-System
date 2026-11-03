const express = require('express');
const controller = require('../controllers/refundController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const billingStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER];
const managers = [ROLES.ADMIN, ROLES.MANAGER];

router.use(verifyToken);

router.post(
  '/',
  authorize(billingStaff),
  validate({
    body: {
      paymentId: { type: 'integer', required: true, min: 1, label: 'Payment' },
      amount: { type: 'number', min: 0.01, max: 99999999, strip: /[^0-9.\-]/g, label: 'Amount' },
      reason: { type: 'string', required: true, minLength: 3, maxLength: 255, label: 'Reason' },
    },
  }),
  controller.request
);

router.get(
  '/',
  authorize(billingStaff),
  validate({
    query: {
      status: { type: 'string', maxLength: 20 },
      mine: { type: 'boolean', default: false },
      invoiceId: { type: 'integer', min: 1 },
      paymentId: { type: 'integer', min: 1 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/:id', authorize(billingStaff), validate({ params: idParam }), controller.get);
router.patch('/:id/approve', authorize(managers), validate({ params: idParam }), controller.approve);
router.patch('/:id/reject', authorize(managers), validate({ params: idParam }), controller.reject);

module.exports = router;