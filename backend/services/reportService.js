const ReportModel = require('../models/reportModel');
const DashboardModel = require('../models/dashboardModel');
const AppError = require('../utils/AppError');
const { dayString, round2 } = require('../utils/format');
const { titleCase } = require('../utils/enums');
const InvoiceService = require('./invoiceService');

function resolveRange({ from, to }) {
  const end = to || dayString(0);
  const start = from || dayString(-29);
  if (start > end) throw new AppError('The start date cannot be after the end date.', 422, 'VALIDATION_ERROR');
  const days = Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);
  if (days > 730) throw new AppError('The date range cannot be longer than two years.', 422, 'VALIDATION_ERROR');
  return { from: start, to: end };
}

const sumRows = (rows) => round2(rows.reduce((sum, row) => sum + Number(row.total), 0));

const ReportService = {
  async summary(query) {
    const range = resolveRange(query);
    const [orders, newCustomers, reservations, payments, refunds] = await Promise.all([
      ReportModel.orderTotals(range.from, range.to),
      ReportModel.newCustomers(range.from, range.to),
      ReportModel.reservationTotals(range.from, range.to),
      DashboardModel.revenueByDay(range.from, range.to),
      DashboardModel.refundsByDay(range.from, range.to),
    ]);

    const totalOrders = Number(orders.total) - Number(orders.cancelled);
    const completed = Number(orders.completed);
    const sales = round2(Number(orders.sales));
    const collected = sumRows(payments);
    const refunded = sumRows(refunds);
    const reservationCounts = {};
    reservations.forEach((row) => {
      reservationCounts[row.status] = Number(row.total);
    });

    return {
      ...range,
      orders: totalOrders,
      completedOrders: completed,
      cancelledOrders: Number(orders.cancelled),
      sales,
      tax: round2(Number(orders.tax)),
      discounts: round2(Number(orders.discount)),
      averageOrderValue: completed ? round2(sales / completed) : 0,
      collected,
      refunded,
      netRevenue: round2(collected - refunded),
      newCustomers,
      reservations: Object.values(reservationCounts).reduce((sum, count) => sum + count, 0),
      reservationsByStatus: reservationCounts,
    };
  },

  async sales(query) {
    const range = resolveRange(query);
    const groupBy = query.groupBy || 'day';
    const rows = await ReportModel.sales(range.from, range.to, groupBy);
    return {
      ...range,
      groupBy,
      rows: rows.map((row) => {
        const completed = Number(row.completed_orders);
        const sales = round2(Number(row.sales));
        return {
          period: row.period,
          orders: Number(row.orders),
          completedOrders: completed,
          subtotal: round2(Number(row.subtotal)),
          discount: round2(Number(row.discount)),
          tax: round2(Number(row.tax)),
          sales,
          averageOrderValue: completed ? round2(sales / completed) : 0,
        };
      }),
    };
  },

  async paymentMethods(query) {
    const range = resolveRange(query);
    const rows = await DashboardModel.paymentMethods(range.from, range.to);
    const total = sumRows(rows);
    return {
      ...range,
      total,
      rows: rows.map((row) => ({
        method: row.payment_method,
        label: InvoiceService.PAYMENT_LABELS[row.payment_method] || titleCase(row.payment_method),
        payments: Number(row.count),
        total: round2(Number(row.total)),
        share: total ? round2((Number(row.total) / total) * 100) : 0,
      })),
    };
  },

  async categories(query) {
    const range = resolveRange(query);
    const rows = await DashboardModel.categorySales(range.from, range.to);
    const total = sumRows(rows);
    return {
      ...range,
      total,
      rows: rows.map((row) => ({
        category: row.name,
        revenue: round2(Number(row.total)),
        share: total ? round2((Number(row.total) / total) * 100) : 0,
      })),
    };
  },

  async topItems(query) {
    const range = resolveRange(query);
    const rows = await ReportModel.topItems(range.from, range.to, query.limit || 10);
    return {
      ...range,
      rows: rows.map((row, index) => ({
        rank: index + 1,
        id: row.id,
        name: row.name,
        category: row.category,
        quantity: Number(row.quantity),
        revenue: round2(Number(row.revenue)),
      })),
    };
  },

  async staff(query) {
    const range = resolveRange(query);
    const rows = await ReportModel.staff(range.from, range.to);
    return {
      ...range,
      rows: rows.map((row) => {
        const completed = Number(row.completed_orders);
        const sales = round2(Number(row.sales));
        return {
          id: row.id,
          name: row.name && row.name.trim() ? row.name.trim() : null,
          position: row.position,
          orders: Number(row.orders),
          completedOrders: completed,
          sales,
          averageOrderValue: completed ? round2(sales / completed) : 0,
        };
      }),
    };
  },

  async inventory(query) {
    const range = resolveRange(query);
    const rows = await ReportModel.inventory(range.from, range.to);
    return {
      ...range,
      rows: rows.map((row) => ({
        id: row.id,
        ingredient: row.name,
        unit: row.unit,
        used: round2(Number(row.used)),
        purchased: round2(Number(row.purchased)),
        returned: round2(Number(row.returned)),
        currentStock: Number(row.current_stock),
        minStockLevel: Number(row.min_stock_level),
        low: Number(row.current_stock) <= Number(row.min_stock_level),
      })),
    };
  },
};

module.exports = ReportService;