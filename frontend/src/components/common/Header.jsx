import React, { useState } from 'react';
import { Search, Bell, ShoppingBag, Sun, Moon, X } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';

export default function CustomerHeader({ onOpenCart }) {
  const { cart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  // Live item count for cart badge
  const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    // Add real-time filter logic or callback dispatch here if needed
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-[#0B1426]/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between gap-4 shrink-0 sticky top-0 z-40 font-sans transition-colors duration-200">
      
      {/* 1. FUNCTIONAL SEARCH BAR */}
      <div className="relative flex-1 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for food, drinks, cuisines..."
          className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
        />
        {searchQuery ? (
          <button
            onClick={clearSearch}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
          >
            <X size={14} />
          </button>
        ) : (
          <Search size={15} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        )}
      </div>

      {/* 2. RIGHT ACTION CONTROLS */}
      <div className="flex items-center gap-3">
        
        {/* LIGHT / DARK THEME TOGGLE */}
        <button
          onClick={toggleTheme}
          className="p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 rounded-xl text-gray-600 dark:text-amber-400 transition-all cursor-pointer flex items-center justify-center"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* NOTIFICATIONS */}
        <button
          onClick={() => alert('No new notifications')}
          className="relative p-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700/80 rounded-xl text-gray-600 dark:text-gray-300 transition-all cursor-pointer flex items-center justify-center"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B1426]">
            2
          </span>
        </button>

        {/* MY CART ICON BUTTON WITH LIVE BADGE COUNTER */}
        <button
          onClick={onOpenCart}
          className="relative p-2.5 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 rounded-xl transition-all cursor-pointer flex items-center gap-2"
          title="My Cart"
        >
          <ShoppingBag size={18} />
          <span className="hidden md:inline font-bold text-xs">My Cart</span>
          {totalItemsCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white dark:border-[#0B1426]">
              {totalItemsCount}
            </span>
          )}
        </button>

      </div>

    </header>
  );
}