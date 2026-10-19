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
                </div>
              ))}
            </div>
          </div>
        </div>

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

      </div>
    </div>
  );
}