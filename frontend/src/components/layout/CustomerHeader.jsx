import React from 'react';
import { Search, MapPin, Bell, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerHeader() {
  const { cartItems } = useCart();

  return (
    <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-20 flex-shrink-0">
      
      {/* Search Input Box */}
      <div className="flex-1 max-w-md relative">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Search for food, drinks, cuisines..." 
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-green-500 font-medium"
        />
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center gap-5">
        
        {/* Location Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <MapPin size={16} className="text-green-600" />
          <div className="text-left">
            <span className="text-gray-400 block text-[10px] leading-tight">Deliver to</span>
            <span className="font-bold text-gray-800">Home - 123 Main St</span>
          </div>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-gray-600">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-green-600 rounded-full"></span>
        </button>

        {/* User Login / Profile Button */}
        <button className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-1.5 hover:bg-gray-50 transition-colors text-xs font-bold text-gray-800">
          <User size={16} className="text-gray-600" />
          <span>Login / Sign Up</span>
        </button>

      </div>
    </header>
  );
}