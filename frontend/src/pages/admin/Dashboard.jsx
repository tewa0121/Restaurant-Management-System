// src/pages/admin/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar,
  ShoppingBag, 
  DollarSign, 
  Utensils, 
  Users, 
  Clock, 
  AlertTriangle,
  UserPlus, 
  ConciergeBell,
  FilePlus,
  CalendarPlus, 
  BarChart3, 
  Package,
  CreditCard,
  BellRing,
  Settings
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

const statsCards = [
  { label: 'Total Orders', value: '1,248', change: '↑ 12.5%', text: 'vs yesterday', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-950/40', icon: ShoppingBag },
  { label: "Today's Revenue", value: '$4,325.50', change: '↑ 8.3%', text: 'vs yesterday', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/40', icon: DollarSign },
  { label: 'Available Tables', value: '24', change: '↑ 5', text: 'vs yesterday', color: 'text-sky-600', bg: 'bg-sky-50 dark:bg-sky-950/40', icon: Utensils },
  { label: 'Total Customers', value: '856', change: '↑ 11.7%', text: 'vs yesterday', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/40', icon: Users },
  { label: 'Pending Orders', value: '18', change: '↓ 3', text: 'vs yesterday', color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-950/40', icon: Clock },
  { label: 'Inventory Alerts', value: '7', change: '↓ 2', text: 'low stock items', color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-950/40', icon: AlertTriangle },
];

const recentOrders = [
  { id: '#ORD-1250', customer: 'John Smith', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', table: 'Table 5', items: '3 items', amount: 45.50, status: 'Completed', time: '10:30 AM' },
  { id: '#ORD-1249', customer: 'Sarah Johnson', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', table: 'Table 12', items: '5 items', amount: 78.20, status: 'Preparing', time: '10:25 AM' },
  { id: '#ORD-1248', customer: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', table: 'Table 3', items: '2 items', amount: 32.00, status: 'Pending', time: '10:20 AM' },
  { id: '#ORD-1247', customer: 'Emily Davis', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', table: 'Table 7', items: '4 items', amount: 67.80, status: 'Served', time: '10:15 AM' },
  { id: '#ORD-1246', customer: 'David Wilson', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', table: 'Table 1', items: '3 items', amount: 29.40, status: 'Completed', time: '10:10 AM' },
];

const inventoryAlerts = [
  { name: 'Tomato', level: 'Low Stock', amount: '5 kg left', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100' },
  { name: 'Chicken Breast', level: 'Low Stock', amount: '2 kg left', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=100' },
  { name: 'Cooking Oil', level: 'Low Stock', amount: '1.5 L left', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=100' },
  { name: 'Cheese', level: 'Low Stock', amount: '3 kg left', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=100' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400';
      case 'Preparing':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400';
      case 'Pending':
        return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400';
      case 'Served':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-400';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
    }
  };

  const quickActions = [
    { label: 'Add New User', icon: UserPlus, color: 'text-indigo-600', route: '/admin/users-and-roles' },
    { label: 'Add Menu Item', icon: ConciergeBell, color: 'text-emerald-600', route: '/admin/menu-management' },
    { label: 'Create Order', icon: FilePlus, color: 'text-sky-600', route: '/admin/order-management' },
    { label: 'Add Table', icon: Utensils, color: 'text-amber-600', route: '/admin/table-management' },
    { label: 'New Reservation', icon: CalendarPlus, color: 'text-rose-600', route: '/admin/reservation-management' },
    { label: 'Generate Report', icon: BarChart3, color: 'text-purple-600', route: '/admin/reports-and-analytics' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">

      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Welcome back, Admin <span className="animate-bounce">👋</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Here's what's happening with your restaurant today.
          </p>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          May 20, 2025
        </button>
      </div>

      {/* Top 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {statsCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl ${stat.bg}`}>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400">{stat.label}</p>
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">{stat.value}</h3>
              </div>
              <div className="text-[10px] flex items-center gap-1 font-semibold">
                <span className={stat.change.includes('↑') ? 'text-emerald-600' : 'text-rose-500'}>
                  {stat.change}
                </span>
                <span className="text-slate-400 font-normal">{stat.text}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Charts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sales Overview Line Chart Area */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 overflow-hidden">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Sales Overview</h3>
            <select className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded-lg border-none focus:outline-none">
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-44 flex flex-col justify-between pt-2 relative overflow-hidden">
            <div className="relative flex-1 w-full border-b border-slate-100 dark:border-slate-700">
              <div className="absolute top-0 left-[50%] -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md z-10 whitespace-nowrap">
                May 16, 2025<br/><span className="font-bold text-emerald-400">$4,250</span>
              </div>
              <svg viewBox="0 0 300 100" className="w-full h-full" preserveAspectRatio="none">
                <path 
                  d="M 10,80 Q 50,60 100,70 T 200,30 T 290,20" 
                  fill="none" 
                  stroke="#6366f1" 
                  strokeWidth="3" 
                />
              </svg>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-2 font-medium">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        {/* Revenue by Category Donut Chart Area */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Revenue by Category</h3>
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
              <div className="w-28 h-28 rounded-full border-[10px] border-indigo-500 border-t-amber-400 border-r-emerald-400 border-l-sky-400 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-medium">Total Revenue</span>
                <span className="text-xs font-extrabold text-slate-800 dark:text-white">$4,325.50</span>
              </div>
            </div>
            <div className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0"></span> Food (65%)</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0"></span> Drinks (20%)</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span> Desserts (10%)</div>
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-slate-300 shrink-0"></span> Others (5%)</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid matching Reference Design exactly */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Quick Actions</h3>
            <button 
              onClick={() => navigate('/admin/settings')}
              className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <Settings className="w-3 h-3" /> Manage
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-1">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <button 
                  key={i} 
                  onClick={() => navigate(action.route)}
                  className="flex flex-col items-center justify-center p-3.5 bg-slate-50/80 dark:bg-slate-700/40 hover:bg-emerald-50/50 dark:hover:bg-slate-700 hover:border-emerald-300 border border-slate-200/80 dark:border-slate-700 rounded-xl transition-all group cursor-pointer text-center"
                >
                  <Icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 leading-tight">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders Table, System Overview, Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Orders Table */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Orders</h3>
            <button onClick={() => navigate('/admin/order-management')} className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-2">
                  <th className="pb-2 font-medium">Order ID</th>
                  <th className="pb-2 font-medium">Customer</th>
                  <th className="pb-2 font-medium">Table</th>
                  <th className="pb-2 font-medium">Items</th>
                  <th className="pb-2 font-medium">Amount</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 font-extrabold text-indigo-600 dark:text-indigo-400">{order.id}</td>
                    <td className="py-3 font-semibold text-slate-800 dark:text-white">
                      <div className="flex items-center gap-2">
                        <img src={order.avatar} alt="" className="w-6 h-6 rounded-full object-cover shrink-0" />
                        <span>{order.customer}</span>
                      </div>
                    </td>
                    <td className="py-3 text-slate-500">{order.table}</td>
                    <td className="py-3 text-slate-500">{order.items}</td>
                    <td className="py-3 font-extrabold text-slate-800 dark:text-white">{formatCurrency(order.amount)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{order.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Overview */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">System Overview</h3>
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Users</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">56 <span className="text-emerald-500 text-[10px] font-semibold ml-1">Active</span></span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400">Total Restaurants</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white">3 <span className="text-emerald-500 text-[10px] font-semibold ml-1">Active</span></span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
              <span className="text-xs text-slate-500 dark:text-slate-400">System Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Operational
              </span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-700/40 rounded-xl space-y-1">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Storage Usage</span>
                <span className="font-bold text-slate-800 dark:text-white">67%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-600 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-600 h-full w-[67%] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Inventory Alerts</h3>
            <button onClick={() => navigate('/admin/inventory-management')} className="text-xs font-bold text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="space-y-2.5">
            {inventoryAlerts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <div className="flex items-center gap-2.5">
                  <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">{item.name}</h4>
                    <span className="text-[10px] text-rose-500 font-semibold">{item.level}</span>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-rose-600 whitespace-nowrap">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* System Activity */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">System Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl shrink-0"><UserPlus className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white">New user registered</span>
              <p className="text-slate-400 text-[11px]">Waiter - John Doe • <span className="text-slate-400">2 min ago</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 rounded-xl shrink-0"><Package className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white">New order received</span>
              <p className="text-slate-400 text-[11px]">Order #ORD-1251 • <span className="text-slate-400">5 min ago</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl shrink-0"><CreditCard className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Payment received</span>
              <p className="text-slate-400 text-[11px]">$78.20 from Order #1249 • <span className="text-slate-400">10 min ago</span></p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-50 dark:bg-rose-950/50 text-rose-500 rounded-xl shrink-0"><BellRing className="w-4 h-4" /></div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white">Low stock alert</span>
              <p className="text-slate-400 text-[11px]">Tomato is running low • <span className="text-slate-400">15 min ago</span></p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}