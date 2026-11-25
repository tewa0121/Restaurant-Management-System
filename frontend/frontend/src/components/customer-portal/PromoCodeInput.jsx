import React, { useState } from 'react';
import { Tag, CheckCircle2 } from 'lucide-react';

export default function PromoCodeInput({ onApplyCode }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);

  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    setApplied(true);
    if (onApplyCode) onApplyCode(code);
  };

  return (
    <form onSubmit={handleApply} className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
        Have a Promo Code?
      </label>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setApplied(false);
            }}
            placeholder="Enter RESTO20"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition shrink-0"
        >
          Apply
        </button>
      </div>
      {applied && (
        <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" /> Code "{code.toUpperCase()}" applied successfully!
        </p>
      )}
    </form>
  );
}