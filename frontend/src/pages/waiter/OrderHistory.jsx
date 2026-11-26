// src/pages/waiter/OrderHistory.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { History, CheckCircle2, Search, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';
import useCurrency from '../../hooks/useCurrency';
import usePolling from '../../hooks/usePolling';

const formatTime = (value) => {
  if (!value) return '-';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? '-'
    : d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function WaiterOrderHistory() {
  const { formatMoney } = useCurrency();
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (silent = false) => {
    if (silent !== true) setLoading(true);
    try {
      // only the orders this waiter took, already served or paid
      const list = await orderService.getOrders({ mine: true, status: 'served,completed', limit: 100 });
      setOrders(list);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 30000);

  const q = searchTerm.trim().toLowerCase();
  const filteredOrders = orders.filter((o) => {
    const number = String(o.orderNumber || o.id || '').toLowerCase();
    const table = String(o.tableNames || o.orderType || '').toLowerCase();
    return !q || number.includes(q) || table.includes(q);
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-500" /> Completed Orders History
          </h1>
          <p className="text-xs text-slate-500 font-medium">Orders you took that have been served or paid.</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Order # or Table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
          <button type="button" onClick={() => load()} className="p-2.5 bg-slate-900 text-white rounded-xl cursor-pointer" aria-label="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Order #</th>
              <th className="p-4">Table / Type</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total</th>
              <th className="p-4">Ordered</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-400">Loading orders...</td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-400 font-bold">
                  {q ? 'No orders match your search.' : 'No completed orders yet.'}
                </td>
              </tr>
            ) : (
              filteredOrders.map((o) => {
                const status = String(o.status || '').toLowerCase();
                return (
                  <tr key={o.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-4 font-bold text-blue-600">{o.orderNumber || `#${o.id}`}</td>
                    <td className="p-4 font-bold text-slate-900 capitalize">
                      {o.tableNames || String(o.orderType || '').replace(/_/g, ' ') || '-'}
                    </td>
                    <td className="p-4 text-slate-500">
                      {Number(o.itemCount ?? 0)} item{Number(o.itemCount) === 1 ? '' : 's'}
                    </td>
                    <td className="p-4 font-black text-slate-900">{formatMoney(o.total)}</td>
                    <td className="p-4 text-slate-400">{formatTime(o.orderedAt)}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 inline-flex items-center gap-1 capitalize">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {status}
                      </span>
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
