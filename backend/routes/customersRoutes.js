const express = require('express');
const controller = require('../controllers/customerController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();
const frontDesk = [ROLES.ADMIN, ROLES.MANAGER, ROLES.WAITER, ROLES.CASHIER];
const managers = [ROLES.ADMIN, ROLES.MANAGER];

const customerFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  fullName: { type: 'string', minLength: 2, maxLength: 100, label: 'Full name' },
  firstName: { type: 'string', minLength: 1, maxLength: 50, label: 'First name' },
  lastName: { type: 'string', maxLength: 50, label: 'Last name' },
  email: { type: 'email', label: 'Email' },
  phone: { type: 'string', maxLength: 20, label: 'Phone' },
  status: { type: 'string', lowercase: true, in: ['vip', 'regular', 'new'], label: 'Status' },
  isVip: { type: 'boolean', label: 'VIP flag' },
};

const addressFields = {
  label: { type: 'string', maxLength: 50, label: 'Label' },
  addressLine: { type: 'string', maxLength: 500, label: 'Address' },
  city: { type: 'string', maxLength: 100, label: 'City' },
  phone: { type: 'string', maxLength: 20, label: 'Phone' },
  isDefault: { type: 'boolean', label: 'Default flag' },
};

router.use(verifyToken);

router.get('/me', authorize(ROLES.CUSTOMER), controller.me);
router.get('/me/addresses', authorize(ROLES.CUSTOMER), controller.listAddresses);
router.post(
  '/me/addresses',
  authorize(ROLES.CUSTOMER),
  validate({
    body: {
      ...addressFields,
      label: { ...addressFields.label, required: true },
      addressLine: { ...addressFields.addressLine, required: true },
    },
  }),
  controller.createAddress
);
router.put('/me/addresses/:id', authorize(ROLES.CUSTOMER), validate({ params: idParam, body: addressFields }), controller.updateAddress);
router.delete('/me/addresses/:id', authorize(ROLES.CUSTOMER), validate({ params: idParam }), controller.removeAddress);

router.get(
  '/',
  authorize(frontDesk),
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      status: { type: 'string', lowercase: true, in: ['vip', 'regular', 'new'] },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.post('/', authorize(frontDesk), validate({ body: customerFields }), controller.create);

router.get('/:id', authorize(frontDesk), validate({ params: idParam }), controller.get);
router.put('/:id', authorize(managers), validate({ params: idParam, body: customerFields }), controller.update);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);
router.patch(
  '/:id/loyalty',
  authorize(managers),
  validate({
    params: idParam,
    body: {
      points: { type: 'integer', required: true, min: -100000, max: 100000, label: 'Points' },
      reason: { type: 'string', maxLength: 200, label: 'Reason' },
    },
  }),
  controller.adjustLoyalty
);

module.exports = router;