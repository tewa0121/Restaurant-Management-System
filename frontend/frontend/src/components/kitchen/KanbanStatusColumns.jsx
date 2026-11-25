import React from 'react';
import { Clock, Flame, CheckCircle } from 'lucide-react';

export default function KanbanStatusColumns({ columns = [] }) {
  const kanbanData = columns.length > 0 ? columns : [
    {
      title: 'Incoming',
      color: 'border-amber-500 text-amber-500',
      icon: Clock,
      items: [{ id: '#ORD-1255', table: 'Table 2', items: 'Kitfo Special', time: '2m' }]
    },
    {
      title: 'Preparing',
      color: 'border-blue-500 text-blue-500',
      icon: Flame,
      items: [{ id: '#ORD-1250', table: 'Table 5', items: 'Shiro Wat, 2x Injera', time: '12m' }]
    },
    {
      title: 'Ready to Serve',
      color: 'border-emerald-500 text-emerald-500',
      icon: CheckCircle,
      items: [{ id: '#ORD-1248', table: 'Table 7', items: 'Beyaynetu Platter', time: '20m' }]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {kanbanData.map((col, idx) => {
        const Icon = col.icon;
        return (
          <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className={`flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 font-bold text-xs ${col.color}`}>
              <span className="flex items-center gap-1.5">
                <Icon className="w-4 h-4" /> {col.title}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {col.items.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {col.items.map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{item.id}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{item.table}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">{item.items}</p>
                  <p className="text-[10px] text-slate-400">Elapsed: {item.time}</p>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}