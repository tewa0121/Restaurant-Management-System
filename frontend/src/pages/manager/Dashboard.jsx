import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Utensils,
  Clock,
  Calendar,
  AlertTriangle,
  RefreshCw,
  CalendarPlus,
  UtensilsCrossed,
  PackageCheck,
  FileText,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import usePolling from '../../hooks/usePolling';
import useCurrency from '../../hooks/useCurrency';

const CARDS = [
  { key: 'totalOrders', label: "Today's Orders", icon: ShoppingBag, tone: 'text-indigo-600 bg-indigo-50' },
  { key: 'todayRevenue', label: "Today's Revenue", icon: DollarSign, tone: 'text-emerald-600 bg-emerald-50' },
  { key: 'availableTables', label: 'Available Tables', icon: Utensils, tone: 'text-sky-600 bg-sky-50' },
  { key: 'pendingOrders', label: 'Pending Orders', icon: Clock, tone: 'text-orange-600 bg-orange-50' },
  { key: 'reservationsToday', label: 'Reservations Today', icon: Calendar, tone: 'text-violet-600 bg-violet-50' },
  { key: 'lowStockItems', label: 'Low Stock Items', icon: AlertTriangle, tone: 'text-rose-600 bg-rose-50' },
];

const STATUS_DOT = {
  green: 'bg-emerald-500',
  orange: 'bg-orange-500',
  blue: 'bg-sky-500',
  purple: 'bg-violet-500',
  red: 'bg-rose-500',
};

const QUICK_ACTIONS = [
  { label: 'New Reservation', icon: CalendarPlus, to: '/manager/reservations' },
  { label: 'Manage Menu', icon: UtensilsCrossed, to: '/manager/menu-management' },
  { label: 'Inventory', icon: PackageCheck, to: '/manager/inventory-management' },
  { label: 'Reports', icon: FileText, to: '/manager/reports' },
  { label: 'Analytics', icon: BarChart3, to: '/manager/analytics' },
  { label: 'Orders', icon: ShoppingBag, to: '/manager/orders' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { formatMoney } = useCurrency();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatedAt, setUpdatedAt] = useState(null);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await dashboardService.getManagerDashboard();
      setData(res);
      setError('');
      setUpdatedAt(new Date());
    } catch (err) {
      setError(err.message || 'Failed to load the dashboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // keep the numbers live without a full page reload
  usePolling(() => load(true), 15000);

  const stats = data?.stats || {};
  const maxWeek = Math.max(1, ...(data?.monthlyPerformance || []).map((w) => Number(w.sales) || 0));

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Manager Dashboard</h1>
          <p className="text-xs text-slate-500">
            Live overview of today&apos;s operations
            {updatedAt ? ` · updated ${updatedAt.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CARDS.map(({ key, label, icon: Icon, tone }) => {
          const stat = stats[key] || {};
          return (
            <div key={key} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-sm space-y-2">
              <div className={`p-2 w-fit rounded-xl ${tone}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-[11px] text-slate-400 font-medium">{label}</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">{stat.value ?? '—'}</h3>
              {stat.change ? (
                <p
                  className={`text-[10px] font-bold flex items-center gap-0.5 ${
                    stat.trend === 'down' ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  {stat.trend === 'down' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                  {stat.change} vs yesterday
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Recent Orders</h3>
            <button type="button" onClick={() => navigate('/manager/orders')} className="text-xs text-emerald-600 font-semibold cursor-pointer">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400">
                <tr>
                  <th className="p-3">Order</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Table</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {(data?.recentOrders || []).length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-400">
                      {loading ? 'Loading...' : 'No orders yet.'}
                    </td>
                  </tr>
                ) : (
                  data.recentOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="p-3 font-bold">{o.id}</td>
                      <td className="p-3">{o.customer}</td>
                      <td className="p-3">{o.table}</td>
                      <td className="p-3">{o.items}</td>
                      <td className="p-3 font-semibold">{formatMoney(o.amount)}</td>
                      <td className="p-3">{o.status}</td>
                      <td className="p-3 text-slate-400">{o.time}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Table Status</h3>
            {(data?.tableStatus || []).map((row) => (
              <div key={row.status} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[row.color] || 'bg-slate-400'}`} />
                  {row.status}
                </span>
                <span className="font-bold">{row.count}</span>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 dark:text-white">Today&apos;s Reservations</h3>
            {(data?.todayReservations || []).length === 0 ? (
              <p className="text-xs text-slate-400">No reservations today.</p>
            ) : (
              data.todayReservations.map((r) => (
                <div key={r.id} className="flex items-center justify-between text-xs">
                  <span>
                    <span className="font-bold">{r.time}</span> · {r.table} · {r.guests} guests
                  </span>
                  <span className="text-slate-400">{r.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">Orders In Progress</h3>
          {(data?.pendingOrders || []).length === 0 ? (
            <p className="text-xs text-slate-400">Nothing waiting in the kitchen.</p>
          ) : (
            data.pendingOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between text-xs">
                <span>
                  <span className="font-bold">{o.id}</span> · {o.table} · {o.items} items
                </span>
                <span className="text-slate-400">
                  {o.status} · {o.time}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">Low Stock</h3>
          {(data?.lowStockItems || []).length === 0 ? (
            <p className="text-xs text-slate-400">All ingredients are above their minimum level.</p>
          ) : (
            data.lowStockItems.map((i) => (
              <div key={i.item} className="flex items-center justify-between text-xs">
                <span className="font-semibold">{i.item}</span>
                <span className="text-rose-600 font-bold">{i.quantity}</span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">
            Weekly Sales{data?.revenueTotal ? ` · ${data.revenueTotal} (${data.revenuePeriod})` : ''}
          </h3>
          {(data?.monthlyPerformance || []).map((w) => (
            <div key={w.name} className="space-y-1">
              <div className="flex justify-between text-[11px]">
                <span>{w.name}</span>
                <span className="font-bold">{formatMoney(w.sales)}</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500" style={{ width: `${((Number(w.sales) || 0) / maxWeek) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm p-4 space-y-3">
        <h3 className="font-bold text-xs text-slate-900 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to }) => (
            <button
              key={label}
              type="button"
              onClick={() => navigate(to)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border hover:border-emerald-400 text-xs font-semibold cursor-pointer"
            >
              <Icon className="w-5 h-5 text-emerald-600" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
