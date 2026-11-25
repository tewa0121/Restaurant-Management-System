// src/pages/waiter/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Utensils,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Bell,
  PlusCircle,
  Table as TableIcon,
  HelpCircle,
  Calendar,
  History,
  DollarSign
} from 'lucide-react';

export default function WaiterDashboard() {
  const navigate = useNavigate();

  // Top KPI Stat Cards matching exact wireframe values & colors
  const topKpis = [
    { label: 'My Active Tables', value: '6', sub: 'of 12 Assigned', icon: Utensils, iconBg: 'bg-blue-100/70 text-blue-500' },
    { label: 'Active Orders', value: '14', sub: 'In Progress', icon: ShoppingBag, iconBg: 'bg-emerald-100/70 text-emerald-500' },
    { label: 'Ready to Serve', value: '5', sub: 'Orders', icon: Clock, iconBg: 'bg-amber-100/70 text-amber-500' },
    { label: 'Completed Orders', value: '18', sub: 'Today', icon: CheckCircle2, iconBg: 'bg-purple-100/70 text-purple-500' },
    { label: 'New Requests', value: '3', sub: 'From Tables', icon: Bell, iconBg: 'bg-rose-100/70 text-rose-500' },
  ];

  // My Active Tables Data
  const activeTables = [
    { table: 'Table 5', guests: '4 Guests', status: 'Ordering', lastOrder: '10:20 AM' },
    { table: 'Table 7', guests: '2 Guests', status: 'Food Preparing', lastOrder: '10:18 AM' },
    { table: 'Table 12', guests: '6 Guests', status: 'Ready to Serve', lastOrder: '10:15 AM' },
    { table: 'Table 3', guests: '3 Guests', status: 'Ordering', lastOrder: '10:10 AM' },
    { table: 'Table 15', guests: '2 Guests', status: 'Food Preparing', lastOrder: '10:08 AM' },
    { table: 'Table 8', guests: '5 Guests', status: 'Ready to Serve', lastOrder: '10:05 AM' },
  ];

  // Recent Orders Data
  const recentOrders = [
    { id: '#ORD-1250', table: 'Table 5', items: '3 items', status: 'Preparing', time: '10:20 AM' },
    { id: '#ORD-1249', table: 'Table 7', items: '4 items', status: 'Preparing', time: '10:18 AM' },
    { id: '#ORD-1248', table: 'Table 12', items: '5 items', status: 'Ready', time: '10:15 AM' },
    { id: '#ORD-1247', table: 'Table 3', items: '2 items', status: 'Preparing', time: '10:10 AM' },
    { id: '#ORD-1246', table: 'Table 15', items: '3 items', status: 'Pending', time: '10:08 AM' },
  ];

  // Customer Requests
  const customerRequests = [
    { table: 'Table 7', request: 'Extra Napkins', time: '2 min ago', status: 'New', icon: '🧻' },
    { table: 'Table 12', request: 'More Water', time: '5 min ago', status: 'New', icon: '🥤' },
    { table: 'Table 3', request: 'Check on Order', time: '8 min ago', status: 'In Progress', icon: '💬' },
  ];

  // 18 Floor Plan Tables
  const floorMap = [
    { id: 1, status: 'Available' },
    { id: 2, status: 'Available' },
    { id: 3, status: 'Preparing' },
    { id: 4, status: 'Available' },
    { id: 5, status: 'Ordering' },
    { id: 6, status: 'Available' },
    { id: 7, status: 'Preparing' },
    { id: 8, status: 'Available' },
    { id: 9, status: 'Available' },
    { id: 10, status: 'Available' },
    { id: 11, status: 'Available' },
    { id: 12, status: 'Ready to Serve' },
    { id: 13, status: 'Available' },
    { id: 14, status: 'Available' },
    { id: 15, status: 'Ordering' },
    { id: 16, status: 'Available' },
    { id: 17, status: 'Available' },
    { id: 18, status: 'Available' },
  ];

  // Helper for Status Badge Styling
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Ordering':
        return 'bg-sky-50 text-sky-600 border border-sky-200';
      case 'Food Preparing':
      case 'Preparing':
        return 'bg-amber-50 text-amber-600 border border-amber-200';
      case 'Ready to Serve':
      case 'Ready':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-200';
      case 'Pending':
        return 'bg-blue-50 text-blue-600 border border-blue-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  // Helper for Floor Grid Table Styling
  const getFloorGridStyle = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-50/50 border-emerald-200 text-emerald-700';
      case 'Ordering':
        return 'bg-blue-50/50 border-blue-200 text-blue-600';
      case 'Preparing':
        return 'bg-amber-50/50 border-amber-200 text-amber-700';
      case 'Ready to Serve':
        return 'bg-[#52C41A] border-[#52C41A] text-white font-extrabold shadow-sm';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-400';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] text-slate-800 font-sans">
      {/* GREETING TITLE */}
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          Welcome back, David! 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Here's what's happening in your shift.
        </p>
      </div>

      {/* TOP 5 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {topKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-3.5"
            >
              <div className={`p-3 rounded-2xl ${kpi.iconBg} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-slate-400">{kpi.label}</p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-xl font-black text-slate-900 leading-none">{kpi.value}</span>
                  <span className="text-[10px] font-medium text-slate-400">{kpi.sub}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 1: MY ACTIVE TABLES, ORDER STATUS OVERVIEW & RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MY ACTIVE TABLES TABLE */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">My Active Tables</h3>
            <button 
              type="button" 
              onClick={() => navigate('/waiter/tables')} 
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View Floor Plan
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-semibold border-b border-slate-100 text-[10px] uppercase">
                <tr>
                  <th className="pb-2.5">Table</th>
                  <th className="pb-2.5">Guests</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5">Last Order</th>
                  <th className="pb-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 font-medium text-slate-700">
                {activeTables.map((t, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-slate-900">{t.table}</td>
                    <td className="py-2.5 text-slate-500">{t.guests}</td>
                    <td className="py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(t.status)}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-400">{t.lastOrder}</td>
                    <td className="py-2.5 text-right">
                      <button 
                        type="button" 
                        onClick={() => navigate('/waiter/my-tables')} 
                        className="px-2.5 py-1 rounded-lg border border-emerald-500/40 text-emerald-600 hover:bg-emerald-50 text-[10px] font-bold transition-all cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">Showing 1 to 6 of 6 tables</p>
        </div>

        {/* ORDER STATUS OVERVIEW (DONUT CHART) */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Order Status Overview</h3>

          <div className="relative flex items-center justify-center my-1">
            <div
              className="w-36 h-36 rounded-full flex items-center justify-center"
              style={{
                background: 'conic-gradient(#3B82F6 0% 28%, #F59E0B 28% 64%, #10B981 64% 100%)'
              }}
            >
              <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-black text-slate-900 leading-none">14</span>
                <span className="text-[9px] text-slate-400 font-bold mt-1">Active Orders</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 pt-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Pending</span>
              <span className="font-extrabold text-slate-900">4</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Preparing</span>
              <span className="font-extrabold text-slate-900">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Ready</span>
              <span className="font-extrabold text-slate-900">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Served</span>
              <span className="font-extrabold text-slate-900">0</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Updated just now
          </div>
        </div>

        {/* RECENT ORDERS TABLE */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Recent Orders</h3>
            <button 
              type="button" 
              onClick={() => navigate('/waiter/orders')} 
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-semibold border-b border-slate-100 text-[10px] uppercase">
                <tr>
                  <th className="pb-2.5">Order ID</th>
                  <th className="pb-2.5">Table</th>
                  <th className="pb-2.5">Items</th>
                  <th className="pb-2.5">Status</th>
                  <th className="pb-2.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 font-medium text-slate-700">
                {recentOrders.map((o, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-blue-600">{o.id}</td>
                    <td className="py-2.5 text-slate-800">{o.table}</td>
                    <td className="py-2.5 text-slate-500">{o.items}</td>
                    <td className="py-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusStyle(o.status)}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right text-slate-400">{o.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* SECTION 2: CUSTOMER REQUESTS, TODAY'S SUMMARY & ASSIGNED TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* CUSTOMER REQUESTS */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Customer Requests</h3>
            <button 
              type="button" 
              onClick={() => navigate('/waiter/customer-requests')} 
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {customerRequests.map((req, i) => (
              <div key={i} className="p-3 bg-slate-50/80 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100/70 text-emerald-600 rounded-lg text-sm">
                    {req.icon}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 mr-2">{req.table}</span>
                    <span className="text-slate-600 font-medium">{req.request}</span>
                    <p className="text-[10px] text-slate-400 mt-0.5">{req.time}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  req.status === 'New' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S SUMMARY */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900">Today's Summary</h3>

          <div className="space-y-2 text-xs font-medium">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80">
              <span className="flex items-center gap-2 text-slate-600">
                <ShoppingBag className="w-4 h-4 text-blue-500" /> Orders Taken
              </span>
              <span className="font-black text-slate-900 text-sm">28</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80">
              <span className="flex items-center gap-2 text-slate-600">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Orders Served
              </span>
              <span className="font-black text-slate-900 text-sm">18</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80">
              <span className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-amber-500" /> Average Order Time
              </span>
              <span className="font-black text-slate-900 text-sm">24 min</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/80">
              <span className="flex items-center gap-2 text-slate-600">
                <DollarSign className="w-4 h-4 text-purple-500" /> Revenue Generated
              </span>
              <span className="font-black text-slate-900 text-sm">$1,245.50</span>
            </div>
          </div>
        </div>

        {/* ASSIGNED TABLES FLOOR OVERVIEW GRID */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Assigned Tables (Floor Overview)</h3>
            <button 
              type="button" 
              onClick={() => navigate('/waiter/tables')} 
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View Floor Plan
            </button>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {floorMap.map(t => (
              <div
                key={t.id}
                className={`h-9 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${getFloorGridStyle(t.status)}`}
              >
                {t.id}
              </div>
            ))}
          </div>

          {/* Floor Legend */}
          <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Available</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Ordering</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" /> Preparing</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#52C41A]" /> Ready to Serve</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-300" /> Not Assigned</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: QUICK ACTIONS & NOTIFICATIONS FEED */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* QUICK ACTIONS BUTTONS WITH WORKING NAVIGATE HANDLERS */}
        <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/waiter/new-order')}
              className="p-4 bg-blue-50/50 hover:bg-blue-100/60 border border-blue-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-6 h-6 text-blue-500" />
              <span className="text-xs font-bold text-slate-800">New Order</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/waiter/tables')}
              className="p-4 bg-emerald-50/50 hover:bg-emerald-100/60 border border-emerald-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <TableIcon className="w-6 h-6 text-emerald-500" />
              <span className="text-xs font-bold text-slate-800">View Tables</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/waiter/customer-requests')}
              className="p-4 bg-amber-50/50 hover:bg-amber-100/60 border border-amber-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <span className="text-xs font-bold text-slate-800">Customer Requests</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/waiter/reservations')}
              className="p-4 bg-purple-50/50 hover:bg-purple-100/60 border border-purple-100 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-6 h-6 text-purple-500" />
              <span className="text-xs font-bold text-slate-800">Reservations</span>
            </button>

            <button 
              type="button" 
              onClick={() => navigate('/waiter/order-history')}
              className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer col-span-2 sm:col-span-1"
            >
              <History className="w-6 h-6 text-slate-500" />
              <span className="text-xs font-bold text-slate-800">Order History</span>
            </button>
          </div>
        </div>

        {/* NOTIFICATIONS FEED */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            <button 
              type="button" 
              onClick={() => navigate('/waiter/notifications')} 
              className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 bg-slate-50/80 rounded-xl flex items-start gap-3 text-xs border border-slate-100">
              <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg mt-0.5">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-slate-800 leading-snug">
                  Order #ORD-1248 from Table 12 is ready to serve.
                </p>
                <p className="text-[10px] text-slate-400">2 min ago</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl flex items-start gap-3 text-xs border border-slate-100">
              <div className="p-1.5 bg-amber-100 text-amber-600 rounded-lg mt-0.5">
                <HelpCircle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-slate-800 leading-snug">
                  New request from Table 7: Extra Napkins
                </p>
                <p className="text-[10px] text-slate-400">2 min ago</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50/80 rounded-xl flex items-start gap-3 text-xs border border-slate-100">
              <div className="p-1.5 bg-purple-100 text-purple-600 rounded-lg mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 space-y-0.5">
                <p className="font-semibold text-slate-800 leading-snug">
                  Reservation for Table 8 at 7:00 PM
                </p>
                <p className="text-[10px] text-slate-400">15 min ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}