// src/pages/kitchen/StockAlerts.jsx
import React, { useState } from 'react';
import { AlertTriangle, PackageCheck, RefreshCw } from 'lucide-react';

export default function StockAlerts() {
  const [stockItems, setStockItems] = useState([
    { id: 1, name: 'Chicken Breast', remaining: '1.5 kg', threshold: '5.0 kg', status: 'Critical', lastRestocked: 'Yesterday' },
    { id: 2, name: 'Cooking Oil', remaining: '1.0 L', threshold: '10.0 L', status: 'Critical', lastRestocked: '3 days ago' },
    { id: 3, name: 'Margherita Cheese', remaining: '3.2 kg', threshold: '4.0 kg', status: 'Low', lastRestocked: '2 days ago' },
    { id: 4, name: 'Fresh Tomatoes', remaining: '2.0 kg', threshold: '5.0 kg', status: 'Low', lastRestocked: 'Yesterday' },
  ]);

  const handleRequestRestock = (id) => {
    setStockItems(prev => prev.map(item => item.id === id ? { ...item, status: 'Restock Requested' } : item));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" /> Low Stock & Inventory Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Monitor raw ingredient levels to prevent kitchen service delays.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stockItems.map(item => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-slate-800 dark:text-white">{item.name}</h4>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                  item.status === 'Critical' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                  item.status === 'Low' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Remaining: <strong className="text-slate-800 dark:text-white">{item.remaining}</strong> (Min Threshold: {item.threshold})</p>
            </div>

            <button
              type="button"
              disabled={item.status === 'Restock Requested'}
              onClick={() => handleRequestRestock(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                item.status === 'Restock Requested' 
                  ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {item.status === 'Restock Requested' ? 'Requested' : 'Request Restock'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}