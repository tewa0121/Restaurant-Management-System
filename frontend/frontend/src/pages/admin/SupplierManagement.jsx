// src/pages/admin/SupplierManagement.jsx
import React, { useState } from 'react';
import { Truck, Plus, Trash2, Edit, X } from 'lucide-react';

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Ethiopia Meat Supplier', category: 'Fresh Poultry', phone: '+251 911 223344', status: 'Verified' },
    { id: 2, name: 'Fresh Farm Produce', category: 'Vegetables & Fruits', phone: '+251 911 556677', status: 'Verified' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', category: '', phone: '', status: 'Verified' });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: '', phone: '', status: 'Verified' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      setSuppliers(suppliers.map(sup => sup.id === editingItem.id ? { ...sup, ...formData } : sup));
    } else {
      setSuppliers([{ id: Date.now(), ...formData }, ...suppliers]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete supplier ${name}?`)) {
      setSuppliers(suppliers.filter(sup => sup.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Supplier Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage food vendors, ingredient contracts, and contact directories.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Supplier Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Phone Number</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
            {suppliers.map((sup) => (
              <tr key={sup.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                <td className="p-4 font-bold flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center font-bold">🚚</div>
                  <span>{sup.name}</span>
                </td>
                <td className="p-4 text-gray-500 dark:text-gray-400 font-semibold">{sup.category}</td>
                <td className="p-4 font-bold">{sup.phone}</td>
                <td className="p-4"><span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">✓ Verified</span></td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(sup)} className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(sup.id, sup.name)} className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">{editingItem ? 'Edit Supplier' : 'Add Supplier'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">SUPPLIER NAME</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
              </div>
              <div>
                <label className="font-bold block mb-1">CATEGORY</label>
                <input type="text" required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
              </div>
              <div>
                <label className="font-bold block mb-1">PHONE NUMBER</label>
                <input type="text" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold shadow-lg cursor-pointer">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}