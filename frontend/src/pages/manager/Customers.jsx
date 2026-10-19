// src/pages/manager/Customers.jsx
import React, { useState } from 'react';
import { UserCheck, Plus, Search, Mail, Phone, ShoppingBag, Trash2, AlertTriangle, X } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';
import { formatCurrency } from '../../utils/formatters';

export default function Customers() {
  const [customers, setCustomers] = useState(mockDatabase.customers || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentCust, setCurrentCust] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filtered = customers.filter(c => 
    (c.name || c.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = (e) => {
    e.preventDefault();
    const newCust = {
      id: Date.now(),
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: phone || '+1 (555) 019-2834',
      total_orders: 1,
      total_spent: 45.00
    };
    setCustomers([newCust, ...customers]);
    setIsAddOpen(false);
    setName('');
    setEmail('');
    setPhone('');
  };

  const confirmDelete = () => {
    if (!currentCust) return;
    setCustomers(customers.filter(c => c.id !== currentCust.id));
    setIsDeleteOpen(false);
    setCurrentCust(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-emerald-500" /> Customer Management
          </h1>
          <p className="text-xs text-slate-500">Track regular guests, contact info, and total spend history.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search customer..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full bg-white dark:bg-slate-800 border rounded-xl pl-10 pr-4 py-2 text-xs"
            />
          </div>
          <button type="button" onClick={() => setIsAddOpen(true)} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((cust) => (
          <div key={cust.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                  {(cust.name || cust.full_name || 'G')[0]}
                </div>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                  {cust.total_orders || 2} Orders
                </span>
              </div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">{cust.name || cust.full_name || 'Valued Guest'}</h3>
              <p className="text-[11px] text-slate-400 flex items-center gap-1"><Mail className="w-3 h-3" /> {cust.email || 'guest@restomanager.com'}</p>
              <p className="text-[11px] text-slate-400 flex items-center gap-1"><Phone className="w-3 h-3" /> {cust.phone || '+1 (555) 019-2834'}</p>
            </div>
            <div className="pt-3 border-t flex justify-between items-center text-xs">
              <span className="font-extrabold text-slate-800 dark:text-white">{formatCurrency(cust.total_spent || 120.00)}</span>
              <button type="button" onClick={() => { setCurrentCust(cust); setIsDeleteOpen(true); }} className="p-1.5 bg-rose-50 text-rose-600 rounded-lg cursor-pointer" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      {isDeleteOpen && currentCust && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete Customer?</h3>
            </div>
            <p className="text-slate-500">Are you sure you want to remove this customer record?</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Customer</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" placeholder="Customer Name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2" />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2" />
              <input type="text" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-700 border rounded-xl px-3 py-2" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}