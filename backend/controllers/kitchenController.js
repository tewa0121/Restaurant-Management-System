const KitchenService = require('../services/kitchenService');
const asyncHandler = require('../utils/asyncHandler');
const { ok } = require('../utils/response');
const { toCsv } = require('../utils/csv');

const COLUMNS = {
  output: [
    { key: 'day', label: 'Day' },
    { key: 'orders', label: 'Orders' },
    { key: 'dishes', label: 'Dishes prepared' },
    { key: 'avgPrepMinutes', label: 'Avg prep (min)' },
    { key: 'onTimeRate', label: 'On time %' },
  ],
  speed: [
    { key: 'category', label: 'Category' },
    { key: 'orders', label: 'Orders' },
    { key: 'avgPrepMinutes', label: 'Avg prep (min)' },
    { key: 'slowestMinutes', label: 'Slowest (min)' },
    { key: 'onTimeRate', label: 'On time %' },
  ],
  wastage: [
    { key: 'ingredient', label: 'Ingredient' },
    { key: 'unit', label: 'Unit' },
    { key: 'entries', label: 'Entries' },
    { key: 'quantity', label: 'Quantity written off' },
    { key: 'lastAt', label: 'Last entry' },
    { key: 'lastNote', label: 'Last note' },
  ],
  demand: [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Item' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'orders', label: 'Orders' },
    { key: 'share', label: 'Share %' },
  ],
};

exports.performance = asyncHandler(async (req, res) => ok(res, await KitchenService.performance(req.query)));

exports.report = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const report = await KitchenService.report(type, req.query);
  if (req.query.format === 'csv') {
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="kitchen-${type}-${report.from}-to-${report.to}.csv"`);
    return res.status(200).send(toCsv(COLUMNS[type], report.rows));
  }
  return ok(res, report);
});
