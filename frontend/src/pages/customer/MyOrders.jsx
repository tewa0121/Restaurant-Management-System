import React, { useEffect, useState } from 'react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMyOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getMyOrders({ limit: 50 });
      setOrders(list);
    } catch (err) {
      setError(err.message || 'Failed to load your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" /> My Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">View your past and active orders.</p>
        </div>
        <button
          type="button"
          onClick={loadMyOrders}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading your orders...
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="space-y-3 text-xs">
          {orders.map((ord) => (
            <div key={ord.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-extrabold text-sm text-gray-900">
                  {ord.orderNumber || ord.order_number || `Order #${ord.id}`}
                </p>
                <p className="text-gray-500 capitalize mt-0.5">
                  Status: <span className="font-bold text-emerald-600">{ord.status || 'pending'}</span>
                </p>
              </div>
              <span className="font-black text-sm text-gray-900">
                ${Number(ord.totalAmount ?? ord.total_amount ?? ord.total ?? 0).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}