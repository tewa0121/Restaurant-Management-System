// frontend/src/components/common/Header.jsx
import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const today = new Date().toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <button className="text-gray-500 hover:text-gray-700">
          <Menu size={20} />
        </button>
        <div className="relative w-96 hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
          <span>{today}</span>
        </div>

        <button className="relative text-gray-500 hover:text-gray-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
            {user.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{user.role || 'Administrator'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}