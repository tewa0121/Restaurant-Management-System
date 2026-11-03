const DashboardModel = require('../models/dashboardModel');
const SettingsModel = require('../models/settingsModel');
const NotificationModel = require('../models/notificationModel');
const CustomerRequestModel = require('../models/customerRequestModel');
const EmployeeModel = require('../models/employeeModel');
const CustomerModel = require('../models/customerModel');
const LogModel = require('../models/logModel');
const TableModel = require('../models/tableModel');
const MenuService = require('./menuService');
const SettingsService = require('./settingsService');
const { dayString, weekdayShort, clock, hourLabel, timeAgo, number, money, change, round2, toDate } = require('../utils/format');
const { titleCase } = require('../utils/enums');
const { kitchenTargetMinutes } = require('../config/business');
const { ROLES } = require('../utils/constants');

const FILLS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6'];
const MANAGER_FILLS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

const currencyCode = async () => (await SettingsModel.get('currency')) || 'ETB';

async function netRevenueByDay(from, to) {
  const [payments, refunds] = await Promise.all([DashboardModel.revenueByDay(from, to), DashboardModel.refundsByDay(from, to)]);
  const net = new Map();
  const gross = new Map();
  payments.forEach((row) => {
    net.set(row.day, Number(row.total));
    gross.set(row.day, Number(row.total));
  });
  refunds.forEach((row) => net.set(row.day, (net.get(row.day) || 0) - Number(row.total)));
  return { net, gross };
}

const sumDays = (map, from, to) => {
  let total = 0;
  map.forEach((value, day) => {
    if (day >= from && day <= to) total += value;
  });
  return round2(total);
};

const lastDays = (count) => Array.from({ length: count }, (_, index) => dayString(index - (count - 1)));

function salesOverview(net) {
  return lastDays(7).map((day) => ({ name: weekdayShort(day), date: day, sales: round2(net.get(day) || 0) }));
}

function categoryShare(rows, fills) {
  const total = rows.reduce((sum, row) => sum + Number(row.total), 0);
  if (!total) return [];
  const top = rows.slice(0, 4);
  const others = rows.slice(4).reduce((sum, row) => sum + Number(row.total), 0);
  const items = top.map((row) => ({ name: row.name, amount: round2(Number(row.total)), value: Math.round((Number(row.total) / total) * 100) }));
  if (others > 0) items.push({ name: 'Others', amount: round2(others), value: Math.round((others / total) * 100) });
  return items.map((item, index) => ({ ...item, fill: fills[index % fills.length] }));
}

const tableLabel = (row) => {
  if (row.table_numbers) return row.table_numbers.includes(',') ? `Tables ${row.table_numbers}` : `Table ${row.table_numbers}`;
  return titleCase(row.order_type || 'order');
};

const mapOrder = (row) => ({
  id: row.order_number,
  customer: row.customer_name && row.customer_name.trim() ? row.customer_name.trim() : 'Walk-in',
  table: tableLabel(row),
  items: Number(row.item_count),
  amount: Number(row.total_amount),
  status: titleCase(row.status),
  time: clock(row.ordered_at),
  type: row.order_type,
});

const clockFromTime = (value) => {
  const [hours, minutes] = String(value).split(':').map(Number);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 === 0 ? 12 : hours % 12}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

const minutesSince = (value) => Math.max(0, Math.floor((Date.now() - toDate(value).getTime()) / 60000));

const NOTIFICATION_COLORS = { payment: 'green', order: 'purple', reservation: 'blue', inventory: 'orange', system: 'red' };

async function ownNotifications(user, limit) {
  const rows = await NotificationModel.list({ userId: user.id }, { limit, offset: 0 });
  return rows.map((row) => ({
    message: row.message,
    title: row.title,
    time: timeAgo(row.created_at),
    color: NOTIFICATION_COLORS[row.type] || 'purple',
    isRead: Boolean(row.is_read),
  }));
}

