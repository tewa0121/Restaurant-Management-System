import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PlusCircle, FileText, Clock, History, CreditCard,
  RotateCcw, Receipt, BarChart3, FileSpreadsheet, Users, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function CashierLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-10-23');

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Payment received for Bill #BILL-151 (Table 12)', time: '2 min ago', read: false },
    { id: 2, text: 'New bill created for Table 8', time: '5 min ago', read: false },
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
      title: 'BILLING & ORDERS',
      items: [
        { label: 'New Bill', path: 'new-bill', icon: PlusCircle },
        { label: 'Active Bills', path: 'active-bills', icon: FileText },
        { label: 'Hold Bills', path: 'hold-bills', icon: Clock },
        { label: 'Order History', path: 'order-history', icon: History }
      ]
    },
    {
      title: 'PAYMENTS',
      items: [
        { label: 'Payment History', path: 'payment-history', icon: CreditCard },
        { label: 'Refunds', path: 'refunds', icon: RotateCcw },
        { label: 'Receipts', path: 'receipts', icon: Receipt }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Sales Summary', path: 'sales-summary', icon: BarChart3 },
        { label: 'Daily Cash Report', path: 'daily-cash-report', icon: FileSpreadsheet }
      ]
    },
    {
      title: 'OTHER',
      items: [
        { label: 'Customers', path: 'customers', icon: Users },
        { label: 'Settings', path: 'settings', icon: Settings }
      ]
    }
  ];

  const profileLinks = [
    { label: 'Cashier Settings', path: '/cashier/settings', icon: <Settings className="w-4 h-4 text-blue-500" /> }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        brandName="Resto"
        brandHighlight="Cashier"
        brandIcon={CreditCard}
        navSections={navSections}
        user={user || { name: 'Michael Cashier' }}
        userRole="Cashier"
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchPlaceholder="Search bills, receipts, or customers..."
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          user={user || { name: 'Michael Cashier', role: 'Cashier' }}
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