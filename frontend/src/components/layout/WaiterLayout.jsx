import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, UtensilsCrossed, PlusCircle, ShoppingBag, History,
  Grid, CalendarDays, Users, Bell, User, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function WaiterLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-10-23');

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Order #ORD-1248 from Table 12 is ready to serve.', time: '2 min ago', read: false },
    { id: 2, text: 'New request from Table 7: Extra Napkins', time: '2 min ago', read: false },
    { id: 3, text: 'Reservation for Table 8 at 7:00 PM', time: '15 min ago', read: false },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    if (logout) logout();
    navigate('/login', { replace: true });
  };

  const navSections = [
    { items: [{ label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard }] },
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

  const profileLinks = [
    { label: 'My Profile', path: '/waiter/profile', icon: <User className="w-4 h-4 text-emerald-500" /> },
    { label: 'Waiter Settings', path: '/waiter/settings', icon: <Settings className="w-4 h-4 text-blue-500" /> }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        brandName="Resto"
        brandHighlight="Waiter"
        brandIcon={UtensilsCrossed}
        navSections={navSections}
        user={user || { name: 'David Waiter' }}
        userRole="Waiter"
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchPlaceholder="Search tables, items, orders..."
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          user={user || { name: 'David Waiter', role: 'Waiter' }}
          onLogout={handleLogout}
          profileLinks={profileLinks}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}