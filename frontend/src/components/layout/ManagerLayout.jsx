import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Utensils, Calendar, ShoppingBag, UtensilsCrossed, PackageCheck,
  Users, Truck, BarChart2, FileText, History, Settings, User
} from 'lucide-react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function ManagerLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
        { label: 'Orders', path: '/manager/orders', icon: ShoppingBag },
        { label: 'Table Management', path: '/manager/table-management', icon: Utensils },
        { label: 'Reservations', path: '/manager/reservations', icon: Calendar },
        { label: 'Menu Management', path: '/manager/menu-management', icon: UtensilsCrossed },
        { label: 'Inventory Management', path: '/manager/inventory-management', icon: PackageCheck }
      ]
    },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Employees', path: '/manager/employees', icon: Users },
        { label: 'Customers', path: '/manager/customers', icon: User },
        { label: 'Suppliers', path: '/manager/suppliers', icon: Truck }
      ]
    },
    {
      title: 'REPORTS & ANALYTICS',
      items: [
        { label: 'Reports', path: '/manager/reports', icon: FileText },
        { label: 'Sales & Revenue', path: '/manager/sales-and-revenue', icon: BarChart2 }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { label: 'Settings', path: '/manager/settings', icon: Settings },
        { label: 'Activity Log', path: '/manager/activity-log', icon: History }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        brandName="Resto"
        brandHighlight="Manager"
        brandIcon={Utensils}
        navSections={navSections}
        user={{ name: 'John Manager' }}
        userRole="Manager"
        onLogout={() => navigate('/login')}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchPlaceholder="Search manager records..."
          notifications={[{ id: 1, text: 'Table #RES-402 reserved', time: '25m ago', read: false }]}
          user={{ name: 'John Manager', role: 'Manager' }}
          onLogout={() => navigate('/login')}
          profileLinks={[{ label: 'Manager Settings', path: '/manager/settings', icon: <Settings className="w-4 h-4 text-emerald-500" /> }]}
        />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}