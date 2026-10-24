import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function CustomerHeader() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <header className="h-16 bg-white dark:bg-[#0B1426] border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between gap-4 shrink-0">
      
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          placeholder="Search for food, drinks, cuisines..."
          className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white"
        />
        <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-5">
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
          <MapPin size={16} className="text-emerald-600" />
          <span>Deliver to</span>
          <button className="font-extrabold text-gray-900 dark:text-white flex items-center gap-1 hover:underline cursor-pointer">
            Home - 123 Main St <ChevronDown size={14} />
          </button>
        </div>

        <button className="relative p-2 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-600 dark:text-gray-300 cursor-pointer">
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B1426]">2</span>
        </button>

        <button
          onClick={() => navigate(isAuthenticated ? '/customer/profile' : '/login')}
          className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-800 dark:text-white px-3.5 py-2 rounded-xl text-xs font-bold border border-gray-100 dark:border-gray-700 cursor-pointer"
        >
          <User size={15} />
          <span>{isAuthenticated ? 'My Profile' : 'Login / Sign Up'}</span>
        </button>
      </div>

    </header>
  );
}