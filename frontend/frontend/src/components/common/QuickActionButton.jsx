import React from 'react';

export default function QuickActionButton({
  label,
  icon: Icon,
  onClick,
  color = 'emerald', // 'emerald' | 'blue' | 'amber' | 'purple' | 'rose'
  badge
}) {
  const colorSchemes = {
    emerald: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100/80',
    blue: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800/40 hover:bg-blue-100/80',
    amber: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40 hover:bg-amber-100/80',
    purple: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800/40 hover:bg-purple-100/80',
    rose: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/40 hover:bg-rose-100/80'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer text-left w-full ${colorSchemes[color]}`}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span className="text-xs font-bold truncate flex-1">{label}</span>
      {badge && (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white dark:bg-slate-800 shadow-xs border border-current">
          {badge}
        </span>
      )}
    </button>
  );
}