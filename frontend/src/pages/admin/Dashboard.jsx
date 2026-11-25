import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Utensils,
  Users,
  Clock,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import orderService from '../../services/orderService';
import { formatCurrency } from '../../utils/formatters';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const [dashRes, ordersList] = await Promise.all([
        dashboardService.getAdminDashboard(),
        orderService.getOrders({ limit: 8 }),
      ]);
      const data = dashRes?.data ?? dashRes ?? {};
      setStats(data.stats || data.summary || data);
      setRecentOrders(Array.isArray(data.recentOrders) ? data.recentOrders : ordersList);
    } catch (err) {
      setError(err.message || 'Failed to load admin dashboard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const cards = [
    {
      label: 'Total Orders',
      value: stats?.totalOrders ?? stats?.ordersCount ?? 0,
      icon: ShoppingBag,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      path: '/admin/orders',
    },
    {
      label: "Today's Revenue",
      value: formatCurrency
        ? formatCurrency(Number(stats?.todayRevenue ?? stats?.revenue ?? 0))
        : `$${Number(stats?.todayRevenue ?? stats?.revenue ?? 0).toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      path: '/admin/reports',
    },
    {
      label: 'Available Tables',
      value: stats?.availableTables ?? stats?.tablesAvailable ?? 0,
      icon: Utensils,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      path: '/admin/tables',
    },
    {
      label: 'Total Customers',
      value: stats?.totalCustomers ?? stats?.customersCount ?? 0,
      icon: Users,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      path: '/admin/customers',
    },
    {
      label: 'Pending Orders',
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      path: '/admin/orders',
    },
    {
      label: 'Inventory Alerts',
      value: stats?.lowStockCount ?? stats?.inventoryAlerts ?? 0,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      path: '/admin/inventory',
    },
  ];

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Admin Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">
            Live overview of orders, revenue, tables, customers, and stock alerts.
          </p>
        </div>
        <button
          type="button"
          onClick={loadDashboard}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading dashboard metrics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => navigate(c.path)}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between text-left hover:border-gray-200 transition cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">{c.label}</p>
                    <p className="text-2xl font-extrabold text-gray-900 mt-1">{c.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${c.bg} ${c.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-gray-900">Recent Orders</h2>
              <button
                type="button"
                onClick={() => navigate('/admin/orders')}
                className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {recentOrders.length === 0 ? (
                <p className="text-gray-400 py-4">No recent orders found.</p>
              ) : (
                recentOrders.map((ord) => {
                  const total = Number(ord.totalAmount ?? ord.total_amount ?? ord.total ?? 0);
                  return (
                    <div key={ord.id} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          {ord.orderNumber || ord.order_number || `#${ord.id}`}
                        </p>
                        <p className="text-gray-500 capitalize">
                          {ord.customerName || ord.customer_name || 'Guest'} • {ord.status || 'pending'}
                        </p>
                      </div>
                      <span className="font-extrabold text-gray-900">${total.toFixed(2)}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}