const activityType = (type) => {
  if (['auth', 'user', 'role', 'employee', 'customer'].includes(type)) return 'user';
  if (['order', 'delivery', 'request', 'table', 'reservation'].includes(type)) return 'order';
  if (['billing', 'discount'].includes(type)) return 'payment';
  if (['inventory', 'purchase', 'supplier'].includes(type)) return 'alert';
  return 'info';
};

const paymentGroup = (method) => {
  if (method === 'cash') return 'Cash';
  if (method === 'card') return 'Card';
  if (['mobile_banking', 'telebirr', 'cbe_birr'].includes(method)) return 'Mobile Banking';
  return 'Other';
};
const PAYMENT_COLORS = { Cash: '#10B981', Card: '#3B82F6', 'Mobile Banking': '#F59E0B', Other: '#8B5CF6' };

function bucketHours(rows, size, labelCount) {
  const byHour = new Map(rows.map((row) => [Number(row.hour), Number(row.total)]));
  const buckets = [];
  for (let start = 0; start < 24 && buckets.length < labelCount; start += size) {
    let total = 0;
    for (let hour = start; hour < start + size; hour += 1) total += byHour.get(hour) || 0;
    buckets.push({ label: hourLabel(start), total: round2(total) });
  }
  return buckets;
}

const CATEGORY_ICONS = [
  [/breakfast/i, '🍳'],
  [/lunch/i, '🍲'],
  [/dinner/i, '🍽️'],
  [/appetizer|starter/i, '🍟'],
  [/drink|beverage|juice/i, '🥤'],
  [/dessert|cake|sweet/i, '🍰'],
  [/salad/i, '🥗'],
  [/pizza/i, '🍕'],
  [/burger/i, '🍔'],
  [/pasta/i, '🍝'],
];
const iconFor = (name) => (CATEGORY_ICONS.find(([pattern]) => pattern.test(name)) || [null, '🍽️'])[1];

