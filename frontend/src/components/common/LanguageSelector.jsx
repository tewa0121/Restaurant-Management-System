import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('English');

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'am', name: 'አማርኛ (Amharic)' }
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 bg-white shadow-sm transition"
      >
        <Globe className="w-4 h-4 text-gray-500" />
        <span>{currentLang}</span>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setCurrentLang(lang.name);
                setIsOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center justify-between"
            >
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}