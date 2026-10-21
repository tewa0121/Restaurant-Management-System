// src/components/layout/WaiterLayout.jsx
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  UtensilsCrossed,
  PlusCircle,
  ShoppingBag,
  History,
  Grid,
  CalendarDays,
  Users,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  Search,
  Calendar,
  ChevronRight,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function WaiterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // TOP BAR INTERACTIVE STATES
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2025-05-20');

  // LIVE UNREAD NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Order #ORD-1248 from Table 12 is ready to serve.', time: '2 min ago', read: false },
    { id: 2, text: 'New request from Table 7: Extra Napkins', time: '2 min ago', read: false },
    { id: 3, text: 'Reservation for Table 8 at 7:00 PM', time: '15 min ago', read: false },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = (e) => {
    e.stopPropagation();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login', { replace: true });
  };

  const navSections = [
    {
      items: [
        { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'ORDER MANAGEMENT',
      items: [
        { label: 'My Tables', path: 'my-tables', icon: UtensilsCrossed },
        { label: 'New Order', path: 'new-order', icon: PlusCircle },
        { label: 'Orders', path: 'orders', icon: ShoppingBag },
        { label: 'Order History', path: 'order-history', icon: History }
      ]
    },
    {
      title: 'TABLE MANAGEMENT',
      items: [
        { label: 'Tables', path: 'tables', icon: Grid },
        { label: 'Reservations', path: 'reservations', icon: CalendarDays }
      ]
    },
    {
      title: 'CUSTOMER',
      items: [
        { label: 'Customers', path: 'customers', icon: Users },
        { label: 'Customer Requests', path: 'customer-requests', icon: Bell }
      ]
    },
    {
      title: 'OTHER',
      items: [
        { label: 'Notifications', path: 'notifications', icon: Bell },
        { label: 'My Profile', path: 'profile', icon: User },
        { label: 'Settings', path: 'settings', icon: Settings }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <aside 
        className={`${
          sidebarOpen ? 'w-[260px]' : 'w-0 -ml-[260px] md:w-20 md:ml-0'
        } bg-[#0B172A] text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out select-none z-30`}
      >
        <div className="p-5 space-y-5 overflow-y-auto custom-scrollbar">
          {/* Logo Branding */}
          <div className="flex items-center gap-3 px-1 py-1">
            <div className="w-9 h-9 rounded-full border-2 border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold bg-emerald-950/20 shrink-0">
              <UtensilsCrossed className="w-5 h-5 text-emerald-400" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="font-extrabold text-white text-lg tracking-tight leading-tight">
                  Resto<span className="text-emerald-400">Waiter</span>
                </h2>
                <p className="text-[10px] text-slate-400 font-medium">Restaurant Management System</p>
              </div>
            )}
          </div>

          {/* Nav Groups */}
          <nav className="space-y-4 pt-1">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="space-y-1">
                {section.title && sidebarOpen && (
                  <p className="text-[10px] font-bold text-slate-400/70 tracking-wider uppercase px-3 pt-2 pb-1">
                    {section.title}
                  </p>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) => `
                        flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150
                        ${isActive 
                          ? 'bg-[#52C41A] text-white font-bold shadow-md shadow-emerald-950/40' 
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'}
                      `}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                          </div>
                          {sidebarOpen && !isActive && <ChevronRight className="w-3.5 h-3.5 opacity-40" />}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            ))}

            {/* Logout Option */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-rose-950/30 hover:text-rose-400 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4 shrink-0" />
                {sidebarOpen && <span>Logout</span>}
              </div>
            </button>
          </nav>
        </div>

        {/* User Card at Bottom */}
        {sidebarOpen && (
          <div className="p-4 m-3 rounded-2xl bg-[#070F1E] border border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                  alt="David Waiter"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#070F1E] rounded-full" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user?.name || 'David Waiter'}</p>
                <p className="text-[10px] text-slate-400 font-medium">Waiter</p>
                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-400 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* MAIN RIGHT SECTION */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOP HEADER BAR */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between shrink-0 z-20 relative">
          <div className="flex items-center gap-4 flex-1 max-w-lg">
            {/* 1. WORKING MENU TOGGLE ICON BUTTON */}
            <button
              type="button"
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              title="Toggle Navigation Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/70 rounded-xl text-xs font-medium text-slate-700 placeholder-slate-400 border border-transparent focus:bg-white focus:border-slate-300 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* 2. WORKING DATE PICKER BADGE */}
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
                  <span className="block text-[11px] font-bold leading-tight">May 20, 2025</span>
                  <span className="block text-[9px] text-slate-400 font-normal leading-none">Tuesday</span>
                </div>
              </button>

              {/* Date Selector Popover */}
              {datePickerOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 space-y-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                      setSelectedDate(e.target.value);
                      setDatePickerOpen(false);
                    }}
                    className="w-full text-xs font-medium p-2 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Filter dashboard calculations for specific dates.</p>
                </div>
              )}
            </div>

            {/* 3. WORKING NOTIFICATION BELL & DROPDOWN */}
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

              {/* Notification Popup Menu */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-4 space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-emerald-500" /> Notifications
                    </h4>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs space-y-1 transition-all ${
                          n.read ? 'bg-slate-50 opacity-60' : 'bg-emerald-50/70 border border-emerald-100'
                        }`}
                      >
                        <p className="font-semibold text-slate-800 leading-snug">{n.text}</p>
                        <p className="text-[9px] text-slate-400">{n.time}</p>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      navigate('/waiter/notifications');
                    }}
                    className="w-full text-center py-1.5 text-xs font-bold text-blue-600 hover:underline border-t border-slate-100 pt-2 block cursor-pointer"
                  >
                    View All Notifications →
                  </button>
                </div>
              )}
            </div>

            {/* 4. WORKING TOP RIGHT PROFILE DROPDOWN MENU */}
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
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                  alt="David Waiter"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-tight">David Waiter</p>
                  <p className="text-[10px] text-slate-400 font-medium leading-none">Waiter</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Options */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 space-y-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/waiter/profile');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <User className="w-4 h-4 text-emerald-500" />
                    <span>My Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      navigate('/waiter/settings');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-blue-500" />
                    <span>Waiter Settings</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* DASHBOARD CONTENT OUTLET */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}