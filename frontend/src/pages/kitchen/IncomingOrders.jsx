import React, { useEffect, useState } from 'react';
import usePolling from '../../hooks/usePolling';
import { Flame, Play, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';
import useNewItemAlert from '../../hooks/useNewItemAlert';
import { readPrefs, KITCHEN_PREFS } from '../../utils/preferences';

export default function IncomingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prefs] = useState(() => readPrefs(KITCHEN_PREFS.scope, KITCHEN_PREFS.defaults));

  const loadIncoming = async (silent) => {
    if (silent !== true) setLoading(true);
    setError('');
    try {
      const list = await orderService.getKitchenOrders().catch(() => orderService.getOrders({ status: 'pending' }));
      const incoming = list.filter((o) => {
        const st = String(o.status || '').toLowerCase();
        return st === 'pending' || st === 'confirmed' || st === 'new';
      });
      setOrders(incoming);
    } catch (err) {
      setError(err.message || 'Failed to load incoming kitchen orders.');
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => loadIncoming(true), 8000);
  useNewItemAlert(orders.map((o) => o.id), { ready: !loading, enabled: prefs.soundEnabled, kind: 'new' });

  useEffect(() => {
    loadIncoming();
  }, []);

  const startPreparing = async (id) => {
    setError('');
    try {
      await orderService.updateOrderStatus(id, 'preparing');
      await loadIncoming();
    } catch (err) {
      setError(err.message || 'Failed to start preparing order.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Flame className="w-6 h-6 text-orange-500" /> Incoming Kitchen Orders
          </h1>
          <p className="text-xs text-slate-500">New tickets waiting to be prepared.</p>
        </div>
        <button
          type="button"
          onClick={loadIncoming}
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
          Loading incoming orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          No incoming orders right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {orders.map((o) => (
            <div
              key={o.id}
              className={`bg-white p-5 rounded-2xl border shadow-sm flex flex-col justify-between space-y-4 ${
                prefs.priorityAlerts && (Number(o.priority) > 0 || Number(o.elapsedMinutes) >= 15)
                  ? 'border-rose-400 animate-pulse'
                  : 'border-slate-200/80'
              }`}
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
                onClick={() => startPreparing(o.id)}
                className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Preparing</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}