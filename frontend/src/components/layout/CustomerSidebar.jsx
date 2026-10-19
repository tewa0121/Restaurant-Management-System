import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, UtensilsCrossed, Grid, Tag, ShoppingBag, Heart, Navigation, 
  User, BookOpen, HelpCircle
} from 'lucide-react';

export default function CustomerSidebar() {
  const menuItems = [
    { name: 'Home', icon: Home, path: '/customer' },
    { name: 'Browse Menu', icon: UtensilsCrossed, path: '/customer/menu' },
    { name: 'Categories', icon: Grid, path: '/customer/categories' },
    { name: 'Offers & Deals', icon: Tag, path: '/customer/offers' },
    { name: 'My Orders', icon: ShoppingBag, path: '/customer/orders' },
    { name: 'Favorites', icon: Heart, path: '/customer/favorites' },
    { name: 'Track Order', icon: Navigation, path: '/customer/track' },
    { name: 'Profile', icon: User, path: '/customer/profile' },
    { name: 'Address Book', icon: BookOpen, path: '/customer/address' },
    { name: 'Help & Support', icon: HelpCircle, path: '/customer/help' },
  ];

  return (
    <aside className="w-full bg-white h-full flex flex-col justify-between py-4">
      
      <div>
        {/* Brand Logo Header */}
        <div className="px-3 pb-4 flex items-center gap-2">
          <div className="bg-green-600 p-1.5 rounded-xl text-white shadow-sm flex items-center justify-center shrink-0">
            <UtensilsCrossed size={16} />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-gray-900 text-xs leading-tight truncate">
              Resto<span className="text-green-600">Delight</span>
            </h1>
            <p className="text-[8px] text-gray-400 font-medium truncate">Good Food, Great Time</p>
          </div>
        </div>

        {/* Navigation Items */}
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/customer'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                    isActive
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon size={14} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Promo Bottom Box */}
      <div className="px-2 mt-auto pt-3">
        <div className="bg-gradient-to-b from-green-50 to-green-100/60 rounded-xl p-2.5 text-center border border-green-100">
          <h4 className="font-extrabold text-gray-900 text-[11px] mb-0.5">Get 10% OFF</h4>
          <p className="text-[9px] text-gray-500 mb-2 font-medium">on your first order</p>
          <button 
            onClick={() => alert("Use promo code 'RESTA10' at checkout to get 10% OFF!")}
            className="bg-green-600 text-white text-[10px] font-bold py-1.5 px-2 rounded-lg w-full hover:bg-green-700 transition-all shadow-sm cursor-pointer"
          >
            Order Now
          </button>
        </div>
      </div>

    </aside>
  );
}