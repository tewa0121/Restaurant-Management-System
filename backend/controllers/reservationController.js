const ReservationService = require('../services/reservationService');
const asyncHandler = require('../utils/asyncHandler');
const { ok, list } = require('../utils/response');

exports.list = asyncHandler(async (req, res) => {
  const { rows, pagination } = await ReservationService.list(req.query);
  list(res, rows, pagination);
});

exports.mine = asyncHandler(async (req, res) => {
  const { rows, pagination } = await ReservationService.listMine(req.user, req.query);
  list(res, rows, pagination);
});

exports.get = asyncHandler(async (req, res) => {
  ok(res, await ReservationService.get(req.params.id, req.user));
});

exports.create = asyncHandler(async (req, res) => {
  ok(res, await ReservationService.create(req.body, req.user), { message: 'Reservation created successfully.' }, 201);
});

exports.update = asyncHandler(async (req, res) => {
  ok(res, await ReservationService.update(req.params.id, req.body, req.user), { message: 'Reservation updated successfully.' });
});

exports.setStatus = asyncHandler(async (req, res) => {
  ok(res, await ReservationService.setStatus(req.params.id, req.body, req.user), { message: 'Reservation status updated.' });
});

exports.cancelMine = asyncHandler(async (req, res) => {
  ok(res, await ReservationService.cancelMine(req.params.id, req.user), { message: 'Reservation cancelled.' });
});

exports.remove = asyncHandler(async (req, res) => {
  const result = await ReservationService.remove(req.params.id, req.user);
  res.status(200).json({ success: true, ...result });
});