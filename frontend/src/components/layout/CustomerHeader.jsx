import React, { useState } from 'react';
import { Search, MapPin, Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerHeader({ user, onSearch }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAddress, setSelectedAddress] = useState('Home - 123 Main St');
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);

  const addresses = [
    'Home - 123 Main St',
    'Office - 456 Market St, Suite 200',
    'Gym - 789 Fitness Ave'
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between gap-4 w-full shadow-xs">
      
      {/* 1. Search Bar */}
      <div className="relative flex-1 max-w-xl">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search for food, drinks, cuisines..."
          className="w-full bg-gray-50 border border-gray-200 text-xs font-medium text-gray-800 placeholder-gray-400 rounded-2xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
        />
      </div>

      {/* Right Action Items */}
      <div className="flex items-center gap-3 shrink-0">

        {/* 2. Deliver To Address Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAddressDropdown(!showAddressDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-50 text-left transition-colors cursor-pointer group"
          >
            <div className="p-2 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-100 transition-colors">
              <MapPin size={18} />
            </div>
            <div className="hidden sm:block">
              <span className="text-[10px] text-gray-400 font-medium block leading-none mb-0.5">
                Deliver to
              </span>
              <span className="text-xs font-bold text-gray-900 leading-tight block truncate max-w-[150px]">
                {selectedAddress}
              </span>
            </div>
          </button>

          {/* Address Dropdown Menu */}
          {showAddressDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Select Saved Address
              </div>
              {addresses.map((addr, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddressDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-xs transition-colors flex items-center gap-2 ${
                    selectedAddress === addr
                      ? 'bg-green-50 text-green-700 font-bold'
                      : 'text-gray-700 hover:bg-gray-50 font-medium'
                  }`}
                >
                  <MapPin size={14} className={selectedAddress === addr ? 'text-green-600' : 'text-gray-400'} />
                  <span className="truncate">{addr}</span>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1 px-2">
                <button
                  onClick={() => {
                    setShowAddressDropdown(false);
                    navigate('/customer/address-book');
                  }}
                  className="w-full text-center text-xs text-green-600 font-bold py-1.5 hover:underline"
                >
                  + Add New Address
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. Notification Icon with Dot */}
        <button
          onClick={() => setHasNotifications(false)}
          className="relative p-2.5 bg-gray-50 border border-gray-100 text-gray-600 hover:bg-gray-100 rounded-2xl transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          {hasNotifications && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </button>

        {/* 4. Login / Sign Up or User Profile Button */}
        {user ? (
          <button
            onClick={() => navigate('/customer/profile')}
            className="flex items-center gap-2 border border-gray-200 px-3.5 py-2 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer"
          >
            <User size={16} className="text-gray-700" />
            <span className="text-xs font-bold text-gray-800">{user.name || 'Account'}</span>
          </button>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-2xl hover:bg-gray-50 text-gray-900 font-bold text-xs transition-all cursor-pointer"
          >
            <User size={16} className="text-gray-800" />
            <span>Login / Sign Up</span>
          </button>
        )}

      </div>
    </header>
  );
}