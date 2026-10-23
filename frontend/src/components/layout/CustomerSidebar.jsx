import React from 'react';
import { NavLink } from 'react-router-dom';
import { Utensils, Flame, Sparkles, Coffee, Cake, ShoppingBag, Clock, Heart } from 'lucide-react';

export default function CustomerSidebar() {
  const categories = [
    { label: 'All Dishes', path: '/customer/menu', icon: Utensils },
    { label: 'Popular & Hot', path: '/customer/menu?cat=popular', icon: Flame },
    { label: 'Chef Specials', path: '/customer/menu?cat=specials', icon: Sparkles },
    { label: 'Drinks & Beverages', path: '/customer/menu?cat=drinks', icon: Coffee },
    { label: 'Desserts', path: '/customer/menu?cat=desserts', icon: Cake }
  ];

  const personalLinks = [
    { label: 'My Orders', path: '/customer/orders', icon: ShoppingBag },
    { label: 'Order History', path: '/customer/history', icon: Clock },
    { label: 'Favorites', path: '/customer/favorites', icon: Heart }
  ];

  return (
    <aside className="p-4 space-y-6 select-none">
      {/* Menu Categories */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Categories
        </p>
        {categories.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${isActive ? 'bg-emerald-50 text-[#52C41A] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Account & Orders */}
      <div className="space-y-1 pt-2 border-t border-slate-100">
        <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
          Personal
        </p>
        {personalLinks.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all
                ${isActive ? 'bg-emerald-50 text-[#52C41A] font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}