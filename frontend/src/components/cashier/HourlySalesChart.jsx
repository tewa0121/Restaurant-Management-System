import React from 'react';

export default function HourlySalesChart() {
  const hours = [
    { time: '10 AM', amount: 320, height: '40%' },
    { time: '11 AM', amount: 450, height: '60%' },
    { time: '12 PM', amount: 980, height: '95%' },
    { time: '1 PM', amount: 850, height: '85%' },
    { time: '2 PM', amount: 400, height: '50%' },
    { time: '3 PM', amount: 300, height: '35%' },
    { time: '4 PM', amount: 620, height: '70%' },
    { time: '5 PM', amount: 900, height: '90%' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs">Hourly Sales Distribution</h3>
        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">Today</span>
      </div>

      <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
        {hours.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition shadow-md">
              ${h.amount}
            </div>
            <div
              style={{ height: h.height }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-lg transition-all duration-300 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 font-semibold">{h.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}