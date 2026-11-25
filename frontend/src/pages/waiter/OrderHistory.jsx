import React, { useEffect, useState } from 'react';
import { History, Search, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export default function WaiterOrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [completedOrders, setCompletedOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getOrders({ limit: 100 });
      const done = list.filter((o) => {
        const st = String(o.status || '').toLowerCase();
        return st === 'served' || st === 'completed';
      });
      setCompletedOrders(done);
    } catch (err) {
      setError(err.message || 'Failed to load waiter order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filtered = completedOrders.filter((o) => {
    const q = searchTerm.toLowerCase();
    return (
      String(o.orderNumber || o.order_number || o.id || '').toLowerCase().includes(q) ||
      String(o.tableNumber || o.table_number || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" /> Waiter Order History
          </h1>
          <p className="text-slate-500">Served and completed table orders.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search order or table..."
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <button type="button" onClick={loadHistory} className="p-2 bg-slate-900 text-white rounded-xl cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Table</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading order history...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">No served or completed orders found.</td></tr>
            ) : (
              filtered.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">{o.orderNumber || o.order_number || `#${o.id}`}</td>
                  <td className="p-4">{o.tableNumber || o.table_number ? `Table ${o.tableNumber || o.table_number}` : '-'}</td>
                  <td className="p-4 capitalize font-bold text-emerald-600">{o.status}</td>
                  <td className="p-4 font-extrabold text-slate-900">${Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}