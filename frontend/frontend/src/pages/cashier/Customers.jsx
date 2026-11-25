// src/pages/cashier/Customers.jsx
import React, { useState } from 'react';
import { Users, Search, Award, Phone, Mail, Plus } from 'lucide-react';

export function Customers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([
    { id: 1, name: 'John Smith', phone: '+1 555-0192', email: 'john.smith@example.com', tier: 'Gold', points: 1420, visits: 24 },
    { id: 2, name: 'Sarah Johnson', phone: '+1 555-0481', email: 'sarah.j@example.com', tier: 'Platinum', points: 3150, visits: 48 },
    { id: 3, name: 'Michael Brown', phone: '+1 555-0923', email: 'mbrown@example.com', tier: 'Silver', points: 650, visits: 12 },
    { id: '4', name: 'Emily Davis', phone: '+1 555-0314', email: 'emily.d@example.com', tier: 'Gold', points: 1890, visits: 30 },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const handleAddCustomer = (e) => {
    e.preventDefault();
    if (!newName || !newPhone) return;

    const newCust = {
      id: customers.length + 1,
      name: newName,
      phone: newPhone,
      email: newEmail || 'N/A',
      tier: 'Bronze',
      points: 100,
      visits: 1
    };

    setCustomers([newCust, ...customers]);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setShowAddModal(false);
  };

  const getTierBadge = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-purple-100 text-purple-700';
      case 'Gold': return 'bg-amber-100 text-amber-700';
      case 'Silver': return 'bg-slate-100 text-slate-700';
      default: return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Cashier Customer Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage loyalty profiles, view points balance, and register new members.</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white rounded-xl text-xs font-medium border border-slate-200 outline-none shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-400 font-bold uppercase text-[10px] border-b border-slate-200">
            <tr>
              <th className="p-4">Customer Name</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Loyalty Tier</th>
              <th className="p-4">Points Balance</th>
              <th className="p-4 text-right">Total Visits</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/50">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center text-[10px]">
                    {c.name.charAt(0)}
                  </div>
                  {c.name}
                </td>
                <td className="p-4 text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" /> {c.phone}
                </td>
                <td className="p-4 text-slate-500 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" /> {c.email}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getTierBadge(c.tier)}`}>
                    {c.tier}
                  </span>
                </td>
                <td className="p-4 font-black text-emerald-600 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" /> {c.points} pts
                </td>
                <td className="p-4 text-right font-bold text-slate-900">{c.visits} visits</td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-slate-400 font-bold">No customers found matching search.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Register New Loyalty Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Turner"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="e.g. +1 555-0199"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-600 mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl cursor-pointer shadow-sm"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;