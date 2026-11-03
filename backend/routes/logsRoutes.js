const express = require('express');
const controller = require('../controllers/logController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(verifyToken, authorize(ROLES.ADMIN, ROLES.MANAGER));

router.get('/types', controller.types);

router.get(
  '/',
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      userId: { type: 'integer', min: 1 },
      activityType: { type: 'string', maxLength: 50 },
      entityType: { type: 'string', maxLength: 50 },
      from: { type: 'date' },
      to: { type: 'date' },
      ...paginationQuery,
    },
  }),
  controller.list
);

router.get('/:id', validate({ params: idParam }), controller.get);

module.exports = router;