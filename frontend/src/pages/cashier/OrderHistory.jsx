import React, { useState } from 'react';
import { Search, Filter, Download, Eye } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function OrderHistory() {
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch completed orders from mock data
  const historyOrders = mockDatabase.orders.filter(o => o.status === 'completed');

  // Filter by search
  const filteredOrders = historyOrders.filter(order => 
    order.order_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to render status badges safely
  const renderStatus = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-green-50 text-green-600 border border-green-100">Completed</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-red-50 text-red-600 border border-red-100">Cancelled</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-gray-50 text-gray-600 border border-gray-100">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="text-gray-500 text-sm mt-1">View all completed and past orders.</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>
        <button className="flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
          <Filter size={16} /> Filter by Date
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => {
                const customer = mockDatabase.customers.find(c => c.id === order.customer_id);
                return (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 text-[#6366F1] font-bold">#{order.order_number}</td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {customer ? `${customer.first_name} ${customer.last_name}` : 'Walk-in'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">Table {order.table_id}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">${order.total_amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{renderStatus(order.status)}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(order.ordered_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredOrders.length === 0 && (
          <div className="text-center py-10 text-gray-500">
            No completed orders found.
          </div>
        )}
      </div>

    </div>
  );
}