
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Store,
  Settings,
  UtensilsCrossed,
  Grid,
  ShoppingBag,
  Calendar,
  UserCheck,
  UserCog,
  Box,
  Truck,
  CreditCard,
  BarChart3,
  FileText,
  MoreVertical,
  Bell,
  Search,
  Sun,
  Moon,
  Maximize,
  Minimize,
  LogOut,
  User as UserIcon,
} from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      desc: 'Order #ORD-1251 placed from Table 1',
      time: '5m ago',
      unread: true,
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      desc: 'Tomato ingredient is running low (5 kg left)',
      time: '15m ago',
      unread: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Keep the document theme synchronized with the selected mode.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);

    return () => {
      document.documentElement.classList.remove('dark');
    };
  }, [darkMode]);

  // Toggle dark mode.
  const toggleDarkMode = () => {
    setDarkMode((previous) => !previous);
  };

  // Toggle fullscreen.
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Unable to toggle fullscreen:', error);
    }
  };

  // Keep the fullscreen button synchronized with browser state.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  const navItems = [
    {
      name: 'Dashboard',
      path: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    { type: 'header', label: 'MANAGEMENT' },
    {
      name: 'Users & Roles',
      path: '/admin/users-and-roles',
      icon: Users,
    },
    {
      name: 'Restaurants',
      path: '/admin/restaurants',
      icon: Store,
    },
    {
      name: 'Settings',
      path: '/admin/settings',
      icon: Settings,
    },
    {
      name: 'Menu Management',
      path: '/admin/menu-management',
      icon: UtensilsCrossed,
    },
    {
      name: 'Table Management',
      path: '/admin/table-management',
      icon: Grid,
    },
    {
      name: 'Order Management',
      path: '/admin/order-management',
      icon: ShoppingBag,
    },
    {
      name: 'Reservation Management',
      path: '/admin/reservation-management',
      icon: Calendar,
    },
    {
      name: 'Customer Management',
      path: '/admin/customer-management',
      icon: UserCheck,
    },
    {
      name: 'Employee Management',
      path: '/admin/employee-management',
      icon: UserCog,
    },
    {
      name: 'Inventory Management',
      path: '/admin/inventory-management',
      icon: Box,
    },
    {
      name: 'Supplier Management',
      path: '/admin/supplier-management',
      icon: Truck,
    },
    {
      name: 'Delivery Management',
      path: '/admin/delivery-management',
      icon: Truck,
    },
    {
      name: 'Payment Management',
      path: '/admin/payment-management',
      icon: CreditCard,
    },
    { type: 'header', label: 'ANALYTICS & REPORTS' },
    {
      name: 'Reports & Analytics',
      path: '/admin/reports-and-analytics',
      icon: BarChart3,
    },
    {
      name: 'Logs & Activity',
      path: '/admin/logs-and-activity',
      icon: FileText,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-gray-50 dark:bg-[#0b1d3a] text-gray-800 dark:text-gray-100 transition-colors">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0b1d3a] text-gray-300 flex flex-col justify-between hidden md:flex shrink-0 shadow-xl z-20 border-r border-gray-800/60">
        <div>
          <div className="flex items-center space-x-3 px-6 py-6 border-b border-gray-800/60">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-white font-black text-xl shadow-lg">
              🍽️
            </div>

            <div>
              <h2 className="text-white font-extrabold text-base tracking-wide">
                RestoAdmin
              </h2>
              <p className="text-[10px] text-gray-400 font-medium">
                Restaurant Management System
              </p>
            </div>
          </div>

          <nav className="px-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] custom-scrollbar">
            {navItems.map((item, index) => {
              if (item.type === 'header') {
                return (
                  <p
                    key={index}
                    className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest px-4 pt-4 pb-2"
                  >
                    {item.label}
                  </p>
                );
              }

              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={index}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand text-white shadow-md shadow-brand/30'
                      : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Profile Footer in Sidebar */}
        <div className="p-4 border-t border-gray-800/60 bg-[#070d1f]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                alt="Admin"
                className="w-9 h-9 rounded-full object-cover border border-gray-700"
              />

              <div>
                <h4 className="text-xs font-bold text-white">
                  System Administrator
                </h4>
                <p className="text-[10px] text-gray-400">
                  admin@resto.com
                </p>
              </div>
            </div>

            <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50 dark:bg-[#0b1d3a] transition-colors">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#122448] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 shrink-0 z-30 transition-colors">
          <div className="flex items-center space-x-4 w-96">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

              <input
                type="text"
                placeholder="Search everything..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 relative">
            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={toggleDarkMode}
              title={
                darkMode ? 'Switch to Sunny Mode' : 'Switch to Dark Mode'
              }
              className="p-2 rounded-xl text-gray-500 dark:text-amber-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              {darkMode ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {/* Fullscreen Toggle */}
            <button
              type="button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfileMenu(false);
                }}
                className="p-2 rounded-xl text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition relative cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />

                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#122448] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 px-4 z-50 text-gray-800 dark:text-gray-100">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-2 mb-3">
                    <h4 className="text-xs font-extrabold uppercase">
                      Notifications
                    </h4>

                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setNotifications((previous) =>
                            previous.map((notification) => ({
                              ...notification,
                              unread: false,
                            }))
                          );
                        }}
                        className="text-[10px] font-semibold text-brand hover:underline"
                      >
                        Mark read
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${
                          n.unread ? 'ring-1 ring-brand/20' : ''
                        }`}
                      >
                        <p className="font-bold">{n.title}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400">
                          {n.desc}
                        </p>
                        <p className="text-[9px] text-gray-400 mt-1">
                          {n.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative pl-3 border-l border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center space-x-2.5 cursor-pointer text-left"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />

                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold leading-tight text-gray-800 dark:text-white">
                    Admin User
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Super Administrator
                  </p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#122448] rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 px-2 z-50 text-gray-800 dark:text-gray-100">
                  <Link
                    to="/admin/settings"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <UserIcon className="w-4 h-4 text-brand" />
                    <span>Settings</span>
                  </Link>

                  <Link
                    to="/login"
                    onClick={() => setShowProfileMenu(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Page Outlet */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50 dark:bg-[#0b1d3a] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
