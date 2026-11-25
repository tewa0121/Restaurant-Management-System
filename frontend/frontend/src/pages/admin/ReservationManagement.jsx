// src/pages/admin/ReservationManagement.jsx
import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Edit, X } from 'lucide-react';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([
    { id: '#RES-101', customer: 'Abebe Bikila', table: 'Table 3', date: '2025-05-21', time: '19:00', guests: 4, status: 'Confirmed' },
    { id: '#RES-102', customer: 'Tigist Assefa', table: 'Table 12', date: '2025-05-21', time: '20:30', guests: 2, status: 'Pending' },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ customer: '', table: 'Table 1', date: '2025-05-21', time: '19:00', guests: 2, status: 'Pending' });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ customer: '', table: 'Table 1', date: '2025-05-21', time: '19:00', guests: 2, status: 'Pending' });
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
      setReservations(reservations.map(r => r.id === editingItem.id ? { ...r, ...formData } : r));
    } else {
      setReservations([{ id: `#RES-${Math.floor(100 + Math.random() * 900)}`, ...formData }, ...reservations]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete reservation for ${name}?`)) {
      setReservations(reservations.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Reservation Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Schedule, track, and update table bookings for guests.</p>
        </div>
        <button onClick={handleOpenAdd} className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Reservation ID</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Table</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                <td className="p-4 font-bold text-rose-600 dark:text-rose-400">{r.id}</td>
                <td className="p-4 font-semibold">{r.customer}</td>
                <td className="p-4 text-gray-500 dark:text-gray-400">{r.table}</td>
                <td className="p-4 font-medium">{r.date} at {r.time}</td>
                <td className="p-4 font-extrabold">{r.guests} Persons</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${r.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button onClick={() => handleOpenEdit(r)} className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(r.id, r.customer)} className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"><Trash2 className="w-4 h-4" /></button>
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
              <h3 className="font-extrabold uppercase">{editingItem ? 'Edit Booking' : 'New Reservation'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">CUSTOMER NAME</label>
                <input type="text" required value={formData.customer} onChange={(e) => setFormData({ ...formData, customer: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">TABLE</label>
                  <select value={formData.table} onChange={(e) => setFormData({ ...formData, table: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                    <option value="Table 1">Table 1</option>
                    <option value="Table 2">Table 2</option>
                    <option value="Table 3">Table 3</option>
                    <option value="Table 12">Table 12</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">GUESTS</label>
                  <input type="number" required value={formData.guests} onChange={(e) => setFormData({ ...formData, guests: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">DATE</label>
                  <input type="date" required value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none" />
                </div>
                <div>
                  <label className="font-bold block mb-1">STATUS</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none">
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                  </select>
                </div>
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