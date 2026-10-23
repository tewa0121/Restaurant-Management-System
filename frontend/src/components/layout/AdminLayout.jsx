import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Store, Settings, UtensilsCrossed, Grid,
  ShoppingBag, Calendar, UserCheck, UserCog, Box, Truck, CreditCard,
  BarChart3, FileText
} from 'lucide-react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New order #ORD-1251 placed', time: '5m ago', read: false },
    { id: 2, text: 'Low stock alert: Tomato ingredient', time: '15m ago', read: false }
  ]);

  const navSections = [
    { items: [{ label: 'Dashboard', path: '/admin/panel/dashboard', icon: LayoutDashboard }] },
    {
      title: 'MANAGEMENT',
      items: [
        { label: 'Users & Roles', path: '/admin/panel/users-and-roles', icon: Users },
        { label: 'Restaurants', path: '/admin/panel/restaurants', icon: Store },
        { label: 'Settings', path: '/admin/panel/settings', icon: Settings },
        { label: 'Menu Management', path: '/admin/panel/menu-management', icon: UtensilsCrossed },
        { label: 'Table Management', path: '/admin/panel/table-management', icon: Grid },
        { label: 'Order Management', path: '/admin/panel/order-management', icon: ShoppingBag },
        { label: 'Reservation Management', path: '/admin/panel/reservation-management', icon: Calendar },
        { label: 'Customer Management', path: '/admin/panel/customer-management', icon: UserCheck },
        { label: 'Employee Management', path: '/admin/panel/employee-management', icon: UserCog },
        { label: 'Inventory Management', path: '/admin/panel/inventory-management', icon: Box },
        { label: 'Supplier Management', path: '/admin/panel/supplier-management', icon: Truck },
        { label: 'Delivery Management', path: '/admin/panel/delivery-management', icon: Truck },
        { label: 'Payment Management', path: '/admin/panel/payment-management', icon: CreditCard }
      ]
    },
    {
      title: 'ANALYTICS & REPORTS',
      items: [
        { label: 'Reports & Analytics', path: '/admin/panel/reports-and-analytics', icon: BarChart3 },
        { label: 'Logs & Activity', path: '/admin/panel/logs-and-activity', icon: FileText }
      ]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        brandName="Resto"
        brandHighlight="Admin"
        brandIcon={Store}
        navSections={navSections}
        user={{ name: 'System Admin' }}
        userRole="SuperAdmin"
        onLogout={() => navigate('/login')}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchPlaceholder="Search system logs, users..."
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          user={{ name: 'System Admin', role: 'SuperAdmin' }}
          onLogout={() => navigate('/login')}
          profileLinks={[{ label: 'Admin Settings', path: '/admin/panel/settings', icon: <Settings className="w-4 h-4 text-emerald-500" /> }]}
        />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}