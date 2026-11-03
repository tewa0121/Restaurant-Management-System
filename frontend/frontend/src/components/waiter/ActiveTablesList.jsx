import React from 'react';
import { Utensils, Users, ArrowRight } from 'lucide-react';

export default function ActiveTablesList({ tables = [], onSelectTable }) {
  const displayTables = tables.length > 0 ? tables : [
    { id: 1, number: 'Table 5', guests: 4, status: 'Occupied', server: 'John' },
    { id: 2, number: 'Table 12', guests: 2, status: 'Occupied', server: 'John' },
    { id: 3, number: 'Table 3', guests: 6, status: 'Reserved', server: 'John' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
          <Utensils className="w-4 h-4 text-emerald-500" /> Active Tables Overview
        </h3>
        <span className="text-[10px] text-slate-400 font-semibold">{displayTables.length} Active</span>
      </div>

      <div className="space-y-2">
        {displayTables.map((t) => (
          <div
            key={t.id || t.number}
            onClick={() => onSelectTable && onSelectTable(t)}
            className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs hover:border-emerald-500 border border-transparent transition cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center font-bold">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{t.number || t.name}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Users className="w-3 h-3" /> {t.guests || '2 Guests'} • <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t.status}</span>
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>
    </div>
  );
}