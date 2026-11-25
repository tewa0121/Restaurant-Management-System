import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import reservationService from '../../services/reservationService';
import tableService from '../../services/tableService';

export default function ReservationManagement() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableId: '',
    date: new Date().toISOString().slice(0, 10),
    time: '19:00',
    guests: 2,
    status: 'pending',
    specialRequest: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [resList, tblList] = await Promise.all([
        reservationService.getReservations({ limit: 100 }),
        tableService.getTables(),
      ]);
      setReservations(resList);
      setTables(tblList);
      if (tblList.length > 0 && !formData.tableId) {
        setFormData((prev) => ({ ...prev, tableId: String(tblList[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      customerName: '',
      customerPhone: '',
      tableId: tables[0] ? String(tables[0].id) : '',
      date: new Date().toISOString().slice(0, 10),
      time: '19:00',
      guests: 2,
      status: 'pending',
      specialRequest: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      customerName: item.customerName || item.customer_name || item.customer || '',
      customerPhone: item.customerPhone || item.customer_phone || item.phone || '',
      tableId: item.tableId || item.table_id ? String(item.tableId || item.table_id) : '',
      date: (item.date || item.reservationDate || item.reservation_date || '').slice(0, 10),
      time: (item.time || item.reservationTime || item.reservation_time || '19:00').slice(0, 5),
      guests: item.guests ?? item.guestCount ?? item.guest_count ?? 2,
      status: String(item.status || 'pending').toLowerCase(),
      specialRequest: item.specialRequest || item.special_request || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim() || undefined,
        tableId: formData.tableId ? Number(formData.tableId) : undefined,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests) || 1,
        status: String(formData.status || 'pending').toLowerCase(),
        specialRequest: formData.specialRequest.trim() || undefined,
      };

      if (editingItem) {
        await reservationService.updateReservation(editingItem.id, payload);
      } else {
        await reservationService.createReservation(payload);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save reservation.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete reservation for ${name}?`)) return;
    setError('');
    try {
      await reservationService.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete reservation.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Reservation Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage customer table bookings, guest counts, and reservation status.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Reservation</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Customer</th>
                <th className="p-4">Table</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Guests</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length > 0 ? (
                reservations.map((r) => {
                  const custName = r.customerName || r.customer_name || r.customer || 'Guest';
                  const tblLabel =
                    r.tableNumber || r.table_number
                      ? `Table ${r.tableNumber || r.table_number}`
                      : r.tableId || r.table_id
                      ? `Table #${r.tableId || r.table_id}`
                      : '-';
                  const dateVal = (r.date || r.reservationDate || r.reservation_date || '').slice(0, 10);
                  const timeVal = (r.time || r.reservationTime || r.reservation_time || '').slice(0, 5);
                  const guestsVal = r.guests ?? r.guestCount ?? r.guest_count ?? 1;

                  return (
                    <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{custName}</td>
                      <td className="p-4">{tblLabel}</td>
                      <td className="p-4">
                        {dateVal} {timeVal}
                      </td>
                      <td className="p-4">{guestsVal}</td>
                      <td className="p-4 capitalize font-bold">{r.status || 'pending'}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(r)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(r.id, custName)}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No reservations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">
                {editingItem ? 'Edit Reservation' : 'New Reservation'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">CUSTOMER NAME</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">PHONE</label>
                  <input
                    type="text"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">TABLE</label>
                  <select
                    value={formData.tableId}
                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  >
                    <option value="">Any Table</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table {t.tableNumber || t.table_number || t.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">DATE</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">TIME</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">GUESTS</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">STATUS</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="seated">Seated</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
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