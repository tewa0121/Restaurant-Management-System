import React from 'react';

export default function MonthlyBarChart() {
  const weeks = [
    { label: 'Week 1', amount: '$24,500', height: '65%' },
    { label: 'Week 2', amount: '$28,200', height: '78%' },
    { label: 'Week 3', amount: '$31,000', height: '88%' },
    { label: 'Week 4', amount: '$30,500', height: '85%' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs">Monthly Revenue Performance</h3>
        <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 font-bold px-2 py-0.5 rounded-md">This Month</span>
      </div>

      <div className="h-44 flex items-end justify-between gap-4 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
        {weeks.map((w, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
            <div className="absolute -top-8 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-md">
              {w.amount}
            </div>
            <div style={{ height: w.height }} className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-t-xl transition-all cursor-pointer" />
            <span className="text-[10px] text-slate-400 font-semibold">{w.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}