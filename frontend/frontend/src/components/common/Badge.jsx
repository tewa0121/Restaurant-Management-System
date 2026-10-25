import React from 'react';

export default function Badge({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'
  size = 'md',        // 'sm' | 'md'
  dot = false,
  className = ''
}) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    success: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border-amber-200 dark:border-amber-800/60',
    danger: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 border-rose-200 dark:border-rose-800/60',
    info: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 border-sky-200 dark:border-sky-800/60',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400 border-purple-200 dark:border-purple-800/60'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs'
  };

  const dotColors = {
    default: 'bg-slate-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-sky-500',
    purple: 'bg-purple-500'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-bold rounded-lg border ${variants[variant]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}