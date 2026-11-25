import React, { useEffect, useState } from 'react';
import { History, Search, CheckCircle2 } from 'lucide-react';
import orderService from '../../services/orderService';

export default function CompletedOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await orderService.getOrders({ status: 'completed', limit: 100 });
        if (active) setOrders(list);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load completed orders.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = orders.filter((o) => {
    const q = searchTerm.toLowerCase();
    const num = String(o.orderNumber || o.order_number || o.id || '').toLowerCase();
    const tbl = String(o.tableNumber || o.table_number || '').toLowerCase();
    return num.includes(q) || tbl.includes(q);
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" /> Completed Kitchen Orders
          </h1>
          <p className="text-xs text-slate-500">History of completed orders.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search order or table..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Table / Type</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  Loading completed orders...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  No completed orders found.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">
                    {o.orderNumber || o.order_number || `#${o.id}`}
                  </td>
                  <td className="p-4">
                    {o.tableNumber || o.table_number
                      ? `Table ${o.tableNumber || o.table_number}`
                      : o.orderType || o.order_type || 'Order'}
                  </td>
                  <td className="p-4 font-extrabold text-slate-900">
                    ${Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold capitalize">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {o.status || 'completed'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}