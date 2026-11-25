import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle2, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export default function InProgress() {
  const [inProgress, setInProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPreparing = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getKitchenOrders().catch(() => orderService.getOrders({ status: 'preparing' }));
      const active = list.filter((o) => String(o.status || '').toLowerCase() === 'preparing');
      setInProgress(active);
    } catch (err) {
      setError(err.message || 'Failed to load in-progress orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPreparing();
  }, []);

  const markReady = async (id) => {
    setError('');
    try {
      await orderService.updateOrderStatus(id, 'ready');
      await loadPreparing();
    } catch (err) {
      setError(err.message || 'Failed to mark order as ready.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" /> Orders In Progress
          </h1>
          <p className="text-xs text-slate-500">Dishes currently being cooked at the station.</p>
        </div>
        <button
          type="button"
          onClick={loadPreparing}
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
          Loading in-progress orders...
        </div>
      ) : inProgress.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No orders currently in progress.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {inProgress.map((o) => (
            <div
              key={o.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-black text-sm text-slate-900">
                    {o.orderNumber || o.order_number || `#${o.id}`}
                  </span>
                  <span className="text-slate-500 font-bold">
                    {o.tableNumber || o.table_number
                      ? `Table ${o.tableNumber || o.table_number}`
                      : o.orderType || o.order_type || 'Order'}
                  </span>
                </div>
                <ul className="mt-3 space-y-1 text-slate-700">
                  {(o.items || []).map((it, idx) => (
                    <li key={it.id || idx}>
                      • {it.name || it.itemName || it.item_name || `Item #${it.menuItemId || idx + 1}`} x
                      {it.quantity || 1}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => markReady(o.id)}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Ready</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}