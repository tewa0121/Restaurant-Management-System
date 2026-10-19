<<<<<<< HEAD
// src/pages/manager/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  DollarSign, 
  Utensils, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownRight,
  CalendarPlus,
  UtensilsCrossed,
  PackageCheck,
  FileSpreadsheet,
  Bell
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleNavigate = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };

  const lowStockIngredients = [
    { name: 'Tomato', qty: '2 kg left', image: '🍅' },
    { name: 'Chicken Breast', qty: '1.5 kg left', image: '🍗' },
    { name: 'Cooking Oil', qty: '1 L left', image: '🍾' },
    { name: 'Cheese', qty: '1.2 kg left', image: '🧀' },
  ];

  const recentOrders = [
    { id: '#ORD-1250', table: 'Table 5', customer: 'John Smith', avatar: '👨‍💼', items: '3 items', amount: '$45.50', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400', time: '10:30 AM' },
    { id: '#ORD-1249', table: 'Table 12', customer: 'Sarah Johnson', avatar: '👩‍💼', items: '5 items', amount: '$78.20', status: 'Preparing', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400', time: '10:25 AM' },
    { id: '#ORD-1248', table: 'Table 3', customer: 'Michael Brown', avatar: '👨‍💻', items: '2 items', amount: '$32.00', status: 'Preparing', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400', time: '10:20 AM' },
    { id: '#ORD-1247', table: 'Table 7', customer: 'Emily Davis', avatar: '👩‍💻', items: '4 items', amount: '$67.80', status: 'Served', statusColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400', time: '10:15 AM' },
    { id: '#ORD-1246', table: 'Table 1', customer: 'David Wilson', avatar: '👨‍💼', items: '3 items', amount: '$29.40', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400', time: '10:10 AM' },
  ];

  const todayReservations = [
    { time: '7:00 PM', table: 'Table 8', guests: '2 Guests' },
    { time: '7:30 PM', table: 'Table 12', guests: '4 Guests' },
    { time: '8:00 PM', table: 'Table 3', guests: '3 Guests' },
    { time: '8:30 PM', table: 'Table 15', guests: '6 Guests' },
  ];

  const notifications = [
    { title: 'New order received at Table 5', time: '5 min ago', icon: ShoppingBag, color: 'text-sky-500' },
    { title: 'Reservation for Table 8 at 7:00 PM', time: '15 min ago', icon: Calendar, color: 'text-purple-500' },
    { title: 'Low stock alert for Chicken Breast', time: '30 min ago', icon: AlertTriangle, color: 'text-rose-500' },
    { title: 'Payment received for Order #ORD-1247', time: '1 hour ago', icon: DollarSign, color: 'text-emerald-500' },
  ];

  const quickActions = [
    { label: 'New Order', icon: ShoppingBag, path: '/manager/orders', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400' },
    { label: 'Add Reservation', icon: CalendarPlus, path: '/manager/reservations', color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400' },
    { label: 'Add Menu Item', icon: UtensilsCrossed, path: '/manager/menu-management', color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400' },
    { label: 'Manage Tables', icon: Utensils, path: '/manager/table-management', color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 dark:text-sky-400' },
    { label: 'Inventory Check', icon: PackageCheck, path: '/manager/inventory-management', color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400' },
    { label: 'Generate Report', icon: FileSpreadsheet, path: '/manager/reports', color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            Welcome back, Manager! 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Here's what's happening in your restaurant today.
          </p>
        </div>
        <div className="px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2 shadow-sm">
          <Calendar className="w-4 h-4 text-emerald-500" />
          <span>May 20, 2025 | Tuesday</span>
        </div>
      </div>

      {/* Row 1: KPI Top Cards (6 Columns) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/orders')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 rounded-2xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Total Orders</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">128</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 15.6% <span className="text-slate-400 font-normal">vs yesterday</span>
          </p>
        </button>

        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/sales-and-revenue')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Today's Revenue</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">$4,325.50</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 12.3% <span className="text-slate-400 font-normal">vs yesterday</span>
          </p>
        </button>

        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/table-management')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-sky-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 rounded-2xl">
            <Utensils className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Available Tables</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">24 <span className="text-slate-400 text-sm font-normal">/ 36</span></h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 5 <span className="text-slate-400 font-normal">vs yesterday</span>
          </p>
        </button>

        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/orders')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-amber-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Pending Orders</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">18</h3>
          <p className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
            <ArrowDownRight className="w-3 h-3" /> 3 <span className="text-slate-400 font-normal">vs yesterday</span>
          </p>
        </button>

        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/reservations')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-indigo-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 rounded-2xl">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Reservations Today</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">12</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 2 <span className="text-slate-400 font-normal">vs yesterday</span>
          </p>
        </button>

        <button 
          type="button" 
          onClick={(e) => handleNavigate(e, '/manager/inventory-management')}
          className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-2 text-left hover:border-rose-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Low Stock Items</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">7</h3>
          <span className="text-[10px] font-bold text-emerald-600 hover:underline block">
            View details
          </span>
        </button>
      </div>

      {/* Row 2: Analytics & Charts (Sales Overview, Revenue Donut, Monthly Performance, Pending Queue) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
        {/* Sales Overview Line Chart */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">Sales Overview</h3>
            <select className="text-[10px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300">
              <option>This Week</option>
            </select>
          </div>
          <div className="relative h-48 flex items-end justify-between px-2 pt-8">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2.5 py-1 rounded-lg shadow-lg z-20 text-center">
              May 16, 2025 <br /><span className="font-bold text-emerald-400 text-xs">$4,250</span>
            </div>
            <svg className="absolute inset-0 w-full h-full text-emerald-500 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
              <path d="M 0 40 Q 25 35, 45 32 T 75 10 T 100 30" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} className="text-[10px] text-slate-400 z-10 font-medium">{day}</span>
            ))}
          </div>
        </div>

        {/* Revenue by Category Donut */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs">Revenue by Category</h3>
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-28 h-28 rounded-full border-[10px] border-emerald-500 border-t-sky-500 border-r-amber-400 border-b-purple-500 flex items-center justify-center shrink-0">
              <div className="text-center">
                <span className="text-[8px] text-slate-400 block font-medium">Total Revenue</span>
                <span className="text-xs font-black text-slate-800 dark:text-white">$4,325.50</span>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] flex-1">
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Food</span><span className="font-bold text-slate-800 dark:text-white">65%</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-sky-500" /> Drinks</span><span className="font-bold text-slate-800 dark:text-white">20%</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-amber-400" /> Desserts</span><span className="font-bold text-slate-800 dark:text-white">10%</span></div>
              <div className="flex items-center justify-between"><span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><span className="w-2 h-2 rounded-full bg-purple-500" /> Others</span><span className="font-bold text-slate-800 dark:text-white">5%</span></div>
            </div>
          </div>
        </div>

        {/* Monthly Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">Monthly Performance</h3>
            <select className="text-[10px] bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg px-1.5 py-1 text-slate-600 dark:text-slate-300">
              <option>This Month</option>
            </select>
          </div>
          <div className="h-40 flex items-end justify-between gap-2 pt-2">
            {[
              { label: 'Week 1', height: '40%', val: '$3,650' },
              { label: 'Week 2', height: '60%', val: '$5,420' },
              { label: 'Week 3', height: '80%', val: '$7,280' },
              { label: 'Week 4', height: '98%', val: '$8,950' }
            ].map((bar) => (
              <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[8px] text-slate-400 font-bold">{bar.val}</span>
                <div className="w-full bg-emerald-500 rounded-t-lg transition-all" style={{ height: bar.height }} />
                <span className="text-[9px] text-slate-400">{bar.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Orders Sidebar Widget */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">Pending Orders</h3>
            <button 
              type="button" 
              onClick={(e) => handleNavigate(e, '/manager/orders')} 
              className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-2">
            {[
              { table: 'Table 5', items: '3 items', time: '10:20 AM', status: 'Preparing', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
              { table: 'Table 12', items: '5 items', time: '10:18 AM', status: 'Preparing', badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400' },
              { table: 'Table 7', items: '2 items', time: '10:15 AM', status: 'Pending', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' },
              { table: 'Table 3', items: '4 items', time: '10:10 AM', status: 'Pending', badge: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400' },
            ].map((pOrder, idx) => (
              <button 
                key={idx} 
                type="button"
                onClick={(e) => handleNavigate(e, '/manager/orders')}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-700/40 rounded-xl flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-xs">{pOrder.table}</h4>
                  <p className="text-[9px] text-slate-400">{pOrder.items}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold uppercase ${pOrder.badge}`}>
                    {pOrder.status}
                  </span>
                  <p className="text-[8px] text-slate-400 mt-1">{pOrder.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Recent Orders Data Table & Right Panel Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Orders Data Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">Recent Orders</h3>
            <button 
              type="button" 
              onClick={(e) => handleNavigate(e, '/manager/orders')} 
              className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All Orders
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 text-slate-400 text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Table</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {recentOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">{ro.id}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-200">{ro.table}</td>
                    <td className="py-3 font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
                      <span>{ro.avatar}</span> {ro.customer}
                    </td>
                    <td className="py-3 text-slate-500">{ro.items}</td>
                    <td className="py-3 font-bold text-slate-800 dark:text-white">{ro.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ro.statusColor}`}>
                        {ro.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 text-[10px]">{ro.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Panel: Table Status & Today's Reservations */}
        <div className="lg:col-span-4 space-y-5">
          {/* Table Status */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs">Table Status</h3>
              <button 
                type="button" 
                onClick={(e) => handleNavigate(e, '/manager/table-management')} 
                className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View Floor Plan
              </button>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
                <span className="font-bold text-slate-800 dark:text-white">24</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="w-2 h-2 rounded-full bg-amber-500" /> Occupied</span>
                <span className="font-bold text-slate-800 dark:text-white">8</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="w-2 h-2 rounded-full bg-purple-500" /> Reserved</span>
                <span className="font-bold text-slate-800 dark:text-white">4</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="w-2 h-2 rounded-full bg-sky-500" /> Cleaning</span>
                <span className="font-bold text-slate-800 dark:text-white">2</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-200"><span className="w-2 h-2 rounded-full bg-rose-500" /> Out of Order</span>
                <span className="font-bold text-slate-800 dark:text-white">2</span>
              </div>
            </div>
          </div>

          {/* Today's Reservations */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-xs">Today's Reservations</h3>
              <button 
                type="button" 
                onClick={(e) => handleNavigate(e, '/manager/reservations')} 
                className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {todayReservations.map((res, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-700/40 rounded-xl text-xs">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{res.time}</span>
                  <span className="text-slate-700 dark:text-slate-200 font-semibold">{res.table}</span>
                  <span className="text-[10px] text-slate-400">{res.guests}</span>
=======
import React, { useEffect, useState } from 'react';
import { getManagerDashboardData } from '../../services/mockAdapter';
import { 
  ShoppingBag, DollarSign, Table, Clock, Calendar, AlertTriangle,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';

export default function ManagerDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Fetch data from your mock adapter
    const fetchData = async () => {
      await new Promise(resolve => setTimeout(resolve, 300)); // fake loading
      setData(getManagerDashboardData());
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-6 text-gray-500 font-medium">Loading Dashboard...</div>;

  return (
    <div className="space-y-6 font-sans">
      
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Manager! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your restaurant today.</p>
        </div>
      </div>

      {/* ================= KPI CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Card 1 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.totalOrders.value}</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <ArrowUpRight size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">{data.stats.totalOrders.change}</span>
            <span className="text-gray-400 ml-1.5">vs yesterday</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Today's Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.todayRevenue.value}</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <ArrowUpRight size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">{data.stats.todayRevenue.change}</span>
            <span className="text-gray-400 ml-1.5">vs yesterday</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Available Tables</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.availableTables.value}</h3>
            </div>
            <div className="p-2 bg-cyan-50 rounded-lg text-cyan-600">
              <Table size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <ArrowUpRight size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">{data.stats.availableTables.change}</span>
            <span className="text-gray-400 ml-1.5">vs yesterday</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Orders</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.pendingOrders.value}</h3>
            </div>
            <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
              <Clock size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <ArrowDownRight size={14} className="text-red-500 mr-1" />
            <span className="text-red-500">{data.stats.pendingOrders.change}</span>
            <span className="text-gray-400 ml-1.5">vs yesterday</span>
          </div>
        </div>

        {/* Card 5 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Reservations Today</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.reservationsToday.value}</h3>
            </div>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Calendar size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <ArrowUpRight size={14} className="text-green-500 mr-1" />
            <span className="text-green-500">{data.stats.reservationsToday.change}</span>
            <span className="text-gray-400 ml-1.5">vs yesterday</span>
          </div>
        </div>

        {/* Card 6 */}
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Low Stock Items</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.stats.lowStockItems.value}</h3>
            </div>
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="flex items-center text-xs font-medium">
            <a href="#" className="text-green-600 hover:underline">View details</a>
          </div>
        </div>
      </div>

      {/* ================= CHARTS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview (Line) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Sales Overview</h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50">
              <option>This Week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.salesOverview}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} width={30} />
              <RechartsTooltip cursor={{ stroke: '#E5E7EB', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="sales" stroke="#10B981" strokeWidth={3} dot={{ r: 4, fill: '#10B981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Category (Donut) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col">
          <h3 className="font-semibold text-gray-800 mb-4">Revenue by Category</h3>
          <div className="flex-1 flex items-center justify-between">
            <ResponsiveContainer width="60%" height={200}>
              <PieChart>
                <Pie data={data.revenueByCategory} innerRadius={65} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                  {data.revenueByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[40%] space-y-3">
              {data.revenueByCategory.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></span>
                    {item.name}
                  </div>
                  <span className="font-medium text-gray-900">{item.value}%</span>
>>>>>>> origin/developer
                </div>
              ))}
            </div>
          </div>
        </div>
<<<<<<< HEAD
      </div>

      {/* Row 4: Quick Actions Grid, Notifications, and Low Stock Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-xs">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={(e) => handleNavigate(e, action.path)}
                  className="bg-slate-50 dark:bg-slate-700/40 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-600 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all flex flex-col items-center text-center gap-2 group cursor-pointer active:scale-95"
                >
                  <div className={`p-2 rounded-xl ${action.color} group-hover:scale-110 transition-transform pointer-events-none`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200 pointer-events-none">
                    {action.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notifications Live Stream */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-emerald-500" /> Notifications
            </h3>
            <button 
              type="button" 
              onClick={(e) => handleNavigate(e, '/manager/activity-log')} 
              className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-2.5">
            {notifications.map((n, idx) => {
              const Icon = n.icon;
              return (
                <div key={idx} className="flex items-start justify-between gap-2 text-xs">
                  <div className="flex items-start gap-2">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${n.color}`} />
                    <span className="text-[11px] text-slate-700 dark:text-slate-200 leading-tight">{n.title}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0">{n.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Items Detailed List */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-800 dark:text-white text-xs">Low Stock Items</h3>
            <button 
              type="button" 
              onClick={(e) => handleNavigate(e, '/manager/inventory-management')} 
              className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {lowStockIngredients.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                  <span>{item.image}</span> {item.name}
                </span>
                <span className="font-bold text-rose-500 text-[10px]">{item.qty}</span>
              </div>
            ))}
          </div>
        </div>
=======

        {/* Monthly Performance (Bar) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Monthly Performance</h3>
            <select className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50">
              <option>This Month</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.monthlyPerformance}>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} width={30} />
              <RechartsTooltip cursor={{fill: 'transparent'}}/>
              <Bar dataKey="sales" fill="#10B981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ================= TABLES & WIDGETS ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Orders Table (Takes 2 cols) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Recent Orders</h3>
            <a href="#" className="text-sm text-green-600 font-medium hover:underline">View All Orders</a>
          </div>
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Table</th>
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50">
                  <td className="py-3 text-[#6366F1] font-medium">#{order.id}</td>
                  <td className="py-3 text-gray-600">{order.table}</td>
                  <td className="py-3 text-gray-800 font-medium">{order.customer}</td>
                  <td className="py-3 text-gray-600">${order.amount.toFixed(2)}</td>
                  <td className="py-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Preparing' ? 'bg-orange-100 text-orange-700' :
                      order.status === 'Served' ? 'bg-indigo-100 text-indigo-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-500">{order.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Sidebar Widgets (Table Status & Low Stock) */}
        <div className="space-y-6">
          
          {/* Table Status Widget */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Table Status</h3>
              <a href="#" className="text-sm text-green-600 font-medium hover:underline">View Floor Plan</a>
            </div>
            <div className="space-y-3">
              {data.tableStatus.map((t, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      t.status === 'Available' ? 'bg-green-500' :
                      t.status === 'Occupied' ? 'bg-orange-500' :
                      t.status === 'Reserved' ? 'bg-blue-500' :
                      t.status === 'Cleaning' ? 'bg-purple-500' : 'bg-red-500'
                    }`}></span>
                    {t.status}
                  </div>
                  <span className="font-bold text-gray-900">{t.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Low Stock Widget */}
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Low Stock Items</h3>
              <a href="#" className="text-sm text-green-600 font-medium hover:underline">View All</a>
            </div>
            <div className="space-y-4">
              {data.lowStockItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{item.item}</p>
                      <p className="text-xs text-red-500 font-medium">{item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Actions (Takes 2 cols) */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {[
              { icon: ShoppingBag, label: 'New Order', color: 'text-green-600', bg: 'bg-green-50' },
              { icon: Calendar, label: 'Add Reservation', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: Table, label: 'Add Menu Item', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: Table, label: 'Manage Tables', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: AlertTriangle, label: 'Inventory Check', color: 'text-teal-600', bg: 'bg-teal-50' },
              { icon: Clock, label: 'Generate Report', color: 'text-red-600', bg: 'bg-red-50' },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:shadow-md hover:border-green-200 transition-all">
                <div className={`p-3 rounded-full mb-2 ${action.bg} ${action.color}`}>
                  <action.icon size={20} />
                </div>
                <span className="text-xs font-medium text-gray-700 text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
            <a href="#" className="text-sm text-green-600 font-medium hover:underline">View All</a>
          </div>
          <ul className="space-y-4">
            {data.notifications.map((notif, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full ${
                  notif.message.includes('order') ? 'bg-blue-500' : 
                  notif.message.includes('Reservation') ? 'bg-purple-500' : 'bg-red-500'
                }`} />
                <div>
                  <p className="text-sm text-gray-700 leading-tight">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

>>>>>>> origin/developer
      </div>
    </div>
  );
}