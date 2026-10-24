// src/pages/waiter/OrderHistory.jsx
import React, { useState } from 'react';
import { History, CheckCircle2, Search, DollarSign, Calendar } from 'lucide-react';

export default function WaiterOrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  const [completedOrders] = useState([
    { id: '#ORD-1245', table: 'Table 1', items: '3 items', total: '$42.50', time: '09:45 AM', server: 'David Waiter', status: 'Completed' },
    { id: '#ORD-1240', table: 'Table 4', items: '2 items', total: '$28.00', time: '09:15 AM', server: 'David Waiter', status: 'Completed' },
    { id: '#ORD-1238', table: 'Table 9', items: '5 items', total: '$68.90', time: '08:50 AM', server: 'David Waiter', status: 'Completed' },
    { id: '#ORD-1235', table: 'Table 2', items: '1 item', total: '$14.50', time: '08:20 AM', server: 'David Waiter', status: 'Completed' },
  ]);

  const filteredOrders = completedOrders.filter(o =>
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.table.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-emerald-500" /> Completed Orders History
          </h1>
          <p className="text-xs text-slate-500 font-medium">Audit log of all served and fulfilled customer orders during your shift.</p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Order ID or Table..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Order ID</th>
              <th className="p-4">Table</th>
              <th className="p-4">Items</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Time Completed</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredOrders.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-all">
                <td className="p-4 font-bold text-blue-600">{item.id}</td>
                <td className="p-4 font-bold text-slate-900">{item.table}</td>
                <td className="p-4 text-slate-500">{item.items}</td>
                <td className="p-4 font-black text-slate-900">{item.total}</td>
                <td className="p-4 text-slate-400">{item.time}</td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-xs font-bold">
            No completed orders found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}
