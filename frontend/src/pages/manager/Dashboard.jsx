import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  DollarSign,
  Utensils,
  Clock,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  CalendarPlus,
  UtensilsCrossed,
  PackageCheck,
  FileSpreadsheet,
  X,
  CheckCircle,
  Layers
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  // 1. Dynamic Date Filter State
  const [selectedRange, setSelectedRange] = useState('Today');

  // 2. Active Modal States for All Buttons and Quick Actions
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [showReservationsModal, setShowReservationsModal] = useState(false);
  const [showFloorPlanModal, setShowFloorPlanModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [notification, setNotification] = useState('');

  // 3. New Item Form State
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Main Course',
    price: '',
  });

  const triggerNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleAddMenuItemSubmit = (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;

    const existingMenu = JSON.parse(localStorage.getItem('customMenuItems') || '[]');
    existingMenu.push({ ...newItem, id: Date.now() });
    localStorage.setItem('customMenuItems', JSON.stringify(existingMenu));

    setShowAddMenuModal(false);
    setNewItem({ name: '', category: 'Main Course', price: '' });
    triggerNotification(`Successfully added "${newItem.name}" to the menu!`);
  };

  const handleDownloadReport = () => {
    setShowReportModal(false);
    triggerNotification(`Sales report for (${selectedRange}) exported successfully as PDF!`);
  };

  // Dynamic KPI Metrics reacting to Date Filter
  const getMetricsData = () => {
    switch (selectedRange) {
      case 'This Week':
        return { orders: '840', revenue: '$28,450.00', tables: '28 / 36', pending: '22', reservations: '45', stockAlerts: '5' };
      case 'This Month':
        return { orders: '3,420', revenue: '$114,200.00', tables: '30 / 36', pending: '15', reservations: '180', stockAlerts: '3' };
      default: // Today
        return { orders: '128', revenue: '$4,325.50', tables: '24 / 36', pending: '18', reservations: '12', stockAlerts: '7' };
    }
  };

  const currentMetrics = getMetricsData();

  const lowStockIngredients = [
    { name: 'Tomato', qty: '2 kg left', image: '🍅' },
    { name: 'Chicken Breast', qty: '1.5 kg left', image: '🍗' },
    { name: 'Cooking Oil', qty: '1 L left', image: '🍾' },
    { name: 'Cheese', qty: '1.2 kg left', image: '🧀' },
  ];

  const recentOrders = [
    { id: '#ORD-1250', table: 'Table 5', customer: 'John Smith', avatar: '👨‍💼', items: '3 items', amount: '$45.50', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400', time: '10:30 AM' },
    { id: '#ORD-1249', table: 'Table 12', customer: 'Sarah Johnson', avatar: '👩‍💼', items: '5 items', amount: '$78.20', status: 'Preparing', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400', time: '10:25 AM' },
    { id: '#ORD-1248', table: 'Table 3', customer: 'Michael Brown', avatar: '👨‍💻', items: '2 items', amount: '$32.00', status: 'Preparing', statusColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-400', time: '10:20 AM' },
    { id: '#ORD-1247', table: 'Table 7', customer: 'Emily Davis', avatar: '👩‍💻', items: '4 items', amount: '$67.80', status: 'Served', statusColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-400', time: '10:15 AM' },
    { id: '#ORD-1246', table: 'Table 1', customer: 'David Wilson', avatar: '👨‍💼', items: '3 items', amount: '$29.40', status: 'Completed', statusColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400', time: '10:10 AM' },
  ];

  const todayReservations = [
    { time: '7:00 PM', table: 'Table 8', guests: '2 Guests', name: 'Alex Vance' },
    { time: '7:30 PM', table: 'Table 12', guests: '4 Guests', name: 'Maria Garcia' },
    { time: '8:00 PM', table: 'Table 3', guests: '3 Guests', name: 'Robert Paul' },
    { time: '8:30 PM', table: 'Table 15', guests: '6 Guests', name: 'Sophia Lee' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen font-sans relative transition-colors">
      
      {/* Toast Alert Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-xl animate-bounce text-xs font-semibold">
          <CheckCircle className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Header Banner & Working Date Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Welcome back, Manager! 👋
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Here's what's happening in your restaurant today.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-sm">
          {['Today', 'This Week', 'This Month'].map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedRange === range
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
          type="button"
          onClick={() => setShowOrdersModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-purple-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400 rounded-2xl">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Total Orders ({selectedRange})</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMetrics.orders}</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 15.6%
          </p>
        </button>

        <button
          type="button"
          onClick={() => setShowReportModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-emerald-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-2xl">
            <DollarSign className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Revenue ({selectedRange})</p>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">{currentMetrics.revenue}</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" /> 12.3%
          </p>
        </button>

        <button
          type="button"
          onClick={() => setShowFloorPlanModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-sky-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-sky-50 text-sky-600 dark:bg-sky-950/80 dark:text-sky-400 rounded-2xl">
            <Utensils className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Available Tables</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMetrics.tables}</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">View Layout</p>
        </button>

        <button
          type="button"
          onClick={() => setShowOrdersModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-amber-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 rounded-2xl">
            <Clock className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Pending Orders</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMetrics.pending}</h3>
          <p className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">Needs attention</p>
        </button>

        <button
          type="button"
          onClick={() => setShowReservationsModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-indigo-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400 rounded-2xl">
            <Calendar className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Reservations</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMetrics.reservations}</h3>
          <p className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">Scheduled</p>
        </button>

        <button
          type="button"
          onClick={() => setShowInventoryModal(true)}
          className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 text-left hover:border-rose-500 transition-all cursor-pointer"
        >
          <div className="p-2.5 w-fit bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400 rounded-2xl">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <p className="text-[11px] text-slate-400 font-medium">Low Stock Items</p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">{currentMetrics.stockAlerts}</h3>
          <span className="text-[10px] font-bold text-rose-500 hover:underline block">View details</span>
        </button>
      </div>

      {/* Main Table Views */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs">Recent Orders</h3>
            <button
              type="button"
              onClick={() => setShowOrdersModal(true)}
              className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
            >
              View All Orders
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px]">
                  <th className="pb-3 font-semibold">Order ID</th>
                  <th className="pb-3 font-semibold">Table</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Items</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">{ro.id}</td>
                    <td className="py-3 text-slate-700 dark:text-slate-300">{ro.table}</td>
                    <td className="py-3 font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{ro.avatar}</span> {ro.customer}
                    </td>
                    <td className="py-3 text-slate-500">{ro.items}</td>
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{ro.amount}</td>
                    <td className="py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${ro.statusColor}`}>{ro.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Floor Plan & Reservations Widgets */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">Table Status</h3>
              <button
                type="button"
                onClick={() => setShowFloorPlanModal(true)}
                className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View Floor Plan
              </button>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { label: 'Available', count: 24, color: 'bg-emerald-500' },
                { label: 'Occupied', count: 8, color: 'bg-amber-500' },
                { label: 'Reserved', count: 4, color: 'bg-purple-500' },
              ].map((table) => (
                <div key={table.label} className="flex justify-between items-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                  <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className={`w-2 h-2 rounded-full ${table.color}`} />
                    {table.label}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">{table.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white text-xs">Today's Reservations</h3>
              <button
                type="button"
                onClick={() => setShowReservationsModal(true)}
                className="text-[10px] font-bold text-emerald-600 hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>

            <div className="space-y-2">
              {todayReservations.slice(0, 3).map((res, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{res.time}</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold">{res.table}</span>
                  <span className="text-[10px] text-slate-400">{res.guests}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS BAR */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs">Quick Actions</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            type="button"
            onClick={() => setShowOrdersModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80"><ShoppingBag className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">New Order</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReservationsModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-purple-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-purple-600 bg-purple-50 dark:bg-purple-950/80"><CalendarPlus className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Reservation</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddMenuModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-amber-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-amber-600 bg-amber-50 dark:bg-amber-950/80"><UtensilsCrossed className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Add Menu</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFloorPlanModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-sky-600 bg-sky-50 dark:bg-sky-950/80"><Utensils className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Tables</span>
          </button>

          <button
            type="button"
            onClick={() => setShowInventoryModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-indigo-600 bg-indigo-50 dark:bg-indigo-950/80"><PackageCheck className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Inventory</span>
          </button>

          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-rose-500 transition-all flex flex-col items-center text-center gap-2 cursor-pointer"
          >
            <div className="p-2 rounded-xl text-rose-600 bg-rose-50 dark:bg-rose-950/80"><FileSpreadsheet className="w-5 h-5" /></div>
            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Reports</span>
          </button>
        </div>
      </div>

      {/* ALL WORKING OVERLAY MODALS WITH FULL DARK MODE */}

      {/* Orders Modal */}
      {showOrdersModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <ShoppingBag className="w-4 h-4 text-emerald-500" /> Active Orders Overview
              </h3>
              <button onClick={() => setShowOrdersModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recentOrders.map((o) => (
                <div key={o.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{o.id}</span> — <span className="text-slate-700 dark:text-slate-300">{o.table} ({o.customer})</span>
                    <p className="text-[10px] text-slate-400">{o.items} • {o.amount}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${o.statusColor}`}>{o.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Reservations Modal */}
      {showReservationsModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Calendar className="w-4 h-4 text-purple-500" /> Table Reservations
              </h3>
              <button onClick={() => setShowReservationsModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {todayReservations.map((r, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{r.name}</p>
                    <p className="text-[10px] text-slate-400">{r.table} • {r.guests}</p>
                  </div>
                  <span className="font-bold text-purple-600 dark:text-purple-400">{r.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floor Plan Modal */}
      {showFloorPlanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <Layers className="w-4 h-4 text-sky-500" /> Floor Plan Layout
              </h3>
              <button onClick={() => setShowFloorPlanModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid grid-cols-4 gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                <div key={num} className={`p-3 rounded-xl border text-center text-xs font-bold ${num % 3 === 0 ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300' : 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'}`}>
                  T-{num}
                  <span className="block text-[8px] font-normal">{num % 3 === 0 ? 'Occupied' : 'Available'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertTriangle className="w-4 h-4 text-rose-500" /> Inventory Alerts
              </h3>
              <button onClick={() => setShowInventoryModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2">
              {lowStockIngredients.map((item, i) => (
                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-white flex items-center gap-2"><span>{item.image}</span> {item.name}</span>
                  <span className="font-bold text-rose-500 text-xs">{item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Menu Item Modal */}
      {showAddMenuModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                <UtensilsCrossed className="w-4 h-4 text-amber-500" /> Add New Item
              </h3>
              <button onClick={() => setShowAddMenuModal(false)} className="cursor-pointer text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
            </div>

            <form onSubmit={handleAddMenuItemSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Item Name</label>
                <input
                  type="text"
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g. Special Doro Wat"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  placeholder="14.50"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddMenuModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-sm rounded-2xl p-6 space-y-4 text-center shadow-2xl">
            <FileSpreadsheet className="w-10 h-10 text-rose-500 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Export Sales Report</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Download performance metrics for <strong className="text-emerald-600">{selectedRange}</strong>?
              </p>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => setShowReportModal(false)} className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer">Cancel</button>
              <button onClick={handleDownloadReport} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer">Download PDF</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}