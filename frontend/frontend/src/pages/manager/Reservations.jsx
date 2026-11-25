// src/pages/manager/Reservations.jsx
import React, { useState } from 'react';
import { Calendar, Plus, CheckCircle, XCircle, Search, X } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Reservations() {
  const [reservations, setReservations] = useState(mockDatabase.reservations || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Reservation Form State
  const [customerName, setCustomerName] = useState('');
  const [partySize, setPartySize] = useState('2');
  const [resDate, setResDate] = useState('2025-05-20');
  const [resTime, setResTime] = useState('19:00');

  const filteredReservations = reservations.filter(r => 
    (r.customer_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirm = (id) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
  };

  const handleCancel = (id) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
  };

  const handleAddReservation = (e) => {
    e.preventDefault();
    const newRes = {
      id: Date.now(),
      customer_name: customerName,
      party_size: parseInt(partySize, 10),
      reservation_date: resDate,
      reservation_time: resTime,
      status: 'confirmed'
    };
    setReservations([newRes, ...reservations]);
    setCustomerName('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-500" /> Reservations
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Bookings, party sizes, and reservation statuses.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search customer..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <button 
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-purple-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Reservation
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-b border-slate-200 dark:border-slate-700">
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Party Size</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredReservations.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-800 dark:text-white">{res.customer_name || 'Guest'}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{res.party_size} Guests</td>
                  <td className="p-4 text-slate-500">{res.reservation_date} at {res.reservation_time}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : res.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {res.status !== 'confirmed' && (
                      <button 
                        type="button"
                        onClick={() => handleConfirm(res.id)} 
                        className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                        title="Confirm"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    {res.status !== 'cancelled' && (
                      <button 
                        type="button"
                        onClick={() => handleCancel(res.id)} 
                        className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                        title="Cancel"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Reservation Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Reservation</h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddReservation} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName} 
                  onChange={(e) => setCustomerName(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Party Size</label>
                <input 
                  type="number" 
                  value={partySize} 
                  onChange={(e) => setPartySize(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={resDate} 
                    onChange={(e) => setResDate(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={resTime} 
                    onChange={(e) => setResTime(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-2 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-purple-600 text-white rounded-xl font-semibold">Save Reservation</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}