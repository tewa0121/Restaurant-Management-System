// src/pages/kitchen/Ingredients.jsx
import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Search } from 'lucide-react';

export default function Ingredients() {
  const [ingredients] = useState([
    { id: 1, name: 'Chicken Breast', category: 'Meat & Poultry', quantity: '1.5 kg', status: 'Low Stock', unit: 'kg' },
    { id: 2, name: 'Cooking Oil', category: 'Oils & Condiments', quantity: '1.0 L', status: 'Low Stock', unit: 'L' },
    { id: 3, name: 'Mozzarella Cheese', category: 'Dairy', quantity: '8.5 kg', status: 'In Stock', unit: 'kg' },
    { id: 4, name: 'Basmati Rice', category: 'Grains', quantity: '25.0 kg', status: 'In Stock', unit: 'kg' },
    { id: 5, name: 'Tomatoes', category: 'Produce', quantity: '4.2 kg', status: 'In Stock', unit: 'kg' },
  ]);

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-500" /> Kitchen Raw Ingredients
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Inventory directory of all active recipe components.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ingredients.map(item => (
          <div key={item.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h4>
                <p className="text-[10px] text-slate-400">{item.category}</p>
              </div>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                item.status === 'Low Stock' 
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' 
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
              }`}>
                {item.status}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400">Available Stock:</span>
              <span className="font-black text-slate-800 dark:text-white">{item.quantity}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}