const express = require('express');
const controller = require('../controllers/discountController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, STAFF_ROLES, DISCOUNT_TYPES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];
const money = { type: 'number', min: 0, max: 99999999, strip: /[^0-9.\-]/g };

const discountFields = {
  code: { type: 'string', minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9_-]+$/, patternMessage: 'Code may only contain letters, numbers, dashes and underscores', label: 'Code' },
  description: { type: 'string', maxLength: 1000, label: 'Description' },
  discountType: { type: 'string', lowercase: true, in: DISCOUNT_TYPES, label: 'Discount type' },
  value: { ...money, label: 'Value' },
  minOrderAmount: { ...money, label: 'Minimum order' },
  firstOrderOnly: { type: 'boolean', label: 'First order only' },
  startDate: { type: 'date', label: 'Start date' },
  endDate: { type: 'date', label: 'End date' },
  usageLimit: { type: 'integer', min: 0, max: 1000000, label: 'Usage limit' },
  isActive: { type: 'boolean', label: 'Active flag' },
};

router.use(verifyToken);

router.post(
  '/validate',
  authorize([...STAFF_ROLES, ROLES.CUSTOMER]),
  validate({
    body: {
      code: { type: 'string', required: true, maxLength: 50, label: 'Promo code' },
      subtotal: { ...money, required: true, label: 'Subtotal' },
      customerId: { type: 'integer', min: 1, label: 'Customer' },
    },
  }),
  controller.validate
);

router.get(
  '/',
  authorize(managers),
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      active: { type: 'boolean' },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.post(
  '/',
  authorize(managers),
  validate({
    body: {
      ...discountFields,
      code: { ...discountFields.code, required: true },
      discountType: { ...discountFields.discountType, required: true },
      value: { ...discountFields.value, required: true },
      startDate: { ...discountFields.startDate, required: true },
      endDate: { ...discountFields.endDate, required: true },
    },
  }),
  controller.create
);

router.get('/:id', authorize(managers), validate({ params: idParam }), controller.get);
router.put('/:id', authorize(managers), validate({ params: idParam, body: discountFields }), controller.update);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);

module.exports = router;