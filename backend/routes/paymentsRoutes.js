const express = require('express');
const controller = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const billingStaff = [ROLES.ADMIN, ROLES.MANAGER, ROLES.CASHIER];
const money = { type: 'number', min: 0, max: 99999999, strip: /[^0-9.\-]/g };

router.use(verifyToken);

router.post(
  '/',
  authorize(billingStaff),
  validate({
    body: {
      invoiceId: { type: 'integer', required: true, min: 1, label: 'Invoice' },
      method: { type: 'string', required: true, maxLength: 30, label: 'Payment method' },
      amount: { ...money, label: 'Amount' },
      tendered: { ...money, label: 'Cash tendered' },
      transactionId: { type: 'string', maxLength: 100, label: 'Transaction reference' },
    },
  }),
  controller.pay
);

router.get(
  '/',
  authorize(billingStaff),
  validate({
    query: {
      invoiceId: { type: 'integer', min: 1 },
      method: { type: 'string', maxLength: 30 },
      status: { type: 'string', maxLength: 20 },
      mine: { type: 'boolean', default: false },
      date: { type: 'date' },
      from: { type: 'date' },
      to: { type: 'date' },
      search: { type: 'string', maxLength: 100 },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/:id', authorize(billingStaff), validate({ params: idParam }), controller.get);

module.exports = router;