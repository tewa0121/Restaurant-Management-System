import React, { useState } from 'react';
import { Menu, Search, Calendar, Bell, ChevronDown, X, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header({
  onToggleSidebar,
  searchPlaceholder = 'Search anything...',
  selectedDate,
  onDateChange,
  notifications = [],
  onMarkAllRead,
  user,
  onLogout,
  profileLinks = []
}) {
  const navigate = useNavigate();
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-20 relative">
      <div className="flex items-center gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
          title="Toggle Navigation Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/70 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 border border-transparent focus:bg-white focus:border-slate-300 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Date Picker Widget */}
        {selectedDate && (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setDatePickerOpen(prev => !prev);
                setNotifDropdownOpen(false);
                setProfileDropdownOpen(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/70 border border-slate-200/60 hover:bg-slate-200/60 rounded-xl text-xs font-semibold text-slate-600 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <div>
                <span className="block text-[11px] font-bold leading-tight">{selectedDate}</span>
                <span className="block text-[9px] text-slate-400 font-normal leading-none">Shift Date</span>
              </div>
            </button>

            {datePickerOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-50">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800">Select Shift Date</span>
                  <button type="button" onClick={() => setDatePickerOpen(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    if (onDateChange) onDateChange(e.target.value);
                    setDatePickerOpen(false);
                  }}
                  className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>
            )}
          </div>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifDropdownOpen(prev => !prev);
              setDatePickerOpen(false);
              setProfileDropdownOpen(false);
            }}
            className="relative p-2 bg-slate-100/70 border border-slate-200/60 hover:bg-slate-200/60 rounded-xl text-slate-600 transition-all cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 space-y-3 z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-emerald-500" /> Notifications
                </h4>
                {unreadCount > 0 && onMarkAllRead && (
                  <button type="button" onClick={onMarkAllRead} className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer">
                    Mark as read
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {notifications.map(n => (
                  <div key={n.id} className={`p-2.5 rounded-xl text-xs space-y-1 transition-all ${n.read ? 'bg-slate-50 opacity-60' : 'bg-emerald-50/70 border border-emerald-100'}`}>
                    <p className="font-semibold text-slate-800 leading-snug">{n.text}</p>
                    <p className="text-[9px] text-slate-400">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileDropdownOpen(prev => !prev);
              setDatePickerOpen(false);
              setNotifDropdownOpen(false);
            }}
            className="flex items-center gap-2.5 pl-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all cursor-pointer"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-medium leading-none">{user?.role || 'Staff'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50">
              {profileLinks.map((link, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    navigate(link.path);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  {link.icon} <span>{link.label}</span>
                </button>
              ))}
              {profileLinks.length > 0 && <div className="border-t border-slate-100 my-1" />}
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" /> <span>Logout</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}