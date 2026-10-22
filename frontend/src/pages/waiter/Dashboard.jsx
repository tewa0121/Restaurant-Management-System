import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Utensils, ClipboardList, Clock, CheckCircle, Bell, 
  ArrowRight, RefreshCw, DollarSign, Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function WaiterDashboard() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  // Simulated live update for the "Updated just now" text
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  // --- MOCK DATA (Based on your UI screenshot) ---
  const stats = {
    myActiveTables: { value: 6, sub: 'of 12 Assigned' },
    activeOrders: { value: 14, sub: 'In Progress' },
    readyToServe: { value: 5, sub: 'Orders' },
    completedOrders: { value: 18, sub: 'Today' },
    newRequests: { value: 3, sub: 'From Tables' }
  };

  const myTables = [
    { table: 'Table 5', guests: 4, status: 'Ordering', lastOrder: '10:20 AM' },
    { table: 'Table 7', guests: 2, status: 'Food Preparing', lastOrder: '10:18 AM' },
    { table: 'Table 12', guests: 6, status: 'Ready to Serve', lastOrder: '10:15 AM' },
    { table: 'Table 3', guests: 3, status: 'Ordering', lastOrder: '10:10 AM' },
    { table: 'Table 15', guests: 2, status: 'Food Preparing', lastOrder: '10:08 AM' },
    { table: 'Table 8', guests: 5, status: 'Ready to Serve', lastOrder: '10:05 AM' },
  ];

  const orderStatusData = [
    { name: 'Pending', value: 4, color: '#3B82F6' }, // Blue
    { name: 'Preparing', value: 5, color: '#F59E0B' }, // Orange
    { name: 'Ready', value: 5, color: '#10B981' }, // Green
    { name: 'Served', value: 0, color: '#E5E7EB' }, // Gray
  ];

  const recentOrders = [
    { id: 'ORD-1250', table: 'Table 5', items: 3, status: 'Preparing', time: '10:20 AM' },
    { id: 'ORD-1249', table: 'Table 7', items: 4, status: 'Preparing', time: '10:18 AM' },
    { id: 'ORD-1248', table: 'Table 12', items: 5, status: 'Ready', time: '10:15 AM' },
    { id: 'ORD-1247', table: 'Table 3', items: 2, status: 'Preparing', time: '10:10 AM' },
    { id: 'ORD-1246', table: 'Table 15', items: 3, status: 'Pending', time: '10:08 AM' },
  ];

  const customerRequests = [
    { table: 'Table 7', request: 'Extra Napkins', time: '2 min ago', status: 'New', icon: '🧻' },
    { table: 'Table 12', request: 'More Water', time: '5 min ago', status: 'New', icon: '💧' },
    { table: 'Table 3', request: 'Check on Order', time: '8 min ago', status: 'In Progress', icon: '💬' },
  ];

  const todaySummary = [
    { label: 'Orders Taken', value: 28, icon: ClipboardList, color: 'text-blue-500' },
    { label: 'Orders Served', value: 18, icon: CheckCircle, color: 'text-green-500' },
    { label: 'Average Order Time', value: '24 min', icon: Clock, color: 'text-orange-500' },
    { label: 'Revenue Generated', value: '$1,245.50', icon: DollarSign, color: 'text-purple-500' },
  ];

  const floorOverview = [
    { table: '1', status: 'available' }, { table: '2', status: 'available' }, { table: '3', status: 'ordering' },
    { table: '4', status: 'available' }, { table: '5', status: 'ordering' }, { table: '6', status: 'available' },
    { table: '7', status: 'preparing' }, { table: '8', status: 'available' }, { table: '9', status: 'available' },
    { table: '10', status: 'available' }, { table: '11', status: 'available' }, { table: '12', status: 'ready' },
    { table: '13', status: 'available' }, { table: '14', status: 'available' }, { table: '15', status: 'ordering' },
    { table: '16', status: 'available' }, { table: '17', status: 'available' }, { table: '18', status: 'not-assigned' },
  ];

  return (
    <div className="space-y-6 font-sans bg-gray-50 min-h-screen">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, David! 👋</h1>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening in your shift.</p>
      </div>

      {/* 5 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <KpiCard title="My Active Tables" value={stats.myActiveTables.value} sub={stats.myActiveTables.sub} icon={Utensils} color="bg-blue-50 text-blue-600" />
        <KpiCard title="Active Orders" value={stats.activeOrders.value} sub={stats.activeOrders.sub} icon={ClipboardList} color="bg-green-50 text-green-600" />
        <KpiCard title="Ready to Serve" value={stats.readyToServe.value} sub={stats.readyToServe.sub} icon={Clock} color="bg-orange-50 text-orange-600" />
        <KpiCard title="Completed Orders" value={stats.completedOrders.value} sub={stats.completedOrders.sub} icon={CheckCircle} color="bg-purple-50 text-purple-600" />
        <KpiCard title="New Requests" value={stats.newRequests.value} sub={stats.newRequests.sub} icon={Bell} color="bg-red-50 text-red-600" />
      </div>

      {/* ROW 2: Tables, Donut, Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MY ACTIVE TABLES */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">My Active Tables</h3>
            <button onClick={() => navigate('/waiter/my-tables')} className="text-sm text-blue-600 font-medium hover:underline">View Floor Plan</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myTables.map((t, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-800">{t.table}</td>
                    <td className="px-4 py-3 text-gray-600">{t.guests} Guests</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        t.status === 'Ordering' ? 'bg-blue-50 text-blue-600' :
                        t.status === 'Food Preparing' ? 'bg-orange-50 text-orange-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs font-bold text-green-600 hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 text-xs text-gray-400 border-t border-gray-50">
            Showing 1 to 6 of 6 tables
          </div>
        </div>

        {/* ORDER STATUS OVERVIEW (Donut Chart) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <h3 className="font-bold text-gray-800 mb-2">Order Status Overview</h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie 
                  data={orderStatusData} 
                  innerRadius={50} 
                  outerRadius={75} 
                  paddingAngle={0} 
                  dataKey="value" 
                  stroke="none"
                  startAngle={90}
                  endAngle={-270}
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-2xl font-bold text-gray-900">14</span>
              <span className="text-xs text-gray-500">Active Orders</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {orderStatusData.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                  {item.name}
                </div>
                <span className="font-bold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1 mt-4 text-[10px] text-gray-400">
            <RefreshCw size={10} /> Updated just now
          </div>
        </div>

        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Recent Orders</h3>
            <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-blue-600">#{order.id}</td>
                    <td className="px-4 py-3 text-gray-600">{order.table}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                        order.status === 'Preparing' ? 'bg-orange-50 text-orange-600' :
                        order.status === 'Ready' ? 'bg-green-50 text-green-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ROW 3: Requests, Summary, Floor Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CUSTOMER REQUESTS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Customer Requests</h3>
            <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
          </div>
          <div className="space-y-3">
            {customerRequests.map((req, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="text-xl bg-white p-1.5 rounded-md shadow-sm">{req.icon}</div>
                  <div>
                    <p className="font-bold text-gray-800 text-xs">{req.table}</p>
                    <p className="text-[10px] text-gray-500">{req.request}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block">{req.time}</span>
                  <span className={`text-[10px] font-bold ${req.status === 'New' ? 'text-blue-600' : 'text-orange-600'}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TODAY'S SUMMARY */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <h3 className="font-bold text-gray-800 mb-4">Today's Summary</h3>
          <div className="space-y-4">
            {todaySummary.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 text-gray-600">
                  <item.icon size={16} className={item.color} />
                  {item.label}
                </div>
                <span className="font-bold text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ASSIGNED TABLES (FLOOR OVERVIEW) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Assigned Tables (Floor Overview)</h3>
            <a href="#" className="text-xs text-blue-600 font-medium hover:underline">View Floor Plan</a>
          </div>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {floorOverview.map((t, i) => (
              <div 
                key={i} 
                className={`p-2 rounded-lg text-center text-xs font-bold border ${
                  t.status === 'available' ? 'bg-green-50 border-green-200 text-green-700' :
                  t.status === 'ordering' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  t.status === 'preparing' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                  t.status === 'ready' ? 'bg-green-50 border-green-200 text-green-700' :
                  'bg-gray-50 border-gray-200 text-gray-400'
                }`}
              >
                {t.table}
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 text-[10px] text-gray-500">
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Available</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Ordering</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Preparing</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-600"></span> Ready to Serve</div>
            <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Not Assigned</div>
          </div>
        </div>

      </div>

      {/* ROW 4: Quick Actions & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <ActionButton label="New Order" icon={ClipboardList} onClick={() => navigate('/waiter/new-order')} />
            <ActionButton label="View Tables" icon={Utensils} onClick={() => navigate('/waiter/tables')} />
            <ActionButton label="Customer Requests" icon={Bell} onClick={() => navigate('/waiter/customer-requests')} />
            <ActionButton label="Reservations" icon={Calendar} onClick={() => navigate('/waiter/reservations')} />
            <ActionButton label="Order History" icon={Clock} onClick={() => navigate('/waiter/order-history')} />
          </div>
        </div>

        {/* NOTIFICATIONS */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            <a href="#" className="text-sm text-blue-600 font-medium hover:underline">View All</a>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex gap-2 text-gray-700">
              <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
              <p>Order #ORD-1248 from Table 12 is ready to serve. <span className="text-gray-400 ml-2">2 min ago</span></p>
            </div>
            <div className="flex gap-2 text-gray-700">
              <Bell size={14} className="text-orange-500 mt-0.5 shrink-0" />
              <p>New request from Table 7: Extra Napkins. <span className="text-gray-400 ml-2">2 min ago</span></p>
            </div>
            <div className="flex gap-2 text-gray-700">
              <Calendar size={14} className="text-blue-500 mt-0.5 shrink-0" />
              <p>Reservation for Table 8 at 7:00 PM. <span className="text-gray-400 ml-2">15 min ago</span></p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function KpiCard({ title, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 font-medium">{sub}</p>
    </div>
  );
}

function ActionButton({ label, icon: Icon, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center justify-center p-3 border border-gray-100 rounded-xl hover:shadow-md hover:border-blue-200 transition-all bg-white">
      <div className="p-2 rounded-full mb-2 bg-blue-50 text-blue-600">
        <Icon size={18} />
      </div>
      <span className="text-[10px] font-medium text-gray-700 text-center leading-tight">{label}</span>
    </button>
  );
}