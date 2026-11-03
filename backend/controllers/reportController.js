const ReportService = require('../services/reportService');
const asyncHandler = require('../utils/asyncHandler');
const { toCsv } = require('../utils/csv');

const COLUMNS = {
  sales: [
    { key: 'period', label: 'Period' },
    { key: 'orders', label: 'Orders' },
    { key: 'completedOrders', label: 'Completed orders' },
    { key: 'subtotal', label: 'Subtotal' },
    { key: 'discount', label: 'Discounts' },
    { key: 'tax', label: 'Tax' },
    { key: 'sales', label: 'Sales' },
    { key: 'averageOrderValue', label: 'Average order' },
  ],
  'payment-methods': [
    { key: 'label', label: 'Method' },
    { key: 'payments', label: 'Payments' },
    { key: 'total', label: 'Total' },
    { key: 'share', label: 'Share %' },
  ],
  categories: [
    { key: 'category', label: 'Category' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'share', label: 'Share %' },
  ],
  'top-items': [
    { key: 'rank', label: 'Rank' },
    { key: 'name', label: 'Item' },
    { key: 'category', label: 'Category' },
    { key: 'quantity', label: 'Quantity sold' },
    { key: 'revenue', label: 'Revenue' },
  ],
  staff: [
    { key: 'name', label: 'Employee' },
    { key: 'position', label: 'Position' },
    { key: 'orders', label: 'Orders' },
    { key: 'completedOrders', label: 'Completed orders' },
    { key: 'sales', label: 'Sales' },
    { key: 'averageOrderValue', label: 'Average order' },
  ],
  inventory: [
    { key: 'ingredient', label: 'Ingredient' },
    { key: 'unit', label: 'Unit' },
    { key: 'used', label: 'Used' },
    { key: 'purchased', label: 'Purchased' },
    { key: 'returned', label: 'Returned' },
    { key: 'currentStock', label: 'Current stock' },
    { key: 'minStockLevel', label: 'Minimum stock' },
  ],
};

function send(req, res, name, report) {
  if (req.query.format === 'csv') {
    const rows = name === 'summary'
      ? Object.entries(report)
          .filter(([, value]) => typeof value !== 'object')
          .map(([key, value]) => ({ metric: key, value }))
      : report.rows;
    const columns = name === 'summary' ? [{ key: 'metric', label: 'Metric' }, { key: 'value', label: 'Value' }] : COLUMNS[name];
    res.set('Content-Type', 'text/csv; charset=utf-8');
    res.set('Content-Disposition', `attachment; filename="${name}-${report.from}-to-${report.to}.csv"`);
    return res.status(200).send(toCsv(columns, rows));
  }
  return res.status(200).json({ success: true, data: report });
}

const handler = (name, loader) =>
  asyncHandler(async (req, res) => {
    send(req, res, name, await ReportService[loader](req.query));
  });

exports.summary = handler('summary', 'summary');
exports.sales = handler('sales', 'sales');
exports.paymentMethods = handler('payment-methods', 'paymentMethods');
exports.categories = handler('categories', 'categories');
exports.topItems = handler('top-items', 'topItems');
exports.staff = handler('staff', 'staff');
exports.inventory = handler('inventory', 'inventory');