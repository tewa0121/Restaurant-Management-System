import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';
import tableService from '../../services/tableService';
import reservationService from '../../services/reservationService';
import inventoryService from '../../services/inventoryService';

export default function ManagerDashboard() {
  const [ordersCount, setOrdersCount] = useState(0);
  const [tablesCount, setTablesCount] = useState(0);
  const [reservationsCount, setReservationsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    setLoading(true);
    setError('');
    try {
      const [orders, tables, reservations, lowStock] = await Promise.all([
        orderService.getOrders({ limit: 200 }).catch(() => []),
        tableService.getTables().catch(() => []),
        reservationService.getReservations({ limit: 200 }).catch(() => []),
        inventoryService.getLowStock().catch(() => []),
      ]);
      setOrdersCount(orders.length);
      setTablesCount(tables.length);
      setReservationsCount(reservations.length);
      setLowStockCount(lowStock.length);
    } catch (err) {
      setError(err.message || 'Failed to load manager overview.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="space-y-6 font-sans text-xs">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 mt-1">Live operational summary from backend services.</p>
        </div>
        <button
          type="button"
          onClick={loadStats}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">Loading metrics...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold uppercase text-[10px]">Orders</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{ordersCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold uppercase text-[10px]">Tables</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{tablesCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold uppercase text-[10px]">Reservations</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{reservationsCount}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-400 font-bold uppercase text-[10px]">Low Stock Alerts</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{lowStockCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}