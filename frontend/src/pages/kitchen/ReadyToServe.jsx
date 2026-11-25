import React, { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export default function ReadyToServe() {
  const [readyOrders, setReadyOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReady = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getKitchenOrders().catch(() => orderService.getOrders({ status: 'ready' }));
      const ready = list.filter((o) => String(o.status || '').toLowerCase() === 'ready');
      setReadyOrders(ready);
    } catch (err) {
      setError(err.message || 'Failed to load ready orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReady();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Ready to Serve
          </h1>
          <p className="text-xs text-slate-500">Completed kitchen tickets awaiting waiter pickup.</p>
        </div>
        <button
          type="button"
          onClick={loadReady}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading ready orders...
        </div>
      ) : readyOrders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No orders waiting for pickup.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {readyOrders.map((o) => (
            <div
              key={o.id}
              className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-sm text-slate-900">
                  {o.orderNumber || o.order_number || `#${o.id}`}
                </span>
                <span className="text-emerald-600 font-bold">
                  {o.tableNumber || o.table_number
                    ? `Table ${o.tableNumber || o.table_number}`
                    : o.orderType || o.order_type || 'Order'}
                </span>
              </div>
              <ul className="space-y-1 text-slate-700">
                {(o.items || []).map((it, idx) => (
                  <li key={it.id || idx}>
                    • {it.name || it.itemName || it.item_name || `Item #${it.menuItemId || idx + 1}`} x
                    {it.quantity || 1}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}