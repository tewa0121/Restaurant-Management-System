const express = require('express');
const controller = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();

const accountFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  fullName: { type: 'string', minLength: 2, maxLength: 100, label: 'Full name' },
  phone: { type: 'string', maxLength: 20, label: 'Phone' },
  role: { type: 'string', maxLength: 50, label: 'Role' },
  roles: { type: 'array', items: { type: 'string', maxLength: 50 }, maxItems: 6, label: 'Roles' },
  status: { type: 'string', lowercase: true, in: ['active', 'inactive'], label: 'Status' },
  isActive: { type: 'boolean', label: 'Active flag' },
  language: { type: 'string', minLength: 2, maxLength: 2, lowercase: true, label: 'Language' },
  avatarUrl: { type: 'string', maxLength: 255, label: 'Avatar URL' },
};

router.use(verifyToken);

router.get(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      role: { type: 'string', maxLength: 50 },
      status: { type: 'string', lowercase: true, in: ['active', 'inactive'] },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/:id', authorize(ROLES.ADMIN, ROLES.MANAGER), validate({ params: idParam }), controller.get);

router.post(
  '/',
  authorize(ROLES.ADMIN),
  validate({
    body: {
      ...accountFields,
      email: { type: 'email', required: true, label: 'Email' },
      username: { type: 'string', minLength: 3, maxLength: 50, pattern: /^[a-zA-Z0-9._-]+$/, label: 'Username' },
      password: { type: 'string', trim: false, minLength: 6, maxLength: 128, label: 'Password' },
    },
  }),
  controller.create
);

router.put(
  '/:id',
  authorize(ROLES.ADMIN),
  validate({ params: idParam, body: { ...accountFields, email: { type: 'email', label: 'Email' } } }),
  controller.update
);

router.patch(
  '/:id/status',
  authorize(ROLES.ADMIN),
  validate({
    params: idParam,
    body: {
      status: accountFields.status,
      isActive: accountFields.isActive,
    },
  }),
  controller.setStatus
);

router.put(
  '/:id/password',
  authorize(ROLES.ADMIN),
  validate({
    params: idParam,
    body: { password: { type: 'string', required: true, trim: false, minLength: 6, maxLength: 128, label: 'Password' } },
  }),
  controller.resetPassword
);

router.delete('/:id', authorize(ROLES.ADMIN), validate({ params: idParam }), controller.remove);

module.exports = router;