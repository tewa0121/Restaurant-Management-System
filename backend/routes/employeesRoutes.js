const express = require('express');
const controller = require('../controllers/employeeController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const { validate, idParam } = require('../utils/validate');
const { paginationQuery } = require('../utils/pagination');
const { ROLES, STAFF_ROLES, SHIFT_ROLES, ATTENDANCE_STATUSES } = require('../utils/constants');

const router = express.Router();
const managers = [ROLES.ADMIN, ROLES.MANAGER];

const employeeFields = {
  name: { type: 'string', minLength: 2, maxLength: 100, label: 'Name' },
  fullName: { type: 'string', minLength: 2, maxLength: 100, label: 'Full name' },
  firstName: { type: 'string', minLength: 1, maxLength: 50, label: 'First name' },
  lastName: { type: 'string', maxLength: 50, label: 'Last name' },
  position: { type: 'string', maxLength: 50, label: 'Position' },
  role: { type: 'string', maxLength: 50, label: 'Role' },
  department: { type: 'string', maxLength: 50, label: 'Department' },
  hireDate: { type: 'date', label: 'Hire date' },
  salary: { type: 'number', min: 0, max: 99999999, strip: /[^0-9.\-]/g, label: 'Salary' },
  phone: { type: 'string', maxLength: 20, label: 'Phone' },
  email: { type: 'email', label: 'Email' },
  address: { type: 'string', maxLength: 500, label: 'Address' },
  emergencyContact: { type: 'string', maxLength: 100, label: 'Emergency contact' },
  photoUrl: { type: 'string', maxLength: 255, label: 'Photo URL' },
  status: { type: 'string', lowercase: true, in: ['active', 'inactive'], label: 'Status' },
  isActive: { type: 'boolean', label: 'Active flag' },
};

const dateRange = {
  from: { type: 'date', label: 'From' },
  to: { type: 'date', label: 'To' },
};

const shiftIdParam = { shiftId: { type: 'integer', required: true, min: 1 } };

router.use(verifyToken);

router.get('/me', authorize(STAFF_ROLES), controller.me);
router.get('/me/shifts', authorize(STAFF_ROLES), validate({ query: dateRange }), controller.myShifts);

router.get(
  '/shifts',
  authorize(managers),
  validate({
    query: { employeeId: { type: 'integer', min: 1 }, date: { type: 'date' }, ...dateRange },
  }),
  controller.listShifts
);
router.delete('/shifts/:shiftId', authorize(managers), validate({ params: shiftIdParam }), controller.removeShift);

router.get(
  '/',
  authorize(managers),
  validate({
    query: {
      search: { type: 'string', maxLength: 100 },
      position: { type: 'string', maxLength: 50 },
      department: { type: 'string', maxLength: 50 },
      status: { type: 'string', lowercase: true, in: ['active', 'inactive'] },
      shiftStatus: { type: 'string', lowercase: true, in: ['active', 'off_duty'] },
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
      ...employeeFields,
      createLogin: { type: 'boolean', default: false },
      loginRole: { type: 'string', maxLength: 50, label: 'Login role' },
      password: { type: 'string', trim: false, minLength: 6, maxLength: 128, label: 'Password' },
    },
  }),
  controller.create
);

router.get('/:id', authorize(managers), validate({ params: idParam }), controller.get);
router.put('/:id', authorize(managers), validate({ params: idParam, body: employeeFields }), controller.update);
router.patch(
  '/:id/status',
  authorize(managers),
  validate({ params: idParam, body: { status: employeeFields.status, isActive: employeeFields.isActive } }),
  controller.update
);
router.delete('/:id', authorize(managers), validate({ params: idParam }), controller.remove);

router.get('/:id/attendance', authorize(managers), validate({ params: idParam, query: dateRange }), controller.listAttendance);
router.put(
  '/:id/attendance',
  authorize(managers),
  validate({
    params: idParam,
    body: {
      date: { type: 'date', label: 'Date' },
      checkIn: { type: 'time', label: 'Check-in' },
      checkOut: { type: 'time', label: 'Check-out' },
      status: { type: 'string', lowercase: true, in: ATTENDANCE_STATUSES, default: 'present', label: 'Status' },
      notes: { type: 'string', maxLength: 1000, label: 'Notes' },
    },
  }),
  controller.recordAttendance
);

router.post(
  '/:id/shifts',
  authorize(managers),
  validate({
    params: idParam,
    body: {
      shiftDate: { type: 'date', required: true, label: 'Shift date' },
      startTime: { type: 'time', required: true, label: 'Start time' },
      endTime: { type: 'time', required: true, label: 'End time' },
      role: { type: 'string', lowercase: true, in: SHIFT_ROLES, label: 'Shift role' },
    },
  }),
  controller.createShift
);

router.get('/:id/reviews', authorize(managers), validate({ params: idParam }), controller.listReviews);
router.post(
  '/:id/reviews',
  authorize(managers),
  validate({
    params: idParam,
    body: {
      reviewDate: { type: 'date', label: 'Review date' },
      rating: { type: 'integer', required: true, min: 1, max: 5, label: 'Rating' },
      comments: { type: 'string', maxLength: 2000, label: 'Comments' },
    },
  }),
  controller.addReview
);

module.exports = router;