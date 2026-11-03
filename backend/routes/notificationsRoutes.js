const express = require('express');
const controller = require('../controllers/notificationController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, NOTIFICATION_TYPES } = require('../utils/constants');

const router = express.Router();

router.use(verifyToken);

router.get(
  '/',
  validate({
    query: {
      unread: { type: 'boolean', default: false },
      type: { type: 'string', lowercase: true, in: NOTIFICATION_TYPES },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/unread-count', controller.unreadCount);
router.post('/read-all', controller.markAllRead);
router.delete('/read', controller.clearRead);

router.post(
  '/',
  authorize(ROLES.ADMIN, ROLES.MANAGER),
  validate({
    body: {
      title: { type: 'string', required: true, minLength: 2, maxLength: 100, label: 'Title' },
      message: { type: 'string', required: true, minLength: 2, maxLength: 2000, label: 'Message' },
      type: { type: 'string', lowercase: true, in: NOTIFICATION_TYPES, default: 'system', label: 'Type' },
      roles: { type: 'array', items: { type: 'string', maxLength: 50 }, maxItems: 6, label: 'Roles' },
      userIds: { type: 'array', items: { type: 'integer', min: 1 }, maxItems: 200, label: 'Users' },
    },
  }),
  controller.broadcast
);

router.patch('/:id/read', validate({ params: idParam }), controller.markRead);
router.delete('/:id', validate({ params: idParam }), controller.remove);

module.exports = router;