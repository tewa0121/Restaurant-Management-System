// src/pages/manager/Suppliers.jsx
import React, { useState } from 'react';
import { Truck, Plus, Search, Edit3, Trash2, X, Phone, Mail, Building2, AlertTriangle } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(mockDatabase.suppliers || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentSup, setCurrentSup] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Produce');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const filteredSuppliers = suppliers.filter(sup => {
    const supName = (sup.name || '').toLowerCase();
    const contact = (sup.contact_person || sup.contact || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    return supName.includes(term) || contact.includes(term);
  });

  const handleAddSupplier = (e) => {
    e.preventDefault();
    const newSup = {
      id: Date.now(),
      name,
      category,
      contact_person: contactPerson,
      email: email || `${name.toLowerCase().replace(/\s+/g, '')}@supplier.com`,
      phone: phone || '+1 (555) 019-2834'
    };
    setSuppliers([newSup, ...suppliers]);
    setIsAddOpen(false);
    setName('');
    setCategory('Produce');
    setContactPerson('');
    setEmail('');
    setPhone('');
  };

  const handleOpenEdit = (sup) => {
    setCurrentSup(sup);
    setName(sup.name || '');
    setCategory(sup.category || 'Produce');
    setContactPerson(sup.contact_person || sup.contact || '');
    setEmail(sup.email || '');
    setPhone(sup.phone || '');
    setIsEditOpen(true);
  };

  const handleEditSupplier = (e) => {
    e.preventDefault();
    if (!currentSup) return;
    setSuppliers(suppliers.map(sup => sup.id === currentSup.id ? {
      ...sup,
      name,
      category,
      contact_person: contactPerson,
      email,
      phone
    } : sup));
    setIsEditOpen(false);
    setCurrentSup(null);
  };

  const confirmDelete = () => {
    if (!currentSup) return;
    setSuppliers(suppliers.filter(sup => sup.id !== currentSup.id));
    setIsDeleteOpen(false);
    setCurrentSup(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-500" /> Supplier Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage ingredient vendors, delivery contacts, and supply chain partners.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search supplier..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <button 
            type="button"
            onClick={() => { setName(''); setCategory('Produce'); setContactPerson(''); setEmail(''); setPhone(''); setIsAddOpen(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Supplier
          </button>
        </div>
      </div>

      {/* Suppliers Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSuppliers.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No suppliers found matching your search.
          </div>
        ) : (
          filteredSuppliers.map((sup) => (
            <div 
              key={sup.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {sup.category || 'Produce'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                    {sup.name}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                    Contact: {sup.contact_person || sup.contact || 'N/A'}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-2 truncate">
                    <Mail className="w-3 h-3 shrink-0" /> {sup.email || 'No email provided'}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                    <Phone className="w-3 h-3 shrink-0" /> {sup.phone || 'No phone provided'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                  Active Partner
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    type="button"
                    onClick={() => handleOpenEdit(sup)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Supplier"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setCurrentSup(sup); setIsDeleteOpen(true); }}
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Supplier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && currentSup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete "{currentSup.name}"?</h3>
            </div>
            <p className="text-slate-500">Are you sure you want to remove this supplier? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Supplier Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Supplier</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="e.g. Fresh Valley Farms"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dry Goods">Dry Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    value={contactPerson} 
                    onChange={(e) => setContactPerson(e.target.value)} 
                    placeholder="Jane Smith"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="orders@freshvalley.com"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="+1 (555) 382-9100"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Supplier Modal */}
      {isEditOpen && currentSup && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Edit Supplier Details</h3>
              <button type="button" onClick={() => setIsEditOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleEditSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Company Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Category</label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  >
                    <option value="Produce">Produce</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Meat">Meat</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Dry Goods">Dry Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Contact Person</label>
                  <input 
                    type="text" 
                    value={contactPerson} 
                    onChange={(e) => setContactPerson(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-semibold">Update Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}