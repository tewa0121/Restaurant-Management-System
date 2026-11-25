import React, { useEffect, useState } from 'react';
import { Navigation, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';

export default function CustomerTrackOrder() {
  const [orders, setOrders] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getMyOrders({ limit: 20 });
      setOrders(list);
      if (list.length > 0) {
        const firstId = selectedId || String(list[0].id);
        setSelectedId(firstId);
        const tr = await orderService.trackOrder(firstId).catch(() => list[0]);
        setTracking(tr);
      }
    } catch (err) {
      setError(err.message || 'Failed to load order tracking.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleSelectOrder = async (id) => {
    setSelectedId(id);
    if (!id) return;
    setError('');
    try {
      const tr = await orderService.trackOrder(id).catch(() => orders.find((o) => String(o.id) === String(id)));
      setTracking(tr);
    } catch (err) {
      setError(err.message || 'Failed to track selected order.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Navigation className="w-5 h-5 text-emerald-600" /> Track Order
          </h1>
          <p className="text-xs text-gray-500 mt-1">Live status updates from the backend.</p>
        </div>
        <button
          type="button"
          onClick={loadOrders}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-xs text-gray-400">Loading tracking info...</div>
      ) : orders.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-xs text-gray-400">No orders to track.</div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs">
          <div>
            <label className="font-bold block mb-1">SELECT ORDER</label>
            <select
              value={selectedId}
              onChange={(e) => handleSelectOrder(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl font-bold outline-none"
            >
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber || o.order_number || `Order #${o.id}`}
                </option>
              ))}
            </select>
          </div>

          {tracking && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1">
              <p className="font-extrabold text-sm text-gray-900 capitalize">
                Current Status: {tracking.status || 'pending'}
              </p>
              <p className="text-gray-600">
                Total: ${Number(tracking.totalAmount ?? tracking.total_amount ?? tracking.total ?? 0).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}