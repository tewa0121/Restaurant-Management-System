import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Flame, Clock, CheckCircle2, History, UtensilsCrossed,
  AlertTriangle, BarChart2, TrendingUp, Settings, ChefHat
} from 'lucide-react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';

export default function KitchenLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Order #ORD-1250 pending > 15m', time: '10 min ago', read: false },
    { id: 2, text: 'Low stock: Chicken Breast (1.5 kg left)', time: '20 min ago', read: false }
  ]);

  const navSections = [
    {
      title: 'KITCHEN OPERATIONS',
      items: [
        { label: 'Dashboard', path: '/kitchen/dashboard', icon: LayoutDashboard },
        { label: 'Incoming Orders', path: '/kitchen/incoming-orders', icon: Flame },
        { label: 'In Progress', path: '/kitchen/in-progress', icon: Clock },
        { label: 'Ready to Serve', path: '/kitchen/ready-to-serve', icon: CheckCircle2 },
        { label: 'Completed Orders', path: '/kitchen/completed-orders', icon: History }
      ]
    },
    {
      title: 'INVENTORY',
      items: [
        { label: 'Ingredients', path: '/kitchen/ingredients', icon: UtensilsCrossed },
        { label: 'Stock Alerts', path: '/kitchen/stock-alerts', icon: AlertTriangle }
      ]
    },
    {
      title: 'REPORTS',
      items: [
        { label: 'Kitchen Reports', path: '/kitchen/reports', icon: BarChart2 },
        { label: 'Performance', path: '/kitchen/performance', icon: TrendingUp }
      ]
    },
    {
      title: 'OTHER',
      items: [{ label: 'Settings', path: '/kitchen/settings', icon: Settings }]
    }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        brandName="Resto"
        brandHighlight="Kitchen"
        brandIcon={ChefHat}
        navSections={navSections}
        user={{ name: 'Head Chef' }}
        userRole="Kitchen Staff"
        onLogout={() => navigate('/login')}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          searchPlaceholder="Search kitchen orders..."
          notifications={notifications}
          onMarkAllRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
          user={{ name: 'Head Chef', role: 'Kitchen Staff' }}
          onLogout={() => navigate('/login')}
          profileLinks={[{ label: 'Kitchen Settings', path: '/kitchen/settings', icon: <Settings className="w-4 h-4 text-emerald-500" /> }]}
        />

        <main className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}