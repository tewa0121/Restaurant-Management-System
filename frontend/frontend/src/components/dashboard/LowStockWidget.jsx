import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function LowStockWidget({ items = [] }) {
  const stockItems = items.length > 0 ? items : [
    { id: 1, name: 'Tomato', qty: '2 kg left', status: 'Critical' },
    { id: 2, name: 'Chicken Breast', qty: '1.5 kg left', status: 'Low' },
    { id: 3, name: 'Cooking Oil', qty: '1 L left', status: 'Critical' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
        <AlertTriangle className="w-4 h-4 text-rose-500" /> Low Stock Inventory Alerts
      </h3>

      <div className="space-y-2">
        {stockItems.map((item) => (
          <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.name}</span>
            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 font-bold text-[10px] rounded-full">
              {item.qty}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}