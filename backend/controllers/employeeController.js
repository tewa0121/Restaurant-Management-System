
const EmployeeService = require('../services/employeeService');

const getActor = (req) => req.user;

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

// GET /me
exports.me = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const employee = await EmployeeService.getMine(actor.id);

  res.status(200).json({ success: true, employee });
});

// GET /me/shifts
exports.myShifts = asyncHandler(async (req, res) => {
  const actor = getActor(req);
  const shifts = await EmployeeService.listMyShifts(actor.id, req.query);

  res.status(200).json({ success: true, shifts });
});

// GET /shifts
exports.listShifts = asyncHandler(async (req, res) => {
  const shifts = await EmployeeService.listShifts(req.query);

  res.status(200).json({ success: true, shifts });
});

// DELETE /shifts/:shiftId
exports.removeShift = asyncHandler(async (req, res) => {
  const result = await EmployeeService.removeShift(
    Number(req.params.shiftId),
    getActor(req)
  );

  res.status(200).json({ success: true, ...result });
});

// GET /
exports.list = asyncHandler(async (req, res) => {
  const result = await EmployeeService.list(req.query);

  res.status(200).json({
    success: true,
    employees: result.rows,
    pagination: result.pagination,
  });
});

// POST /
exports.create = asyncHandler(async (req, res) => {
  const result = await EmployeeService.create(req.body, getActor(req));

  res.status(201).json({
    success: true,
    ...result,
  });
});

// GET /:id
exports.get = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.get(Number(req.params.id));

  res.status(200).json({ success: true, employee });
});

// PUT /:id and PATCH /:id/status
exports.update = asyncHandler(async (req, res) => {
  const employee = await EmployeeService.update(
    Number(req.params.id),
    req.body,
    getActor(req)
  );

  res.status(200).json({ success: true, employee });
});

// DELETE /:id
exports.remove = asyncHandler(async (req, res) => {
  const result = await EmployeeService.remove(
    Number(req.params.id),
    getActor(req)
  );

  res.status(200).json({ success: true, ...result });
});

// GET /:id/attendance
exports.listAttendance = asyncHandler(async (req, res) => {
  const attendance = await EmployeeService.listAttendance(
    Number(req.params.id),
    req.query
  );

  res.status(200).json({ success: true, attendance });
});

// PUT /:id/attendance
exports.recordAttendance = asyncHandler(async (req, res) => {
  const attendance = await EmployeeService.recordAttendance(
    Number(req.params.id),
    req.body,
    getActor(req)
  );

  res.status(200).json({ success: true, attendance });
});

// POST /:id/shifts
exports.createShift = asyncHandler(async (req, res) => {
  const shift = await EmployeeService.createShift(
    Number(req.params.id),
    req.body,
    getActor(req)
  );

  res.status(201).json({ success: true, shift });
});

// GET /:id/reviews
exports.listReviews = asyncHandler(async (req, res) => {
  const reviews = await EmployeeService.listReviews(Number(req.params.id));

  res.status(200).json({ success: true, reviews });
});

// POST /:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const review = await EmployeeService.addReview(
    Number(req.params.id),
    req.body,
    getActor(req)
  );

  res.status(201).json({ success: true, review });
});
