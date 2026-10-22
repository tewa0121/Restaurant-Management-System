import React, { useState } from 'react';
import { Search, UserPlus, Phone, Mail, MoreVertical, Star } from 'lucide-react';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock Data for Customers
  const customers = [
    { id: 1, name: 'John Smith', phone: '+1 234-567-8901', email: 'john@example.com', visits: 12, status: 'VIP' },
    { id: 2, name: 'Sarah Johnson', phone: '+1 234-567-8902', email: 'sarah@example.com', visits: 4, status: 'Regular' },
    { id: 3, name: 'Michael Brown', phone: '+1 234-567-8903', email: 'michael@example.com', visits: 1, status: 'New' },
    { id: 4, name: 'Emily Davis', phone: '+1 234-567-8904', email: 'emily@example.com', visits: 8, status: 'Regular' },
    { id: 5, name: 'David Wilson', phone: '+1 234-567-8905', email: 'david@example.com', visits: 25, status: 'VIP' },
  ];

  // Filter customers based on search
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'VIP': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Regular': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'New': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
          <p className="text-sm text-gray-500">View and manage your restaurant guests</p>
        </div>
        <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm w-full sm:w-auto justify-center">
          <UserPlus size={18} />
          Add Customer
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by name or phone number..."
          className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Customer List (Cards for Mobile, Table for Desktop) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                <th className="px-6 py-4 font-semibold">Customer Name</th>
                <th className="px-6 py-4 font-semibold">Contact Info</th>
                <th className="px-6 py-4 font-semibold text-center">Total Visits</th>
                <th className="px-6 py-4 font-semibold text-center">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 flex flex-col gap-1">
                      <span className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {customer.phone}</span>
                      <span className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-semibold text-gray-700">{customer.visits}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(customer.status)}`}>
                      {customer.status === 'VIP' && <Star size={12} className="fill-current" />}
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="p-4 flex flex-col gap-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{customer.name}</h3>
                    <p className="text-xs text-gray-500">{customer.visits} Visits</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                <span className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {customer.phone}</span>
                <span className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> {customer.email}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">No customers found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your search term.</p>
          </div>
        )}

      </div>
    </div>
  );
}