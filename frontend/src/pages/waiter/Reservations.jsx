import React, { useState } from 'react';
import { Search, Calendar, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Reservations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reservations, setReservations] = useState(mockDatabase.reservations || []);

  // 1. Filter reservations by customer name or table number
  const filteredReservations = reservations.filter(res => {
    const customer = mockDatabase.customers.find(c => c.id === res.customer_id);
    const customerName = customer ? `${customer.first_name} ${customer.last_name}`.toLowerCase() : '';
    const tableNum = String(res.table_id);
    
    return customerName.includes(searchTerm.toLowerCase()) || tableNum.includes(searchTerm);
  });

  // 2. Handle Check-in (Change status to 'seated')
  const handleCheckIn = (id) => {
    setReservations(prev => prev.map(res => 
      res.id === id ? { ...res, status: 'seated' } : res
    ));
  };

  // 3. Handle Cancel (Change status to 'cancelled')
  const handleCancel = (id) => {
    if(window.confirm("Are you sure you want to cancel this reservation?")) {
      setReservations(prev => prev.map(res => 
        res.id === id ? { ...res, status: 'cancelled' } : res
      ));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-500 text-sm mt-1">Manage today's table bookings.</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          <Calendar size={18} className="text-green-600" />
          <span className="font-semibold text-gray-700">Today, May 20</span>
        </div>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by Customer or Table..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left min-w-[700px]">
            <thead className="bg-gray-50 text-xs text-gray-500 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Table</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Guests</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredReservations.map((res) => {
                const customer = mockDatabase.customers.find(c => c.id === res.customer_id);
                return (
                  <tr key={res.id} className="hover:bg-gray-50/50">
                    <td className="px-6 py-4 font-bold text-gray-800">
                      {customer ? `${customer.first_name} ${customer.last_name}` : 'Guest'}
                    </td>
                    <td className="px-6 py-4 text-gray-600 font-medium">Table {res.table_id}</td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-400" /> {res.reservation_time}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Users size={14} className="text-gray-400" /> {res.guest_count} Guests
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        res.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                        res.status === 'seated' ? 'bg-green-100 text-green-700' :
                        res.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {res.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {res.status === 'confirmed' && (
                        <>
                          <button 
                            onClick={() => handleCheckIn(res.id)}
                            className="bg-green-50 text-green-600 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            Check-In
                          </button>
                          <button 
                            onClick={() => handleCancel(res.id)}
                            className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                      {res.status === 'seated' && (
                        <span className="text-xs text-green-600 font-bold flex items-center gap-1 justify-end">
                          <CheckCircle size={14} /> Seated
                        </span>
                      )}
                      {res.status === 'cancelled' && (
                        <span className="text-xs text-red-600 font-bold flex items-center gap-1 justify-end">
                          <XCircle size={14} /> Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filteredReservations.length === 0 && (
          <div className="text-center py-10 text-gray-500">No reservations found.</div>
        )}
      </div>

    </div>
  );
}