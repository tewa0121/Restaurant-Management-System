// src/components/common/Header.jsx
import React from 'react';
import { Menu, Search, Sun, Maximize2, Bell } from 'lucide-react';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        {/* Hamburger Menu Icon beside Search */}
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
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
          <Sun className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
          <Maximize2 className="w-5 h-5" />
        </button>
        <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            5
          </span>
        </button>
        
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
            alt="Admin User"
            className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden sm:block text-left">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">Admin User</h4>
            <p className="text-[10px] text-slate-400">Super Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}