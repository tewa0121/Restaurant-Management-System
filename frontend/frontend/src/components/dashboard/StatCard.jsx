import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function StatCard({ title, value, icon: Icon, trend = '+12%', color = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
      {Icon && (
        <div className={`p-2.5 w-fit rounded-2xl ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
      <p className="text-[11px] text-slate-400 font-medium">{title}</p>
      <h3 className="text-2xl font-black text-slate-900 dark:text-white">{value}</h3>
      {trend && (
        <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
          <ArrowUpRight className="w-3 h-3" /> {trend} vs last period
        </p>
      )}
    </div>
  );
}