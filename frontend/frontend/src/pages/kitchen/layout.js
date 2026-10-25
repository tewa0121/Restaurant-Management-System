import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Incoming Orders', path: '/incoming' },
    { name: 'In-Progress', path: '/in-progress' },
    { name: 'Ready to Serve', path: '/ready' },
    { name: 'Completed Orders', path: '/completed' },
    { name: 'Ingredients', path: '/ingredients' },
    { name: 'Stock Alerts', path: '/stock-alerts' },
    { name: 'Kitchen Reports', path: '/reports' },
    { name: 'Performance', path: '/performance' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
        <div className="p-6 text-2xl font-bold border-b border-gray-800">
          🍳 Kitchen KDS
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2.5 rounded-lg transition font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;