const DashboardService = require('../services/dashboardService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');

exports.admin = asyncHandler(async (req, res) => ok(res, await DashboardService.admin(req.user)));
exports.manager = asyncHandler(async (req, res) => ok(res, await DashboardService.manager(req.user)));
exports.cashier = asyncHandler(async (req, res) => ok(res, await DashboardService.cashier(req.user)));
exports.kitchen = asyncHandler(async (req, res) => ok(res, await DashboardService.kitchen(req.user)));
exports.waiter = asyncHandler(async (req, res) => ok(res, await DashboardService.waiter(req.user)));
exports.customer = asyncHandler(async (req, res) => ok(res, await DashboardService.customerPortal(req.user)));