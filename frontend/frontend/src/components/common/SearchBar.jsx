import React from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className = ''
}) {
  return (
    <div className={`relative w-full ${className}`}>
      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2 bg-slate-100/70 dark:bg-slate-800 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-slate-300 dark:focus:border-slate-700 outline-none transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}