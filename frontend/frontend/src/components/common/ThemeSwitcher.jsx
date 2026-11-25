import React from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeSwitcher({ darkMode, setDarkMode }) {
  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 rounded-xl text-slate-500 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
      title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}