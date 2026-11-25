import React, { useEffect, useState } from 'react';
import { History, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export function OrderHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getOrders({ status: 'completed', limit: 100 });
      setHistory(list);
    } catch (err) {
      setError(err.message || 'Failed to load order history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-600" /> Cashier Order History
          </h1>
          <p className="text-slate-500">Completed and settled orders.</p>
        </div>
        <button
          type="button"
          onClick={loadHistory}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Table / Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading history...</td></tr>
            ) : history.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">No completed orders found.</td></tr>
            ) : (
              history.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">{o.orderNumber || o.order_number || `#${o.id}`}</td>
                  <td className="p-4">{o.tableNumber || o.table_number ? `Table ${o.tableNumber || o.table_number}` : o.orderType || o.order_type || 'Order'}</td>
                  <td className="p-4 capitalize font-bold text-emerald-600">{o.status || 'completed'}</td>
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

export default OrderHistory;