const DashboardService = {
  async admin() {
    const cur = await currencyCode();
    const today = dayString(0);
    const yesterday = dayString(-1);
    const [{ net }, orders30, ordersPrev30, tables, customers, pending, lowStockCount, recent, system, lowStock, logs, categories, sizeMb] =
      await Promise.all([
        netRevenueByDay(dayString(-13), today),
        DashboardModel.countOrders(dayString(-29), today),
        DashboardModel.countOrders(dayString(-59), dayString(-30)),
        DashboardModel.tableStatusCounts(),
        DashboardModel.customerCounts(dayString(-29)),
        DashboardModel.countOrdersByStatus(['pending']),
        DashboardModel.lowStockCount(),
        DashboardModel.orderList({ limit: 5 }),
        DashboardModel.systemCounts(),
        DashboardModel.lowStock(5),
        LogModel.list({}, { limit: 5, offset: 0 }),
        DashboardModel.categorySales(dayString(-6), today),
        DashboardModel.databaseSizeMb(),
      ]);

    const todayRevenue = round2(net.get(today) || 0);
    const yesterdayRevenue = round2(net.get(yesterday) || 0);
    const totalTables = Object.values(tables).reduce((sum, count) => sum + count, 0);
    const weekTotal = sumDays(net, dayString(-6), today);

    return {
      stats: {
        totalOrders: { value: number(orders30), raw: orders30, ...change(orders30, ordersPrev30), period: 'last 30 days' },
        todayRevenue: { value: money(todayRevenue, cur), raw: todayRevenue, ...change(todayRevenue, yesterdayRevenue) },
        availableTables: { value: String(tables.available || 0), raw: tables.available || 0, change: '', trend: 'neutral', total: totalTables },
        totalCustomers: {
          value: number(customers.total),
          raw: customers.total,
          change: customers.recent ? `+${customers.recent}` : '',
          trend: customers.recent ? 'up' : 'neutral',
        },
        pendingOrders: { value: String(pending.pending || 0), raw: pending.pending || 0, change: '', trend: 'neutral' },
        inventoryAlerts: { value: String(lowStockCount), raw: lowStockCount, change: '', trend: lowStockCount ? 'down' : 'neutral' },
      },
      salesOverview: salesOverview(net),
      revenueByCategory: categoryShare(categories, FILLS),
      revenueTotal: money(weekTotal, cur),
      revenuePeriod: 'last 7 days',
      currency: cur,
      recentOrders: recent.map(mapOrder),
      systemOverview: {
        totalUsers: system.users,
        totalRestaurants: system.restaurants,
        systemStatus: 'Operational',
        storageUsage: null,
        databaseSizeMb: sizeMb,
        activeSessions: system.sessions,
      },
      inventoryAlerts: lowStock.map((row) => ({
        item: row.name,
        status: Number(row.current_stock) <= 0 ? 'Out of Stock' : 'Low Stock',
        quantity: `${Number(row.current_stock)} ${row.unit} left`,
        icon: row.image_url,
      })),
      systemActivity: logs.rows.map((row) => ({
        title: row.action,
        desc: row.user_name && row.user_name.trim() ? row.user_name.trim() : 'System',
        time: timeAgo(row.created_at),
        type: activityType(row.activity_type),
      })),
    };
  },

  async manager(user) {
    const cur = await currencyCode();
    const today = dayString(0);
    const yesterday = dayString(-1);
    const [{ net }, ordersToday, ordersYesterday, tables, active, reservations, reservationsYesterday, lowStockCount, categories, pendingOrders, recent, lowStock, notes] =
      await Promise.all([
        netRevenueByDay(dayString(-27), today),
        DashboardModel.countOrders(today, today),
        DashboardModel.countOrders(yesterday, yesterday),
        DashboardModel.tableStatusCounts(),
        DashboardModel.countOrdersByStatus(['pending', 'preparing']),
        DashboardModel.reservationsToday(today),
        DashboardModel.reservationCount(yesterday),
        DashboardModel.lowStockCount(),
        DashboardModel.categorySales(dayString(-6), today),
        DashboardModel.orderList({ statuses: ['pending', 'preparing'], limit: 5 }),
        DashboardModel.orderList({ limit: 5 }),
        DashboardModel.lowStock(5),
        ownNotifications(user, 4),
      ]);

    const todayRevenue = round2(net.get(today) || 0);
    const totalTables = Object.values(tables).reduce((sum, count) => sum + count, 0);
    const pendingCount = (active.pending || 0) + (active.preparing || 0);
    const reservationCount = reservations.length;

    const monthly = [4, 3, 2, 1].map((weeksAgo, index) => {
      const to = dayString(-7 * (weeksAgo - 1));
      const from = dayString(-7 * weeksAgo + 1);
      return { name: `Week ${index + 1}`, from, to, sales: sumDays(net, from, to) };
    });

    const statusRows = [
      ['available', 'Available', 'green'],
      ['occupied', 'Occupied', 'orange'],
      ['reserved', 'Reserved', 'blue'],
      ['cleaning', 'Cleaning', 'purple'],
      ['out_of_order', 'Out of Order', 'red'],
    ];

    return {
      stats: {
        totalOrders: { value: number(ordersToday), raw: ordersToday, ...change(ordersToday, ordersYesterday), period: 'today' },
        todayRevenue: { value: money(todayRevenue, cur), raw: todayRevenue, ...change(todayRevenue, net.get(yesterday) || 0) },
        availableTables: { value: `${tables.available || 0} / ${totalTables}`, raw: tables.available || 0, total: totalTables, change: '', trend: 'neutral' },
        pendingOrders: { value: String(pendingCount), raw: pendingCount, change: '', trend: 'neutral' },
        reservationsToday: { value: String(reservationCount), raw: reservationCount, ...change(reservationCount, reservationsYesterday) },
        lowStockItems: { value: String(lowStockCount), raw: lowStockCount, change: '', trend: lowStockCount ? 'down' : 'neutral' },
      },
      salesOverview: salesOverview(net),
      revenueByCategory: categoryShare(categories, MANAGER_FILLS),
      revenueTotal: money(sumDays(net, dayString(-6), today), cur),
      revenuePeriod: 'last 7 days',
      currency: cur,
      monthlyPerformance: monthly,
      pendingOrders: pendingOrders.map((row) => ({
        id: row.order_number,
        table: tableLabel(row),
        items: Number(row.item_count),
        status: titleCase(row.status),
        time: clock(row.ordered_at),
      })),
      todayReservations: reservations.map((row) => ({
        id: row.id,
        time: clockFromTime(row.reservation_time),
        table: `Table ${row.table_number}`,
        guests: row.guest_count,
        status: titleCase(row.status),
      })),
      tableStatus: statusRows.map(([key, label, color]) => ({ status: label, count: tables[key] || 0, color })),
      recentOrders: recent.map(mapOrder),
      lowStockItems: lowStock.map((row) => ({ item: row.name, quantity: `${Number(row.current_stock)} ${row.unit} left`, icon: row.image_url })),
      notifications: notes,
    };
  },

  async cashier(user) {
    const cur = await currencyCode();
    const today = dayString(0);
    const yesterday = dayString(-1);
    const [{ net, gross }, byMethod, byHour, invoicesToday, invoicesYesterday, refundsToday, refundsYesterday, recent, pending, notes] =
      await Promise.all([
        netRevenueByDay(yesterday, today),
        DashboardModel.paymentMethods(today, today),
        DashboardModel.paymentsByHour(today),
        DashboardModel.invoiceStats(today),
        DashboardModel.invoiceStats(yesterday),
        DashboardModel.refundsTotal(today, today),
        DashboardModel.refundsTotal(yesterday, yesterday),
        DashboardModel.recentInvoices(5),
        DashboardModel.pendingInvoices(5),
        ownNotifications(user, 4),
      ]);

    const revenue = round2(net.get(today) || 0);
    const received = round2(gross.get(today) || 0);
    const avgToday = invoicesToday.count ? invoicesToday.total / invoicesToday.count : 0;
    const avgYesterday = invoicesYesterday.count ? invoicesYesterday.total / invoicesYesterday.count : 0;

    const grouped = new Map();
    byMethod.forEach((row) => {
      const name = paymentGroup(row.payment_method);
      grouped.set(name, (grouped.get(name) || 0) + Number(row.total));
    });
    const methodTotal = [...grouped.values()].reduce((sum, value) => sum + value, 0);

    return {
      stats: {
        todayRevenue: { value: money(revenue, cur), raw: revenue, ...change(revenue, net.get(yesterday) || 0) },
        totalBills: { value: number(invoicesToday.count), raw: invoicesToday.count, ...change(invoicesToday.count, invoicesYesterday.count) },
        avgBillValue: { value: money(avgToday, cur), raw: round2(avgToday), ...change(avgToday, avgYesterday) },
        paymentsReceived: { value: money(received, cur), raw: received, ...change(received, gross.get(yesterday) || 0) },
        refunds: { value: money(refundsToday, cur), raw: refundsToday, ...change(refundsToday, refundsYesterday) },
        pendingPayments: { value: String(invoicesToday.pending), raw: invoicesToday.pending, change: '', trend: 'neutral' },
      },
      currency: cur,
      revenueOverview: bucketHours(byHour, 4, 6).map((bucket) => ({ name: bucket.label, value: bucket.total })),
      paymentMethods: [...grouped.entries()].map(([name, amount]) => ({
        name,
        value: methodTotal ? Math.round((amount / methodTotal) * 100) : 0,
        amount: round2(amount),
        color: PAYMENT_COLORS[name],
      })),
      paymentBreakdown: byMethod.map((row) => ({ method: row.payment_method, amount: round2(Number(row.total)), count: Number(row.count) })),
      totalReceived: money(received, cur),
      recentBills: recent.map((row) => ({
        id: row.invoice_number,
        table: tableLabel(row),
        customer: row.customer_name && row.customer_name.trim() ? row.customer_name.trim() : 'Walk-in',
        amount: Number(row.total),
        method: row.last_method ? titleCase(row.last_method) : '-',
        status: row.status === 'paid' ? 'Paid' : row.status === 'refunded' ? 'Refunded' : 'Pending',
        time: clock(row.generated_at),
      })),
      pendingPayments: pending.map((row) => ({
        id: row.invoice_number,
        table: tableLabel(row),
        amount: Number(row.balance),
        time: timeAgo(row.generated_at),
      })),
      salesByHour: bucketHours(byHour, 3, 8).map((bucket) => ({ hour: bucket.label, sales: bucket.total })),
      notifications: notes,
    };
  },

  async kitchen() {
    const today = dayString(0);
    const [counts, finished, pendingRows, preparingRows, readyRows, low, ordersToday] = await Promise.all([
      DashboardModel.countOrdersByStatus(['pending', 'preparing', 'ready']),
      DashboardModel.kitchenFinishedToday(today),
      DashboardModel.orderList({ statuses: ['pending'], limit: 50 }),
      DashboardModel.orderList({ statuses: ['preparing'], limit: 50 }),
      DashboardModel.orderList({ statuses: ['ready'], limit: 50 }),
      DashboardModel.lowStock(3),
      DashboardModel.countOrders(today, today),
    ]);

    const timed = finished.filter((row) => row.prep_minutes !== null && row.prep_minutes !== undefined);
    const avgPrep = timed.length ? Math.round(timed.reduce((sum, row) => sum + Number(row.prep_minutes), 0) / timed.length) : null;
    const onTime = timed.filter((row) => Number(row.prep_minutes) <= kitchenTargetMinutes).length;
    const efficiency = timed.length ? Math.round((onTime / timed.length) * 100) : null;
    const efficiencyLabel = efficiency === null ? 'No data yet' : efficiency >= 90 ? 'Excellent' : efficiency >= 75 ? 'Good' : 'Needs Improvement';
    const efficiencyColor = efficiency === null ? 'blue' : efficiency >= 90 ? 'green' : efficiency >= 75 ? 'orange' : 'red';

    const incoming = [...pendingRows].reverse();
    const priorityOf = (row) => {
      const waited = minutesSince(row.ordered_at);
      if (Number(row.priority) > 0 || waited >= 15) return 'High';
      return waited >= 8 ? 'Medium' : 'Low';
    };

    const details = await DashboardModel.orderItemsDetail(preparingRows.slice(0, 5).map((row) => row.id));
    const inProgress = preparingRows.slice(0, 5).map((row) => {
      const items = details.filter((item) => Number(item.order_id) === Number(row.id));
      const progress = items.length
        ? Math.round(items.reduce((sum, item) => sum + (item.item_status === 'ready' ? 100 : Number(item.preparation_progress)), 0) / items.length)
        : 0;
      const current = items.find((item) => item.item_status !== 'ready') || items[items.length - 1];
      return {
        id: row.order_number,
        table: tableLabel(row),
        items: Number(row.item_count),
        started: clock(row.cooking_started_at || row.ordered_at),
        stage: current ? current.category_name : 'Preparing',
        progress,
      };
    });

    const detail = (row) => `${tableLabel(row)} • ${Number(row.item_count)} items`;
    const overview = (rows, mapTime) => ({
      count: rows.length,
      items: rows.slice(0, 3).map((row) => ({ id: row.order_number, detail: detail(row), time: mapTime(row) })),
    });

    const alerts = low.map((row) => ({
      type: 'alert',
      title: `Low stock: ${row.name}`,
      detail: `Only ${Number(row.current_stock)} ${row.unit} left`,
      time: '',
    }));
    incoming
      .filter((row) => minutesSince(row.ordered_at) >= 15)
      .slice(0, 2)
      .forEach((row) => {
        alerts.push({
          type: 'warning',
          title: `Order #${row.order_number} is waiting`,
          detail: `for ${minutesSince(row.ordered_at)} minutes`,
          time: timeAgo(row.ordered_at),
        });
      });
    if (pendingRows[0]) {
      alerts.push({
        type: 'info',
        title: 'New order received',
        detail: `Order #${pendingRows[0].order_number} (${tableLabel(pendingRows[0])})`,
        time: timeAgo(pendingRows[0].ordered_at),
      });
    }

    const delayed =
      timed.filter((row) => Number(row.prep_minutes) > kitchenTargetMinutes).length +
      [...pendingRows, ...preparingRows].filter((row) => minutesSince(row.ordered_at) >= kitchenTargetMinutes).length;

    return {
      stats: {
        newOrders: { value: String(counts.pending || 0), sub: 'Needs Attention', color: 'red' },
        inProgress: { value: String(counts.preparing || 0), sub: 'Being Prepared', color: 'orange' },
        readyToServe: { value: String(counts.ready || 0), sub: 'Waiting to be served', color: 'green' },
        completedToday: { value: String(finished.length), sub: 'Orders', color: 'blue' },
        avgPrepTime: { value: avgPrep === null ? '-' : `${avgPrep} min`, sub: 'Per Order', color: 'purple' },
        efficiency: { value: efficiency === null ? '-' : `${efficiency}%`, sub: efficiencyLabel, color: efficiencyColor },
      },
      targetMinutes: kitchenTargetMinutes,
      incomingOrders: incoming.slice(0, 5).map((row) => ({
        id: row.order_number,
        table: tableLabel(row),
        items: Number(row.item_count),
        time: clock(row.ordered_at),
        priority: priorityOf(row),
      })),
      orderStatusOverview: {
        new: overview(incoming, (row) => clock(row.ordered_at)),
        inProgress: overview(preparingRows, (row) => `Started ${clock(row.cooking_started_at || row.ordered_at)}`),
        ready: overview(readyRows, (row) => `Ready ${clock(row.cooking_finished_at)}`),
        completed: {
          count: finished.length,
          items: finished.slice(0, 3).map((row) => ({ id: row.order_number, detail: detail(row), time: clock(row.cooking_finished_at) })),
        },
      },
      inProgressOrders: inProgress,
      kitchenAlerts: alerts.slice(0, 6),
      todaySummary: {
        totalOrders: ordersToday,
        completedOrders: finished.length,
        avgPrepTime: avgPrep === null ? '-' : `${avgPrep} min`,
        readyToServe: counts.ready || 0,
        efficiency: efficiency === null ? '-' : `${efficiency}%`,
        ordersDelayed: delayed,
      },
      recentCompleted: finished.slice(0, 6).map((row) => ({
        id: row.order_number,
        table: tableLabel(row),
        items: Number(row.item_count),
        time: clock(row.cooking_finished_at),
      })),
    };
  },

  async waiter(user) {
    const cur = await currencyCode();
    const today = dayString(0);
    const employee = await EmployeeModel.findByUserId(user.id);
    const waiterId = user.roles.includes(ROLES.WAITER) && employee ? employee.id : undefined;

    const allTables = await TableModel.list({});
    const mine = waiterId ? await TableModel.list({ waiterEmployeeId: waiterId }) : allTables;
    const activeOrders = await DashboardModel.activeOrderPerTable(allTables.map((table) => table.id));
    const latestByTable = new Map();
    activeOrders.forEach((order) => latestByTable.set(Number(order.table_id), order));

    const [counts, recent, requests, summary, notes] = await Promise.all([
      DashboardModel.countOrdersByStatus(['pending', 'preparing', 'ready', 'served'], { waiterId }),
      DashboardModel.orderList({ waiterId, limit: 5 }),
      CustomerRequestModel.list({ statuses: ['new', 'in_progress'], waiterEmployeeId: waiterId }, { limit: 5, offset: 0 }),
      waiterId ? DashboardModel.waiterToday(waiterId, today) : DashboardModel.waiterToday(null, today),
      ownNotifications(user, 3),
    ]);

    const tableStatus = (table) => {
      const order = latestByTable.get(Number(table.id));
      if (!order) return 'Seated';
      return { pending: 'Ordering', preparing: 'Food Preparing', ready: 'Ready to Serve', served: 'Served' }[order.status];
    };
    const floorStatus = (table) => {
      if (table.status !== 'occupied') return table.status;
      const order = latestByTable.get(Number(table.id));
      return order ? order.status === 'pending' ? 'ordering' : order.status : 'occupied';
    };

    const occupied = mine.filter((table) => table.status === 'occupied');
    const newRequests = requests.filter((row) => row.status === 'new').length;
    const orderStatus = {
      pending: counts.pending || 0,
      preparing: counts.preparing || 0,
      ready: counts.ready || 0,
      served: counts.served || 0,
    };
    orderStatus.total = orderStatus.pending + orderStatus.preparing + orderStatus.ready + orderStatus.served;
    const avgMinutes = summary && summary.avg_minutes !== null && summary.avg_minutes !== undefined ? Math.round(Number(summary.avg_minutes)) : null;

    return {
      stats: {
        activeTables: { value: String(occupied.length), sub: `of ${mine.length} Assigned` },
        activeOrders: { value: String(orderStatus.pending + orderStatus.preparing + orderStatus.ready), sub: 'In Progress' },
        readyToServe: { value: String(orderStatus.ready), sub: 'Orders' },
        completedOrders: { value: String(summary ? Number(summary.served) : 0), sub: 'Today' },
        newRequests: { value: String(newRequests), sub: 'From Tables' },
      },
      myTables: occupied.map((table) => {
        const order = latestByTable.get(Number(table.id));
        return {
          id: table.id,
          table: `Table ${table.table_number}`,
          guests: Number(table.guests || 0),
          status: tableStatus(table),
          lastOrder: order ? clock(order.ordered_at) : '',
        };
      }),
      orderStatus,
      recentOrders: recent.map((row) => ({
        id: row.order_number,
        table: tableLabel(row),
        items: Number(row.item_count),
        status: titleCase(row.status),
        time: clock(row.ordered_at),
      })),
      customerRequests: requests.map((row) => ({
        id: row.id,
        table: `Table ${row.table_number}`,
        request: row.request_text,
        time: timeAgo(row.created_at),
        status: titleCase(row.status),
      })),
      todaySummary: {
        ordersTaken: summary ? Number(summary.taken) : 0,
        ordersServed: summary ? Number(summary.served) : 0,
        avgOrderTime: avgMinutes === null ? '-' : `${avgMinutes} min`,
        revenue: money(summary ? summary.revenue : 0, cur),
      },
      floorOverview: allTables.map((table) => ({ table: table.table_number, status: floorStatus(table) })),
      notifications: notes.map((note) => ({ message: note.message, time: note.time })),
    };
  },

  async customerPortal(user) {
    const customer = user && user.roles.includes(ROLES.CUSTOMER) ? await CustomerModel.findByUserId(user.id) : null;
    const [categories, popular, favorites, restaurant] = await Promise.all([
      MenuService.listCategories({ includeInactive: false }, null),
      DashboardModel.popularItems(dayString(-29), 12),
      customer ? DashboardModel.favoriteIds(customer.id) : Promise.resolve(new Set()),
      SettingsService.getPublic(),
    ]);

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: iconFor(category.name),
        itemCount: category.itemCount,
      })),
      popularDishes: popular.map((row) => ({
        ...MenuService.toItemDto(row),
        rating: row.rating === null || row.rating === undefined ? null : Math.round(Number(row.rating) * 10) / 10,
        reviews: Number(row.reviews),
        orders: Number(row.orders_count),
        isFavorite: favorites.has(Number(row.id)),
      })),
      restaurant,
    };
  },
};

module.exports = DashboardService;