<<<<<<< HEAD
// src/components/manager/ManagerLayout.jsx
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Utensils, Calendar, ShoppingBag, 
  UtensilsCrossed, PackageCheck, Users, Truck, 
  BarChart2, FileText, History, Settings, User, 
  Sun, Moon, Bell, ZoomIn, ZoomOut, LogOut, Menu, Search, ChevronRight
} from 'lucide-react';

export default function ManagerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Sidebar Toggle State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  // 3. Zoom Level State
  const [zoomLevel, setZoomLevel] = useState(100);

  // 4. Notifications Dropdown State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Low stock alert: Chicken Breast', time: '10m ago', unread: true },
    { id: 2, text: 'New table reservation #RES-402', time: '25m ago', unread: true },
    { id: 3, text: 'Order #ORD-1250 completed successfully', time: '1h ago', unread: false },
  ]);

  // 5. Profile Popover States
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isTopProfileOpen, setIsTopProfileOpen] = useState(false);

  // Apply Dark Mode class to root HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 10, 130));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 10, 80));

  const markNotificationsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  // Exact real date format: "Monday | October 19, 2026"
  const today = new Date();
  const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);
  const monthDayYear = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(today);
  const currentDateString = `${weekday} | ${monthDayYear}`;

  const menuSections = [
    {
      category: 'OPERATIONS',
      items: [
        { id: 'dashboard', path: '/manager/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'orders', path: '/manager/orders', label: 'Orders', icon: ShoppingBag },
        { id: 'tables', path: '/manager/table-management', label: 'Table Management', icon: Utensils },
        { id: 'reservations', path: '/manager/reservations', label: 'Reservations', icon: Calendar },
        { id: 'menu', path: '/manager/menu-management', label: 'Menu Management', icon: UtensilsCrossed },
        { id: 'inventory', path: '/manager/inventory-management', label: 'Inventory Management', icon: PackageCheck },
      ]
    },
    {
      category: 'MANAGEMENT',
      items: [
        { id: 'employees', path: '/manager/employees', label: 'Employees', icon: Users },
        { id: 'customers', path: '/manager/customers', label: 'Customers', icon: User },
        { id: 'suppliers', path: '/manager/suppliers', label: 'Suppliers', icon: Truck },
      ]
    },
    {
      category: 'REPORTS & ANALYTICS',
      items: [
        { id: 'reports', path: '/manager/reports', label: 'Reports', icon: FileText },
        { id: 'sales', path: '/manager/sales-and-revenue', label: 'Sales & Revenue', icon: BarChart2 },
        { id: 'analytics', path: '/manager/analytics', label: 'Analytics', icon: BarChart2 },
      ]
    },
    {
      category: 'SYSTEM',
      items: [
        { id: 'settings', path: '/manager/settings', label: 'Settings', icon: Settings },
        { id: 'activity', path: '/manager/activity-log', label: 'Activity Log', icon: History },
      ]
    }
  ];

  return (
    <div style={{ zoom: `${zoomLevel}%` }} className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-all overflow-hidden">
      
      {/* Sidebar Navigation */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[#0B132B] text-slate-300 border-r border-slate-800 flex flex-col justify-between shrink-0 transition-all duration-300 select-none`}>
        
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white font-black flex items-center justify-center text-base shadow-lg shadow-emerald-500/20 shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          {isSidebarOpen && (
            <div className="overflow-hidden">
              <h2 className="font-black text-sm tracking-wide text-white">RestoManager</h2>
              <p className="text-[10px] text-slate-400 font-medium truncate">Restaurant Management System</p>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
          {menuSections.map((section, idx) => (
            <div key={idx} className="space-y-1">
              {isSidebarOpen && (
                <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 mb-2 uppercase">
                  {section.category}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => navigate(item.path)}
                    title={!isSidebarOpen ? item.label : ''}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-bold' 
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {isSidebarOpen && <span className="truncate">{item.label}</span>}
                    </div>
                    {isSidebarOpen && item.id !== 'dashboard' && (
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 opacity-40 ${isActive ? 'opacity-100 text-white' : ''}`} />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Profile Card */}
        <div className="p-3 border-t border-slate-800 bg-[#070D1F] shrink-0 relative">
          <button 
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="w-full flex items-center justify-between p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0 border border-emerald-500/30">
                JM
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden truncate">
                  <h4 className="font-bold text-xs text-white leading-tight truncate">John Manager</h4>
                  <p className="text-[10px] text-slate-400 truncate">Restaurant Manager</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] text-emerald-400 font-medium">Online</span>
                  </div>
                </div>
              )}
            </div>
          </button>

          {isProfileOpen && (
            <div className="absolute bottom-16 left-3 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-2 text-xs text-slate-200">
              <div className="p-2 border-b border-slate-800">
                <p className="font-bold text-white">John Manager</p>
                <p className="text-[10px] text-slate-400 truncate">manager@restomanager.com</p>
              </div>
              <button 
                type="button" 
                onClick={() => { navigate('/manager/settings'); setIsProfileOpen(false); }}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-800 font-medium text-slate-300 flex items-center gap-2 cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" /> Account Settings
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/login')}
                className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 font-semibold flex items-center gap-2 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between shrink-0 z-20">
          
          {/* Left Side: Menu Toggle & Search Bar */}
          <div className="flex items-center gap-4 w-1/3">
            <button 
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Toggle Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-xs">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Right Side: Real-Time Date Widget, Notifications, Zoom, Theme, & Interactive Top Profile */}
          <div className="flex items-center gap-3">
            
            {/* Real-Time Date Widget Badge matching design reference */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
              <Calendar className="w-4 h-4 text-emerald-500" />
              <span>{currentDateString}</span>
            </div>

            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-xl">
              <button type="button" onClick={handleZoomOut} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer" title="Zoom Out">
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] font-bold text-slate-400 w-9 text-center">{zoomLevel}%</span>
              <button type="button" onClick={handleZoomIn} className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 cursor-pointer" title="Zoom In">
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                type="button"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 relative cursor-pointer transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.some(n => n.unread) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              {isNotificationsOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
                  <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">Notifications</h4>
                    <button type="button" onClick={markNotificationsRead} className="text-[10px] text-emerald-600 font-semibold hover:underline">Mark read</button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700/50 text-[11px] space-y-0.5">
                        <p className="font-medium text-slate-700 dark:text-slate-200">{n.text}</p>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Light / Dark Mode Toggle */}
            <button 
              type="button" 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Interactive Top-Right User Profile Header */}
            <div className="relative pl-2 border-l border-slate-200 dark:border-slate-700">
              <button 
                type="button"
                onClick={() => setIsTopProfileOpen(!isTopProfileOpen)}
                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer text-left"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold flex items-center justify-center text-xs shadow-sm">
                  JM
                </div>
                <div className="hidden sm:block leading-tight">
                  <h4 className="font-bold text-xs text-slate-800 dark:text-white">John Manager</h4>
                  <p className="text-[10px] text-slate-400">Restaurant Manager</p>
                </div>
              </button>

              {/* Top Profile Popover Modal */}
              {isTopProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2 text-xs">
                  <div className="p-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="font-bold text-slate-800 dark:text-white">John Manager</p>
                    <p className="text-[10px] text-slate-400 truncate">manager@restomanager.com</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => { navigate('/manager/settings'); setIsTopProfileOpen(false); }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 font-medium text-slate-600 dark:text-slate-300 flex items-center gap-2 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" /> Account Settings
                  </button>
                  <button 
                    type="button" 
                    onClick={() => navigate('/login')}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>
=======
import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function ManagerLayout({ children }) {
  return (
    // 👇 h-screen w-screen forces full width
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Sidebar is fixed width (w-64 inside Sidebar.jsx) */}
      <Sidebar />

      {/* Main Content Area takes the rest of the space */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        {/* 👇 Make sure this is overflow-y-auto and w-full */}
        <main className="flex-1 overflow-y-auto w-full p-6">
          {children}
        </main>
      </div>
      
>>>>>>> origin/developer
    </div>
  );
}