import React, { useEffect, useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import inventoryService from '../../services/inventoryService';

export default function StockAlerts() {
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLowStock = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await inventoryService.getLowStock().catch(async () => {
        const all = await inventoryService.getInventory({ limit: 200 });
        return all.filter((i) => Number(i.currentStock ?? i.current_stock ?? 0) <= Number(i.reorderLevel ?? i.reorder_level ?? 0));
      });
      setStockItems(list);
    } catch (err) {
      setError(err.message || 'Failed to load stock alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLowStock();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" /> Low Stock Alerts
          </h1>
          <p className="text-slate-500">Ingredients at or below reorder threshold.</p>
        </div>
        <button
          type="button"
          onClick={loadLowStock}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Checking low stock items...</div>
        ) : stockItems.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No low stock alerts right now.</div>
        ) : (
          stockItems.map((it) => (
            <div key={it.id} className="p-4 flex items-center justify-between">
              <span className="font-bold text-slate-900">{it.name}</span>
              <span className="font-extrabold text-rose-600">
                Stock: {it.currentStock ?? it.current_stock ?? 0} {it.unit || ''} (Reorder: {it.reorderLevel ?? it.reorder_level ?? 0})
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}