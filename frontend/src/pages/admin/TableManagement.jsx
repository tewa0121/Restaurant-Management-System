import React, { useEffect, useState } from 'react';
import { Grid, Plus, Trash2, Edit, X } from 'lucide-react';
import tableService from '../../services/tableService';

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'out_of_order', label: 'Out of Order' },
];

export default function TableManagement() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: 4,
    section: 'Main Hall',
    status: 'available',
    shape: 'square',
  });

  const loadTables = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await tableService.getTables();
      setTables(data);
    } catch (err) {
      setError(err.message || 'Failed to load tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleOpenAdd = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: 4,
      section: 'Main Hall',
      status: 'available',
      shape: 'square',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tbl) => {
    setEditingTable(tbl);
    setFormData({
      tableNumber: tbl.tableNumber || tbl.table_number || tbl.name || '',
      capacity: tbl.capacity || 4,
      section: tbl.section || tbl.location || 'Main Hall',
      status: String(tbl.status || 'available').toLowerCase(),
      shape: tbl.shape || 'square',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        tableNumber: String(formData.tableNumber).trim(),
        capacity: Number(formData.capacity),
        section: String(formData.section || 'Main Hall').trim(),
        status: String(formData.status || 'available').toLowerCase(),
        shape: formData.shape || 'square',
      };

      if (editingTable) {
        await tableService.updateTable(editingTable.id, payload);
      } else {
        await tableService.createTable(payload);
      }

      setIsModalOpen(false);
      setEditingTable(null);
      await loadTables();
    } catch (err) {
      setError(err.message || 'Failed to save table.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete ${label}?`)) return;
    setError('');
    try {
      await tableService.deleteTable(id);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete table.');
    }
  };

  const getBadgeStyle = (status) => {
    const key = String(status || '').toLowerCase();
    if (key === 'available') return 'bg-emerald-50 text-emerald-600';
    if (key === 'occupied') return 'bg-rose-50 text-rose-600';
    if (key === 'reserved') return 'bg-amber-50 text-amber-600';
    return 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Table Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Configure dining tables, seating capacity, and status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Table</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white dark:bg-[#122448] p-8 rounded-2xl border border-gray-100 dark:border-gray-800 text-center text-xs text-gray-400">
          Loading tables...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tables.map((tbl) => {
            const displayName = tbl.name || `Table ${tbl.tableNumber || tbl.table_number || tbl.id}`;
            const statusLabel = tbl.statusLabel || tbl.status || 'Available';
            return (
              <div
                key={tbl.id}
                className="bg-white dark:bg-[#122448] p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                      <Grid className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{displayName}</h3>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tbl)}
                      className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tbl.id, displayName)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-xs space-y-1 text-gray-500 dark:text-gray-400">
                  <p>Capacity: {tbl.capacity} Persons</p>
                  <p>Location: {tbl.section || tbl.location || 'Main Hall'}</p>
                </div>
                <div className="pt-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getBadgeStyle(tbl.status)}`}>
                    {statusLabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">TABLE NUMBER / NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1 or T-1"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">CAPACITY</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">STATUS</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">LOCATION / SECTION</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold"
                >
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