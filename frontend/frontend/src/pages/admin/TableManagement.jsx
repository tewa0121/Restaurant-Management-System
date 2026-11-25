// src/pages/admin/TableManagement.jsx
import React, { useState } from 'react';
import { Grid, Plus, Trash2, Edit, X, Search } from 'lucide-react';

export default function TableManagement() {
  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', capacity: 4, location: 'Main Hall', status: 'Available' },
    { id: 2, name: 'Table 2', capacity: 2, location: 'Window Side', status: 'Occupied' },
    { id: 3, name: 'Table 3', capacity: 6, location: 'VIP Section', status: 'Reserved' },
    { id: 4, name: 'Table 4', capacity: 4, location: 'Main Hall', status: 'Available' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({ name: '', capacity: 4, location: 'Main Hall', status: 'Available' });

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({ name: '', capacity: 4, location: 'Main Hall', status: 'Available' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tbl) => {
    setEditingTable(tbl);
    setFormData({ name: tbl.name, capacity: tbl.capacity, location: tbl.location, status: tbl.status });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTable) {
      setTables(tables.map(t => t.id === editingTable.id ? { ...t, ...formData } : t));
    } else {
      setTables([{ id: Date.now(), ...formData }, ...tables]);
    }
    setIsModalOpen(false);
    setEditingTable(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      setTables(tables.filter(t => t.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Table Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure dining tables, seating capacity, and status.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tables.map((tbl) => (
          <div key={tbl.id} className="bg-white dark:bg-[#122448] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 relative group">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600"><Grid className="w-4 h-4" /></div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">{tbl.name}</h3>
              </div>
              <div className="flex items-center space-x-1">
                <button onClick={() => handleOpenEdit(tbl)} className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"><Edit className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(tbl.id, tbl.name)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-gray-800 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
              <p>Capacity: {tbl.capacity} Persons</p>
              <p>Location: {tbl.location}</p>
            </div>
            <div className="pt-2">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                tbl.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                tbl.status === 'Occupied' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
              }`}>
                {tbl.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">{editingTable ? 'Edit Table' : 'Add New Table'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">TABLE NAME</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">CAPACITY</label>
                  <input type="number" required value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="font-bold block mb-1">STATUS</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none">
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Reserved">Reserved</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">LOCATION</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none" />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}