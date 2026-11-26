import React, { useEffect, useState } from 'react';
import usePolling from '../../hooks/usePolling';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';
import useNewItemAlert from '../../hooks/useNewItemAlert';
import { readPrefs, WAITER_PREFS } from '../../utils/preferences';

const TABS = ['All', 'pending', 'preparing', 'ready', 'served', 'completed'];

export default function WaiterOrders() {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [prefs] = useState(() => readPrefs(WAITER_PREFS.scope, WAITER_PREFS.defaults));

  const loadOrders = async (silent) => {
    if (silent !== true) setLoading(true);
    setError('');
    try {
      const params = { limit: 100 };
      if (activeTab !== 'All') params.status = activeTab;
      const list = await orderService.getOrders(params);
      setOrders(list);
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => loadOrders(true), 8000);
  useNewItemAlert(
    orders.filter((o) => String(o.status).toLowerCase() === 'ready').map((o) => o.id),
    { ready: !loading, enabled: prefs.kitchenSound, kind: 'ready' }
  );

  useEffect(() => {
    loadOrders();
  }, [activeTab]);

  const handleMarkServed = async (orderId) => {
    setError('');
    try {
      await orderService.updateOrderStatus(orderId, 'served');
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to mark order as served.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-600" /> Floor Orders
          </h1>
          <p className="text-xs text-slate-500">Track live order status from kitchen to table.</p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
              activeTab === tab
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
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
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const st = String(o.status || 'pending').toLowerCase();
                const totalVal = Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0);
                return (
                  <tr key={o.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">
                      {o.orderNumber || o.order_number || `#${o.id}`}
                    </td>
                    <td className="p-4">
                      {o.tableNumber || o.table_number
                        ? `Table ${o.tableNumber || o.table_number}`
                        : o.orderType || o.order_type || 'Dine In'}
                    </td>
                    <td className="p-4 capitalize font-bold">{st.replace(/_/g, ' ')}</td>
                    <td className="p-4 font-extrabold text-slate-900">${totalVal.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      {st === 'ready' && (
                        <button
                          type="button"
                          onClick={() => handleMarkServed(o.id)}
                          className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Mark Served
                        </button>
                      )}
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