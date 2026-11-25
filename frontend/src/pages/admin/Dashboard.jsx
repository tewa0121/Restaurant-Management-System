import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  ShoppingBag,
  DollarSign,
  Utensils,
  Users,
  Clock,
  AlertTriangle,
  UserPlus,
  ConciergeBell,
  FilePlus,
  CalendarPlus,
  BarChart3,
  Package,
  CreditCard,
  BellRing,
  Settings,
  RefreshCw,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import { formatCurrency } from '../../utils/formatters';

const toDisplayText = (val, fallback = '') => {
  if (val === null || val === undefined) return fallback;
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  if (typeof val === 'object') {
    if (val.value !== undefined && typeof val.value !== 'object') return String(val.value);
    if (val.raw !== undefined && typeof val.raw !== 'object') return String(val.raw);
    if (val.total !== undefined && typeof val.total !== 'object') return String(val.total);
    if (val.change !== undefined && typeof val.change !== 'object') return String(val.change);
    return fallback;
  }
  return fallback;
};

const toChangeText = (val) => {
  if (!val) return '';
  if (typeof val === 'string' || typeof val === 'number') return String(val);
  if (typeof val === 'object') {
    if (val.change !== undefined && val.change !== null) return String(val.change);
    if (val.trend !== undefined && val.trend !== null) return String(val.trend);
  }
  return '';
};

const toPeriodText = (val, fallback = 'vs yesterday') => {
  if (typeof val === 'object' && val !== null && val.period) {
    return String(val.period);
  }
  return fallback;
};

