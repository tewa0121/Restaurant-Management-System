import React, { useState } from 'react';
import { Search, ShoppingBag, Bell, User, UtensilsCrossed, Globe, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerHeader({ cartCount = 2, tableNumber = 'Table 12' }) {
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  return (
    <header className="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
      {/* Brand & Table Badge */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('/customer/menu')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#52C41A] flex items-center justify-center text-white font-black shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h1 className="font-black text-slate-900 text-base leading-none tracking-tight">
              Resto<span className="text-[#52C41A]">Dine</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">Digital Menu</p>
          </div>
        </button>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#52C41A] text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          {tableNumber}
        </span>
      </div>

      {/* Center Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search dishes, drinks, or desserts..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#52C41A] outline-none transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Language Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setLangOpen(!langOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{currentLang}</span>
          </button>

          {langOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 p-1 z-50">
              {['EN', 'AM', 'FR', 'ES'].map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => {
                    setCurrentLang(lang);
                    setLangOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                    currentLang === lang ? 'bg-emerald-50 text-[#52C41A] font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {lang === 'EN' ? 'English' : lang === 'AM' ? 'Amharic' : lang === 'FR' ? 'French' : 'Spanish'}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button
          type="button"
          onClick={() => navigate('/customer/notifications')}
          className="p-2 rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-50 transition relative cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={() => navigate('/customer/cart')}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#52C41A] text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="hidden sm:inline">My Cart</span>
          {cartCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] bg-white text-[#52C41A] rounded-full font-black">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={() => navigate('/customer/profile')}
          className="p-1.5 rounded-xl border border-slate-200/80 hover:bg-slate-50 transition cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-600" />
        </button>
      </div>
    </header>
  );
}