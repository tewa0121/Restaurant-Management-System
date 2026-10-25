import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Utensils, Home, Grid, Tag, ShoppingBag, Heart, Clock, User, BookOpen, HelpCircle 
} from 'lucide-react';

export default function CustomerSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Home', icon: Home, path: '/customer' },
    { label: 'Browse Menu', icon: Utensils, path: '/customer/menu' },
    { label: 'Categories', icon: Grid, path: '/customer/categories' },
    { label: 'Offers & Deals', icon: Tag, path: '/customer/offers' },
    { label: 'My Orders', icon: ShoppingBag, path: '/customer/orders' },
    { label: 'Favorites', icon: Heart, path: '/customer/favorites' },
    { label: 'Track Order', icon: Clock, path: '/customer/track-order' },
    { label: 'Profile', icon: User, path: '/customer/profile' },
    { label: 'Address Book', icon: BookOpen, path: '/customer/addresses' },
    { label: 'Help & Support', icon: HelpCircle, path: '/customer/help' },
  ];

  return (
    <aside className="w-64 min-w-[16rem] max-w-[16rem] bg-white dark:bg-[#0B1426] border-r border-gray-100 dark:border-gray-800 p-5 flex flex-col justify-between shrink-0 h-full">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div 
          onClick={() => navigate('/customer')} 
          className="flex items-center gap-3 px-2 cursor-pointer"
        >
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white font-black shadow-xs shrink-0">
            <Utensils size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="font-black text-emerald-600 text-lg tracking-tight leading-none truncate">RestoDelight</h1>
            <span className="text-[10px] text-gray-400 font-medium truncate block">Good Food, Great Time</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Promo Banner Card */}
      <div className="bg-emerald-50/60 dark:bg-gray-800/80 p-4 rounded-2xl border border-emerald-100 dark:border-gray-700 text-center space-y-2 shrink-0">
        <div className="w-12 h-12 mx-auto">
          <img src="/assets/food-placeholders/gift-box.png" alt="Gift" className="w-full h-full object-contain" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <div>
          <h4 className="font-black text-xs text-gray-900 dark:text-white">Get 10% OFF</h4>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">on your first order</p>
        </div>
        <button 
          onClick={() => navigate('/customer/menu')} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          Order Now
        </button>
      </div>
    </aside>
  );
}