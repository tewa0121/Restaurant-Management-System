import React, { useEffect, useState } from 'react';
import usePolling from '../../hooks/usePolling';
import { UtensilsCrossed, RefreshCw } from 'lucide-react';
import tableService from '../../services/tableService';
import orderService from '../../services/orderService';

export default function WaiterDashboard() {
  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFloorData = async (silent) => {
    if (silent !== true) setLoading(true);
    setError('');
    try {
      const [tablesData, ordersData] = await Promise.all([
        tableService.getTables(),
        orderService.getOrders({ limit: 50 }),
      ]);
      setTables(tablesData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message || 'Failed to load waiter floor data.');
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => loadFloorData(true), 10000);

  useEffect(() => {
    loadFloorData();
  }, []);

  const handleServeOrder = async (orderId) => {
    setError('');
    try {
      await orderService.updateOrderStatus(orderId, 'served');
      await loadFloorData();
    } catch (err) {
      setError(err.message || 'Failed to mark order served.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Waiter Floor Dashboard</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Track dining tables and serve orders that are ready from the kitchen.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadFloorData}
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
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading floor status...
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900">Tables ({tables.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60 space-y-1"
                >
                  <p className="font-bold text-xs text-gray-900">
                    Table {t.tableNumber || t.table_number || t.id}
                  </p>
                  <p className="text-[11px] text-gray-500">{t.capacity} seats</p>
                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-700 capitalize">
                    {t.statusLabel || t.status || 'available'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900">Recent & Ready Orders</h2>
            <div className="divide-y divide-gray-100">
              {orders.map((ord) => {
                const status = String(ord.status || '').toLowerCase();
                return (
                  <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                    <div>
                      <p className="font-bold text-gray-900">
                        {ord.orderNumber || ord.order_number || `#${ord.id}`} —{' '}
                        {ord.tableNumber || ord.table_number
                          ? `Table ${ord.tableNumber || ord.table_number}`
                          : ord.orderType || ord.order_type}
                      </p>
                      <p className="text-gray-500 capitalize">Status: {status}</p>
                    </div>
                    {status === 'ready' && (
                      <button
                        type="button"
                        onClick={() => handleServeOrder(ord.id)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Mark Served
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}