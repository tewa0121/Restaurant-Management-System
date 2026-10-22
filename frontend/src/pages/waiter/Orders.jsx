import React from 'react';
import { Clock, CheckCircle2, ChefHat, ChevronRight, MessageSquare } from 'lucide-react';

export default function Orders() {
  const orders = [
    { id: '#ORD-101', table: 'Table 2', items: 3, status: 'Preparing', time: '12:35 PM', total: '$45.50' },
    { id: '#ORD-102', table: 'Table 5', items: 5, status: 'Ready', time: '12:40 PM', total: '$78.20' },
    { id: '#ORD-103', table: 'Table 3', items: 2, status: 'Delayed', time: '12:15 PM', total: '$32.00' },
    { id: '#ORD-104', table: 'Table 8', items: 7, status: 'Preparing', time: '12:50 PM', total: '$120.00' },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Preparing': return <ChefHat className="text-orange-500" size={18} />;
      case 'Ready': return <CheckCircle2 className="text-green-500" size={18} />;
      case 'Delayed': return <Clock className="text-red-500" size={18} />;
      default: return <Clock className="text-gray-500" size={18} />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Preparing': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Ready': return 'bg-green-50 text-green-700 border-green-200';
      case 'Delayed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Active Orders</h1>
        <p className="text-sm text-gray-500">Manage and track your current tables</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
            
            {/* Left: Order Info */}
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl border ${getStatusStyle(order.status)}`}>
                {getStatusIcon(order.status)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-800 text-lg">{order.table}</h3>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{order.id}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{order.items} Items • Ordered at {order.time}</p>
              </div>
            </div>

            {/* Middle: Status */}
            <div className="flex items-center sm:justify-center">
              <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0">
              <span className="font-bold text-gray-800 text-lg">{order.total}</span>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg transition-colors" title="Add Note">
                  <MessageSquare size={18} />
                </button>
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                  Manage <ChevronRight size={16} />
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}