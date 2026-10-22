import React, { useState } from 'react';
import { Search, User, Phone, Mail, Award, Eye, X, ShoppingBag } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function CashierCustomers() {
  // 1. STATE MANAGEMENT
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null); // Controls the modal

  // 2. DATA FETCHING
  const customers = mockDatabase.customers;

  // 3. FILTER LOGIC
  const filteredCustomers = customers.filter(customer => 
    `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customer Directory</h1>
        <p className="text-gray-500 text-sm mt-1">View customer profiles, loyalty points, and order history.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>
        <div className="hidden md:block text-sm text-gray-500 font-medium">
          Total Customers: {filteredCustomers.length}
        </div>
      </div>

      {/* CUSTOMERS TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[800px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Customer Name</th>
                <th className="px-6 py-4 font-medium">Contact Info</th>
                <th className="px-6 py-4 font-medium">Loyalty Points</th>
                <th className="px-6 py-4 font-medium">VIP Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                      {customer.first_name.charAt(0)}
                    </div>
                    <span className="font-bold text-gray-800">{customer.first_name} {customer.last_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs text-gray-500">
                      <span className="flex items-center gap-1"><Phone size={12}/> {customer.phone}</span>
                      <span className="flex items-center gap-1 mt-1"><Mail size={12}/> {customer.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <Award size={14} /> {customer.loyalty_points} pts
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {customer.is_vip ? (
                      <span className="bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full text-xs font-bold">VIP</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Regular</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
                      title="View Profile"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredCustomers.length === 0 && (
          <div className="text-center py-10 text-gray-500">No customers found.</div>
        )}
      </div>

      {/* CUSTOMER PROFILE MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="bg-[#0B1220] p-6 text-white relative">
              <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                <X size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl font-bold border-4 border-white/20">
                  {selectedCustomer.first_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedCustomer.first_name} {selectedCustomer.last_name}</h2>
                  <p className="text-gray-400 text-sm">{selectedCustomer.email}</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Spent</p>
                  <p className="font-bold text-gray-900">${selectedCustomer.total_spent?.toFixed(2) || '0.00'}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Total Orders</p>
                  <p className="font-bold text-gray-900">{selectedCustomer.total_orders || 0}</p>
                </div>
              </div>

              {/* Loyalty Points */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-100 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <Award className="text-yellow-600" size={24} />
                  <div>
                    <p className="font-bold text-gray-900">Loyalty Points</p>
                    <p className="text-xs text-gray-500">Available to redeem</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-yellow-600">{selectedCustomer.loyalty_points}</span>
              </div>

              {/* Recent Orders (Mocked preview) */}
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ShoppingBag size={16} /> Recent Order History
              </h3>
              <div className="space-y-2 mb-6">
                {/* We filter the mock orders for this customer */}
                {mockDatabase.orders.filter(o => o.customer_id === selectedCustomer.id).slice(0, 3).map(order => (
                  <div key={order.id} className="flex justify-between items-center text-sm p-2 border-b border-gray-50">
                    <div>
                      <p className="font-medium text-gray-800">#{order.order_number}</p>
                      <p className="text-xs text-gray-500">{new Date(order.ordered_at).toLocaleDateString()}</p>
                    </div>
                    <span className="font-bold text-gray-900">${order.total_amount.toFixed(2)}</span>
                  </div>
                ))}
                {mockDatabase.orders.filter(o => o.customer_id === selectedCustomer.id).length === 0 && (
                  <p className="text-sm text-gray-400">No previous orders.</p>
                )}
              </div>

              <button 
                onClick={() => setSelectedCustomer(null)}
                className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}