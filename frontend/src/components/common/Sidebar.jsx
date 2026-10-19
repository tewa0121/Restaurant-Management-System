// src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Utensils, 
  Calendar, 
  BookOpen, 
  Package, 
  Users, 
  UserCheck, 
  Truck, 
  FileText, 
  TrendingUp, 
  BarChart2, 
  Settings, 
  History,
  ChevronRight
} from 'lucide-react';

export default function Sidebar() {
  const menuSections = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
        { label: 'Orders', path: '/manager/orders', icon: ShoppingBag },
        { label: 'Table Management', path: '/manager/table-management', icon: Utensils },
        { label: 'Reservations', path: '/manager/reservations', icon: Calendar },
        { label: 'Menu Management', path: '/manager/menu-management', icon: BookOpen },
        { label: 'Inventory Management', path: '/manager/inventory-management', icon: Package },
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Employees', path: '/manager/employees', icon: Users },
        { label: 'Customers', path: '/manager/customers', icon: UserCheck },
        { label: 'Suppliers', path: '/manager/suppliers', icon: Truck },
      ]
    },
    {
      title: 'REPORTS & ANALYTICS',
      items: [
        { label: 'Reports', path: '/manager/reports', icon: FileText },
        { label: 'Sales & Revenue', path: '/manager/sales-and-revenue', icon: TrendingUp },
        { label: 'Analytics', path: '/manager/analytics', icon: BarChart2 },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/manager/settings', icon: Settings },
        { label: 'Activity Log', path: '/manager/activity-log', icon: History },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0F172A] text-slate-300 flex flex-col h-screen shrink-0 border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-800/80">
        <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-white text-lg shadow-lg shadow-emerald-500/20">
          <Utensils className="w-5 h-5" />
        </div>
        <div>
          <h1 className="font-extrabold text-white text-base leading-none">RestoManager</h1>
          <p className="text-[10px] text-slate-400 mt-1">Restaurant Management System</p>
        </div>
      </div>

      {/* Scrollable Navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {section.title}
            </h3>
            <div className="space-y-1 pt-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-4 border-t border-slate-800/80 bg-[#0B1120]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
              alt="Manager Avatar" 
              className="w-9 h-9 rounded-full object-cover border-2 border-emerald-500"
            />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 border-2 border-[#0B1120]" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-white truncate">John Manager</h4>
            <p className="text-[10px] text-slate-400 truncate">Restaurant Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}