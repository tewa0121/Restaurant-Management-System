import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  User, 
  X, 
  LogOut, 
  ChevronDown,
  Shield,
  CheckCircle2
} from 'lucide-react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  // Theme & Interactive Drawers State
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Detect Active User Role
  const isCashier = path.startsWith('/cashier');
  const isWaiter = path.startsWith('/waiter');
  const isKitchen = path.startsWith('/kitchen');
  const isManager = path.startsWith('/manager');
  const isAdmin = path.startsWith('/admin');

  // Role Profile Configurations with Unique Profile Images
  const userProfiles = {
    cashier: {
      name: 'Michael Cashier',
      role: 'Counter Staff',
      initials: 'MC',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-emerald-500'
    },
    waiter: {
      name: 'Sarah Waiter',
      role: 'Floor Staff',
      initials: 'SW',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-sky-500'
    },
    kitchen: {
      name: 'Chef Alex',
      role: 'Head Chef (KDS)',
      initials: 'CA',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-amber-500'
    },
    manager: {
      name: 'David Manager',
      role: 'General Manager',
      initials: 'DM',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-purple-500'
    },
    admin: {
      name: 'Super Admin',
      role: 'System Administrator',
      initials: 'SA',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-rose-500'
    },
    customer: {
      name: 'Emma Guest',
      role: 'Loyalty Member',
      initials: 'EG',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      badgeColor: 'bg-teal-500'
    }
  };

  const activeProfile = isCashier
    ? userProfiles.cashier
    : isWaiter
    ? userProfiles.waiter
    : isKitchen
    ? userProfiles.kitchen
    : isManager
    ? userProfiles.manager
    : isAdmin
    ? userProfiles.admin
    : userProfiles.customer;

  // Global Dark Mode Sync
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle Search Input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim().length > 1) {
      setSearchResults([
        { type: 'Bill', label: `Invoice #${query}`, path: '/cashier/receipts' },
        { type: 'Table', label: `Table #${query}`, path: '/cashier/active-bills' },
        { type: 'Customer', label: `Search guest "${query}"`, path: '/cashier/customers' }
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <header className="h-16 bg-white dark:bg-[#0B1426] border-b border-gray-100 dark:border-gray-800 px-4 sm:px-6 flex items-center justify-between shrink-0 transition-colors duration-200 relative z-40">
      
      {/* 1. GLOBAL SEARCH */}
      <div className="relative w-64 sm:w-80">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition-colors"
        />

        {searchResults.length > 0 && (
          <div className="absolute top-12 left-0 w-full bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-2 space-y-1 z-50">
            <span className="text-[10px] font-bold text-gray-400 px-2 uppercase tracking-wider block">Results</span>
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  navigate(res.path);
                }}
                className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800/60 rounded-xl cursor-pointer flex items-center justify-between text-xs"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-200">{res.label}</span>
                <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                  {res.type}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. CONTROLS & DYNAMIC USER PROFILE */}
      <div className="flex items-center gap-3">
        
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all cursor-pointer"
          title="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
        </button>

        {/* Notifications Drawer Toggle */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all relative cursor-pointer"
          >
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-4 space-y-3 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-bold text-xs text-gray-900 dark:text-white">System Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="p-2.5 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                  <span className="font-bold text-gray-900 dark:text-white block">New Bill Created</span>
                  <p className="text-gray-500 dark:text-gray-400 text-[11px] mt-0.5">Table #8 created a new order</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar & Drawer */}
        <div className="relative border-l border-gray-100 dark:border-gray-800 pl-3">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 cursor-pointer focus:outline-none group"
          >
            {/* User Profile Avatar Image with Status Badge */}
            <div className="relative">
              <img
                src={activeProfile.avatar}
                alt={activeProfile.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-500/20 group-hover:ring-emerald-500/50 transition-all shadow-2xs"
              />
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${activeProfile.badgeColor} rounded-full ring-2 ring-white dark:ring-[#0B1426]`}></span>
            </div>

            {/* Profile Info Text */}
            <div className="hidden sm:block text-left">
              <span className="block text-xs font-bold text-gray-900 dark:text-white leading-none">
                {activeProfile.name}
              </span>
              <span className="text-[10px] text-gray-400 font-medium mt-0.5 block">
                {activeProfile.role}
              </span>
            </div>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" />
          </button>

          {/* Profile Flyout Drawer */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-60 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl p-3 space-y-3 z-50 text-xs">
              
              {/* User Details */}
              <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <img
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <span className="font-bold text-gray-900 dark:text-white block truncate">{activeProfile.name}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">{activeProfile.role}</span>
                </div>
              </div>

              {/* Quick Role Switcher */}
              <div className="space-y-1 pt-1 border-t border-gray-100 dark:border-gray-800">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-1 mb-1">Switch User Role</span>
                
                <button
                  onClick={() => { navigate('/cashier/dashboard'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between"
                >
                  <span>Cashier Module</span>
                  {isCashier && <CheckCircle2 size={12} className="text-emerald-500" />}
                </button>

                <button
                  onClick={() => { navigate('/waiter/dashboard'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between"
                >
                  <span>Waiter Module</span>
                  {isWaiter && <CheckCircle2 size={12} className="text-emerald-500" />}
                </button>

                <button
                  onClick={() => { navigate('/kitchen/dashboard'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between"
                >
                  <span>Kitchen Module</span>
                  {isKitchen && <CheckCircle2 size={12} className="text-emerald-500" />}
                </button>

                <button
                  onClick={() => { navigate('/manager/dashboard'); setShowProfileMenu(false); }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 font-semibold flex items-center justify-between"
                >
                  <span>Manager Module</span>
                  {isManager && <CheckCircle2 size={12} className="text-emerald-500" />}
                </button>
              </div>

              {/* Logout Action */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-rose-600 dark:text-rose-400 font-bold flex items-center gap-2 cursor-pointer"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </header>
  );
}