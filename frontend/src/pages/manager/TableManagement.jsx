import React, { useEffect, useState } from 'react';
import { Utensils, Plus, Trash2, X } from 'lucide-react';
import tableService from '../../services/tableService';

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({ tableNumber: '', capacity: '4', section: 'Main Dining' });

  const loadTables = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await tableService.getTables();
      setTables(list);
    } catch (err) {
      setError(err.message || 'Failed to load tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.tableNumber.trim()) return;
    setSaving(true);
    setError('');
    try {
      await tableService.createTable({
        tableNumber: formData.tableNumber.trim(),
        capacity: Number(formData.capacity) || 4,
        section: formData.section.trim() || 'Main Dining',
      });
      setIsAddOpen(false);
      setFormData({ tableNumber: '', capacity: '4', section: 'Main Dining' });
      await loadTables();
    } catch (err) {
      setError(err.message || 'Failed to add table.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setError('');
    try {
      await tableService.updateTableStatus(id, status);
      await loadTables();
    } catch (err) {
      setError(err.message || 'Failed to update table status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this table?')) return;
    setError('');
    try {
      await tableService.deleteTable(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete table.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-600" /> Table Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">Create tables, assign sections, and update statuses.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> <span>Add Table</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading tables...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {tables.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-base font-extrabold text-gray-900">
                  Table {t.tableNumber || t.table_number || t.id}
                </span>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
                  className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-500">
                Seats: {t.capacity || 4} • {t.section || 'Main Dining'}
              </p>
              <select
                value={String(t.status || 'available').toLowerCase()}
                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-bold capitalize outline-none"
              >
                <option value="available">available</option>
                <option value="occupied">occupied</option>
                <option value="reserved">reserved</option>
                <option value="cleaning">cleaning</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold uppercase">Add Table</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">TABLE NUMBER</label>
                <input
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">CAPACITY</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">SECTION</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}