import React from 'react';

export default function RevenueCategoryChart() {
  const categories = [
    { name: 'Main Course', share: '55%', amount: '$62,800', color: 'bg-emerald-500' },
    { name: 'Beverages', share: '25%', amount: '$28,500', color: 'bg-blue-500' },
    { name: 'Appetizers / Starters', share: '12%', amount: '$13,700', color: 'bg-amber-500' },
    { name: 'Desserts', share: '8%', amount: '$9,200', color: 'bg-purple-500' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs">Revenue Share by Category</h3>

      <div className="space-y-3">
        {categories.map((c, i) => (
          <div key={i} className="space-y-1 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-700 dark:text-slate-300">{c.name}</span>
              <span className="text-slate-900 dark:text-white">{c.amount} ({c.share})</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div style={{ width: c.share }} className={`h-full ${c.color} rounded-full`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}