const DEFAULT_CARDS = [
  { key: 'totalOrders', label: 'Total Orders', value: '0', change: '', period: 'vs yesterday', color: 'text-indigo-600', bg: 'bg-indigo-50', icon: ShoppingBag },
  { key: 'todayRevenue', label: "Today's Revenue", value: '$0.00', change: '', period: 'vs yesterday', color: 'text-emerald-600', bg: 'bg-emerald-50', icon: DollarSign },
  { key: 'availableTables', label: 'Available Tables', value: '0', change: '', period: 'vs yesterday', color: 'text-sky-600', bg: 'bg-sky-50', icon: Utensils },
  { key: 'totalCustomers', label: 'Total Customers', value: '0', change: '', period: 'vs yesterday', color: 'text-amber-600', bg: 'bg-amber-50', icon: Users },
  { key: 'pendingOrders', label: 'Pending Orders', value: '0', change: '', period: 'vs yesterday', color: 'text-orange-600', bg: 'bg-orange-50', icon: Clock },
  { key: 'inventoryAlerts', label: 'Inventory Alerts', value: '0', change: '', period: 'low stock items', color: 'text-rose-600', bg: 'bg-rose-50', icon: AlertTriangle },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [systemOverview, setSystemOverview] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    storageUsage: '0%',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await dashboardService.getAdminDashboard();
      const kpis = data?.kpis || data?.stats || data || {};

      const mappedCards = DEFAULT_CARDS.map((card) => {
        const rawMetric = kpis[card.key] ?? data[card.key];
        const displayVal = rawMetric !== undefined ? toDisplayText(rawMetric, card.value) : card.value;
        const changeVal = rawMetric !== undefined ? toChangeText(rawMetric) : card.change;
        const periodVal = rawMetric !== undefined ? toPeriodText(rawMetric, card.period) : card.period;
        return {
          ...card,
          value: displayVal,
          change: changeVal,
          period: periodVal,
        };
      });

      setCards(mappedCards);
      setRecentOrders(Array.isArray(data?.recentOrders) ? data.recentOrders : []);
      setInventoryAlerts(Array.isArray(data?.inventoryAlerts) ? data.inventoryAlerts : []);

      if (data?.system || data?.systemOverview) {
        const sys = data.system || data.systemOverview;
        setSystemOverview({
          totalUsers: toDisplayText(sys.totalUsers ?? sys.users ?? sys.activeUsers, '0'),
          totalRestaurants: toDisplayText(sys.totalRestaurants ?? sys.restaurants, '1'),
          storageUsage: toDisplayText(sys.storageUsage ?? sys.storage ?? sys.sizeMb, '0%'),
        });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const quickActions = [
    { label: 'Add New User', icon: UserPlus, color: 'text-indigo-600', route: '/admin/panel/users-and-roles' },
    { label: 'Add Menu Item', icon: ConciergeBell, color: 'text-emerald-600', route: '/admin/panel/menu-management' },
    { label: 'Create Order', icon: FilePlus, color: 'text-sky-600', route: '/admin/panel/order-management' },
    { label: 'Add Table', icon: Utensils, color: 'text-amber-600', route: '/admin/panel/table-management' },
    { label: 'New Reservation', icon: CalendarPlus, color: 'text-rose-600', route: '/admin/panel/reservation-management' },
    { label: 'Generate Report', icon: BarChart3, color: 'text-purple-600', route: '/admin/panel/reports-and-analytics' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white">
            Welcome back, Admin 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live overview of your restaurant operations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date().toLocaleDateString()}
          </span>
          <button
            type="button"
            onClick={loadDashboard}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center text-slate-400">
          Loading dashboard metrics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {cards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.key}
                  className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">{stat.label}</p>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">
                      {stat.value}
                    </h3>
                  </div>
                  <div className="text-[10px] flex items-center gap-1 font-semibold">
                    {stat.change && (
                      <span className="text-emerald-600">{stat.change}</span>
                    )}
                    <span className="text-slate-400 font-normal">{stat.period}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Orders</h3>
                <button
                  type="button"
                  onClick={() => navigate('/admin/panel/order-management')}
                  className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700">
                      <th className="pb-2 font-medium">Order ID</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Table</th>
                      <th className="pb-2 font-medium">Amount</th>
                      <th className="pb-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-6 text-center text-slate-400">
                          No recent orders found.
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order, idx) => (
                        <tr key={order.id || idx}>
                          <td className="py-3 font-extrabold text-indigo-600">
                            {toDisplayText(order.id || order.orderNumber, `#${idx + 1}`)}
                          </td>
                          <td className="py-3 font-semibold text-slate-800 dark:text-white">
                            {toDisplayText(order.customer || order.customerName, 'Walk-in')}
                          </td>
                          <td className="py-3 text-slate-500">
                            {toDisplayText(order.table || order.tableNumber, '-')}
                          </td>
                          <td className="py-3 font-extrabold text-slate-800 dark:text-white">
                            {formatCurrency(Number(order.amount ?? order.totalAmount ?? 0))}
                          </td>
                          <td className="py-3 capitalize text-slate-600 dark:text-slate-300">
                            {toDisplayText(order.status, 'pending')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">System Overview</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                  <span className="text-slate-500">Total Users</span>
                  <span className="font-bold text-slate-800 dark:text-white">{systemOverview.totalUsers}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                  <span className="text-slate-500">Restaurants</span>
                  <span className="font-bold text-slate-800 dark:text-white">{systemOverview.totalRestaurants}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                  <span className="text-slate-500">Storage</span>
                  <span className="font-bold text-slate-800 dark:text-white">{systemOverview.storageUsage}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 dark:text-white text-sm">Quick Actions</h3>
                <button
                  type="button"
                  onClick={() => navigate('/admin/panel/settings')}
                  className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3 h-3" /> Settings
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => navigate(action.route)}
                      className="flex flex-col items-center justify-center p-3 bg-slate-50/80 dark:bg-slate-700/40 hover:border-emerald-300 border border-slate-200/80 dark:border-slate-700 rounded-xl transition cursor-pointer text-center"
                    >
                      <Icon className={`w-4 h-4 mb-1.5 ${action.color}`} />
                      <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                        {action.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Inventory Alerts</h3>
            {inventoryAlerts.length === 0 ? (
              <p className="text-slate-400">No low stock items.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {inventoryAlerts.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="flex items-center justify-between p-3 bg-rose-50/40 rounded-xl border border-rose-100"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800">{toDisplayText(item.name, 'Item')}</h4>
                      <span className="text-[10px] text-rose-500 font-semibold">Low Stock</span>
                    </div>
                    <span className="font-extrabold text-rose-600">
                      {toDisplayText(item.amount ?? item.currentStock ?? item.current_stock, '0')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}