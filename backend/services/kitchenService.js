const KitchenModel = require('../models/kitchenModel');
const AppError = require('../utils/AppError');
const { dayString, hourLabel, round2 } = require('../utils/format');
const { kitchenTargetMinutes } = require('../config/business');

function resolveRange({ from, to }, defaultDays = 7) {
  const end = to || dayString(0);
  const start = from || dayString(-(defaultDays - 1));
  if (start > end) throw new AppError('The start date cannot be after the end date.', 422, 'VALIDATION_ERROR');
  const days = Math.round((new Date(`${end}T00:00:00`) - new Date(`${start}T00:00:00`)) / 86400000);
  if (days > 366) throw new AppError('The date range cannot be longer than one year.', 422, 'VALIDATION_ERROR');
  return { from: start, to: end };
}

const avg = (value) => (value === null || value === undefined ? null : round2(value));
const pct = (part, whole) => (whole ? Math.round((Number(part) / Number(whole)) * 1000) / 10 : null);

const KitchenService = {
  async performance(query) {
    const range = resolveRange(query, 7);
    const [daily, byCategory, hourly] = await Promise.all([
      KitchenModel.dailyOutput(range.from, range.to, kitchenTargetMinutes),
      KitchenModel.speedByCategory(range.from, range.to, kitchenTargetMinutes),
      KitchenModel.hourlyOutput(range.from, range.to),
    ]);

    const completed = daily.reduce((sum, row) => sum + Number(row.orders), 0);
    const dishes = daily.reduce((sum, row) => sum + Number(row.dishes), 0);
    const onTime = daily.reduce((sum, row) => sum + Number(row.on_time), 0);
    const weighted = daily.reduce((sum, row) => sum + Number(row.avg_minutes) * Number(row.orders), 0);
    const peak = hourly.reduce((best, row) => (!best || Number(row.orders) > Number(best.orders) ? row : best), null);

    return {
      ...range,
      targetMinutes: kitchenTargetMinutes,
      summary: {
        completedOrders: completed,
        dishesPrepared: dishes,
        avgPrepMinutes: completed ? round2(weighted / completed) : null,
        onTimeRate: pct(onTime, completed),
        delayedOrders: completed - onTime,
        peakHour: peak ? hourLabel(Number(peak.hour)) : null,
      },
      daily: daily.map((row) => ({
        day: row.day,
        orders: Number(row.orders),
        dishes: Number(row.dishes),
        avgPrepMinutes: avg(row.avg_minutes),
        onTimeRate: pct(row.on_time, row.orders),
      })),
      byCategory: byCategory.map((row) => ({
        category: row.category,
        orders: Number(row.orders),
        avgPrepMinutes: avg(row.avg_minutes),
        slowestMinutes: Number(row.slowest_minutes),
        onTimeRate: pct(row.on_time, row.orders),
      })),
      byHour: hourly.map((row) => ({ hour: hourLabel(Number(row.hour)), orders: Number(row.orders) })),
    };
  },

  // The four printable kitchen reports. Every report returns { rows, summary }.
  async report(type, query) {
    const range = resolveRange(query, 7);

    if (type === 'output') {
      const [daily, hourly] = await Promise.all([
        KitchenModel.dailyOutput(range.from, range.to, kitchenTargetMinutes),
        KitchenModel.hourlyOutput(range.from, range.to),
      ]);
      const peak = hourly.reduce((best, row) => (!best || Number(row.orders) > Number(best.orders) ? row : best), null);
      return {
        ...range,
        title: 'Daily Kitchen Output Summary',
        summary: {
          totalOrders: daily.reduce((sum, row) => sum + Number(row.orders), 0),
          totalDishes: daily.reduce((sum, row) => sum + Number(row.dishes), 0),
          peakHour: peak ? hourLabel(Number(peak.hour)) : '-',
        },
        rows: daily.map((row) => ({
          day: row.day,
          orders: Number(row.orders),
          dishes: Number(row.dishes),
          avgPrepMinutes: avg(row.avg_minutes),
          onTimeRate: pct(row.on_time, row.orders),
        })),
      };
    }

    if (type === 'speed') {
      const rows = await KitchenModel.speedByCategory(range.from, range.to, kitchenTargetMinutes);
      return {
        ...range,
        title: 'Preparation Speed by Category',
        summary: { targetMinutes: kitchenTargetMinutes, categories: rows.length },
        rows: rows.map((row) => ({
          category: row.category,
          orders: Number(row.orders),
          avgPrepMinutes: avg(row.avg_minutes),
          slowestMinutes: Number(row.slowest_minutes),
          onTimeRate: pct(row.on_time, row.orders),
        })),
      };
    }

    if (type === 'wastage') {
      const rows = await KitchenModel.wastage(range.from, range.to);
      return {
        ...range,
        title: 'Kitchen Wastage & Write-offs',
        summary: { ingredients: rows.length, entries: rows.reduce((sum, row) => sum + Number(row.entries), 0) },
        rows: rows.map((row) => ({
          ingredient: row.ingredient,
          unit: row.unit,
          entries: Number(row.entries),
          quantity: round2(row.quantity),
          lastAt: row.last_at,
          lastNote: row.last_note || '',
        })),
      };
    }

    if (type === 'demand') {
      const rows = await KitchenModel.demand(range.from, range.to, 50);
      const total = rows.reduce((sum, row) => sum + Number(row.quantity), 0);
      return {
        ...range,
        title: 'Recipe Demand Trends',
        summary: { dishes: total, items: rows.length },
        rows: rows.map((row, index) => ({
          rank: index + 1,
          name: row.name,
          category: row.category,
          quantity: Number(row.quantity),
          orders: Number(row.orders),
          share: pct(row.quantity, total),
        })),
      };
    }

    throw new AppError('Unknown kitchen report.', 404, 'NOT_FOUND');
  },
};

module.exports = KitchenService;
