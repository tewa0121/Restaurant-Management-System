
import React from 'react';
import { Menu, Search, Sun, Maximize2, Bell } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-slate-600 dark:text-slate-300 transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-700/60 text-slate-800 dark:text-white placeholder-slate-400 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden lg:block text-sm text-slate-500 dark:text-slate-300">
          {today}
        </span>

        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl"
          title="Theme"
        >
          <Sun className="w-5 h-5" />
        </button>

        <button
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl"
          title="Fullscreen"
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen?.();
            } else {
              document.exitFullscreen?.();
            }
          }}
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>

        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {user.name || 'Admin User'}
            </h4>
            <p className="text-[10px] text-slate-400">
              {user.role || 'Administrator'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
