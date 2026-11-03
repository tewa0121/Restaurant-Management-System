import React from 'react';
import { History } from 'lucide-react';

export default function SystemActivityLogs({ logs = [] }) {
  const activityList = logs.length > 0 ? logs : [
    { id: 1, text: 'John Manager updated menu item price', time: '10m ago' },
    { id: 2, text: 'Cashier processed payment #PAY-1002', time: '25m ago' },
    { id: 3, text: 'New table reservation #RES-402 confirmed', time: '1h ago' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
        <History className="w-4 h-4 text-emerald-500" /> Recent System Activity Logs
      </h3>

      <div className="space-y-2.5">
        {activityList.map((log) => (
          <div key={log.id || log.text} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">{log.text}</span>
            <span className="text-[10px] text-slate-400">{log.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}