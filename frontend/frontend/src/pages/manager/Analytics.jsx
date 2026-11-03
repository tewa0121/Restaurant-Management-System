// src/pages/manager/Analytics.jsx
import React, { useState } from 'react';
import { BarChart2, TrendingUp, Users, Utensils } from 'lucide-react';

export default function Analytics() {
  const [metric, setMetric] = useState('sales');

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-500" /> Restaurant Analytics
          </h1>
          <p className="text-xs text-slate-500">Deep-dive performance metrics and peak hour trends.</p>
        </div>
        <select value={metric} onChange={(e) => setMetric(e.target.value)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs">
          <option value="sales">Sales & Foot Traffic</option>
          <option value="items">Top Selling Items</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Peak Dining Hours</h3>
          <div className="h-48 flex items-end justify-between gap-2 pt-6">
            {[
              { time: '12 PM', height: '65%' },
              { time: '1 PM', height: '90%' },
              { time: '2 PM', height: '40%' },
              { time: '6 PM', height: '70%' },
              { time: '7 PM', height: '95%' },
              { time: '8 PM', height: '85%' },
              { time: '9 PM', height: '50%' },
            ].map(b => (
              <div key={b.time} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-indigo-500 rounded-t-lg transition-all" style={{ height: b.height }} />
                <span className="text-[10px] text-slate-400">{b.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Top Performing Dishes</h3>
          <div className="space-y-3 text-xs">
            {[
              { name: 'Grilled Salmon Special', orders: '340 orders', rev: '$6,800' },
              { name: 'Truffle Mushroom Burger', orders: '290 orders', rev: '$4,350' },
              { name: 'Classic Caesar Salad', orders: '210 orders', rev: '$2,520' },
              { name: 'Molten Lava Cake', orders: '185 orders', rev: '$1,850' },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white">{item.name}</h4>
                  <p className="text-[10px] text-slate-400">{item.orders}</p>
                </div>
                <span className="font-black text-emerald-600">{item.rev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}