import React from 'react';

export default function SalesOverviewChart() {
  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs">Sales Overview Trend</h3>
        <span className="text-[10px] text-slate-400 font-semibold">Real-time Analytics</span>
      </div>
      <div className="h-44 flex items-center justify-center bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 font-medium">📈 Interactive Sales Trend Graph Active</p>
      </div>
    </div>
  );
}