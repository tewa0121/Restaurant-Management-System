import React, { useEffect, useState } from 'react';
import { ChefHat, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import orderService from '../../services/orderService';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const loadKitchenOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await orderService.getKitchenOrders({ limit: 100 });
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Failed to load kitchen queue.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKitchenOrders();
  }, []);

  const handleAdvanceStatus = async (order, nextStatus) => {
    setUpdatingId(order.id);
    setError('');
    try {
      await orderService.updateOrderStatus(order.id, nextStatus);
      await loadKitchenOrders();
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Kitchen Display</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Prepare incoming orders and mark dishes ready for service.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadKitchenOrders}
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
        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading kitchen orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          No active kitchen orders right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((ord) => {
            const status = String(ord.status || '').toLowerCase();
            const orderCode = ord.orderNumber || ord.order_number || `#${ord.id}`;
            const tableLabel =
              ord.tableNumber || ord.table_number
                ? `Table ${ord.tableNumber || ord.table_number}`
                : ord.orderType || ord.order_type || 'Order';
            const items = Array.isArray(ord.items) ? ord.items : [];

            return (
              <div
                key={ord.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-extrabold text-gray-900">{orderCode}</span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase">
                      {status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="font-semibold text-gray-700">{tableLabel}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ord.timeAgo || ord.createdAtLabel || 'Active'}
                    </span>
                  </div>

                  <div className="border-t border-gray-100 pt-3 space-y-2">
                    {items.length > 0 ? (
                      items.map((item, idx) => (
                        <div key={item.id || idx} className="text-xs flex justify-between">
                          <span className="font-semibold text-gray-800">
                            {item.quantity || item.qty || 1}× {item.name || item.itemName || 'Item'}
                          </span>
                          {item.specialInstructions && (
                            <span className="text-[11px] text-amber-700 italic">
                              {item.specialInstructions}
                            </span>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400">Order items synced with backend</p>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  {status === 'pending' && (
                    <button
                      type="button"
                      disabled={updatingId === ord.id}
                      onClick={() => handleAdvanceStatus(ord, 'preparing')}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Start Preparing
                    </button>
                  )}
                  {status === 'preparing' && (
                    <button
                      type="button"
                      disabled={updatingId === ord.id}
                      onClick={() => handleAdvanceStatus(ord, 'ready')}
                      className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Ready</span>
                    </button>
                  )}
                  {status !== 'pending' && status !== 'preparing' && (
                    <div className="w-full text-center py-2 text-xs font-semibold text-gray-400">
                      Status: {status}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}