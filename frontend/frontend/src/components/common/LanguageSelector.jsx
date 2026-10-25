import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector({ currentLang = 'EN', onLanguageChange }) {
  const [open, setOpen] = useState(false);
  const languages = [
    { code: 'EN', name: 'English' },
    { code: 'AM', name: 'Amharic' },
    { code: 'FR', name: 'French' },
    { code: 'ES', name: 'Spanish' }
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span>{currentLang}</span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                if (onLanguageChange) onLanguageChange(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                currentLang === lang.code
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-[#52C41A] font-bold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}