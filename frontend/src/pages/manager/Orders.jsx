import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

const STATUSES = ['all', 'pending', 'preparing', 'ready', 'served', 'completed', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 150 };
      if (filterStatus !== 'all') params.status = filterStatus;
      const list = await orderService.getOrders(params);
      setOrders(list);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [filterStatus]);

  const handleStatusChange = async (orderId, nextStatus) => {
    setError('');
    try {
      await orderService.updateOrderStatus(orderId, nextStatus);
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    }
  };

  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      String(o.orderNumber || o.order_number || o.id || '').toLowerCase().includes(q) ||
      String(o.customerName || o.customer_name || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" /> Orders Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">Monitor and manage all restaurant orders.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order..."
              className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />
          </div>
          <button
            type="button"
            onClick={loadOrders}
            className="p-2 bg-gray-900 text-white rounded-xl cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
              filterStatus === st ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Type</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading orders...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-400">No orders found.</td></tr>
            ) : (
              filtered.map((o) => {
                const st = String(o.status || 'pending').toLowerCase();
                return (
                  <tr key={o.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-bold text-gray-900">{o.orderNumber || o.order_number || `#${o.id}`}</td>
                    <td className="p-4 text-gray-700">{o.customerName || o.customer_name || 'Guest'}</td>
                    <td className="p-4 capitalize text-gray-600">{o.orderType || o.order_type || 'dine_in'}</td>
                    <td className="p-4 font-extrabold text-gray-900">
                      ${Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <select
                        value={st}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold capitalize outline-none"
                      >
                        {STATUSES.filter((s) => s !== 'all').map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}