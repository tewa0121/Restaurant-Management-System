import React, { useState } from 'react';
import { Package, Plus, AlertTriangle, RefreshCw } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';

export default function IngredientTable({ inventory = [], onUpdate }) {
  const [items, setItems] = useState(inventory.length > 0 ? inventory : [
    { id: 1, name: 'Tomato', qty: '2 kg left', threshold: '5 kg', status: 'Low' },
    { id: 2, name: 'Chicken Breast', qty: '1.5 kg left', threshold: '4 kg', status: 'Low' },
    { id: 3, name: 'Cooking Oil', qty: '1 L left', threshold: '3 L', status: 'Low' },
    { id: 4, name: 'Cheese', qty: '5 kg left', threshold: '2 kg', status: 'Adequate' },
  ]);

  const handleRestock = async (id, currentQty) => {
    try {
      const newQty = '10 kg left';
      await inventoryService.updateStock(id, newQty);
      setItems(prev => prev.map(item => item.id === id ? { ...item, qty: newQty, status: 'Adequate' } : item));
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
          <Package className="w-4 h-4 text-emerald-500" /> Stock & Ingredient Inventory
        </h3>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950 font-bold px-2 py-0.5 rounded-md">
          {items.length} Tracked Items
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px]">
              <th className="pb-3 font-semibold">Ingredient Name</th>
              <th className="pb-3 font-semibold">Current Quantity</th>
              <th className="pb-3 font-semibold">Threshold</th>
              <th className="pb-3 font-semibold">Stock Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((item) => {
              const isLow = item.status === 'Low' || item.status === 'Critical';
              return (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                  <td className="py-3 text-slate-700 dark:text-slate-300 font-semibold">{item.qty}</td>
                  <td className="py-3 text-slate-400">{item.threshold || '2 kg'}</td>
                  <td className="py-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold inline-flex items-center gap-1 ${
                        isLow
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      }`}
                    >
                      {isLow && <AlertTriangle className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() => handleRestock(item.id, item.qty)}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" /> Restock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}