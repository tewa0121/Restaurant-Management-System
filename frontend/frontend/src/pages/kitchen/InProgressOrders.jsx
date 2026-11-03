// src/pages/kitchen/InProgress.jsx
import React, { useState } from 'react';
import { Clock, CheckCircle2, ChevronRight } from 'lucide-react';

export default function InProgress() {
  const [inProgress, setInProgress] = useState([
    { id: '#ORD-1245', table: 'Table 1', chef: 'Chef Alex', preparing: 'Main Course', progress: 60, started: '10:05 AM' },
    { id: '#ORD-1244', table: 'Table 8', chef: 'Chef Sarah', preparing: 'Appetizer', progress: 45, started: '10:02 AM' },
    { id: '#ORD-1243', table: 'Table 10', chef: 'Chef Daniel', preparing: 'Main Course', progress: 70, started: '9:58 AM' },
    { id: '#ORD-1242', table: 'Table 3', chef: 'Chef Alex', preparing: 'Beverages', progress: 90, started: '9:55 AM' },
  ]);

  const handleMarkReady = (id) => {
    setInProgress(prev => prev.filter(o => o.id !== id));
  };

  const handleUpdateProgress = (id, newProgress) => {
    setInProgress(prev => prev.map(o => o.id === id ? { ...o, progress: newProgress } : o));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" /> Live Kitchen Prep Queue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track active prep progress and mark ready for waiter pickup.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-xs font-bold">
          {inProgress.length} Items Cooking
        </span>
      </div>

      <div className="space-y-3">
        {inProgress.map(o => (
          <div key={o.id} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="font-black text-emerald-600">{o.id}</span>
                <span className="text-xs font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{o.table}</span>
                <span className="text-xs text-slate-400">Assigned: {o.chef}</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Category: {o.preparing}</p>
            </div>

            <div className="flex-1 max-w-xs space-y-1">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="text-slate-400">Cooking Progress</span>
                <span className="text-emerald-500">{o.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${o.progress}%` }} />
              </div>
              <div className="flex gap-1 pt-1">
                {[25, 50, 75, 100].map(val => (
                  <button key={val} type="button" onClick={() => handleUpdateProgress(o.id, val)} className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono hover:bg-emerald-500 hover:text-white cursor-pointer">
                    {val}%
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleMarkReady(o.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <CheckCircle2 className="w-4 h-4" /> Ready for Serving
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}