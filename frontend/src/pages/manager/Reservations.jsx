import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import reservationService from '../../services/reservationService';
import tableService from '../../services/tableService';

const VALID_STATUSES = ['pending', 'confirmed', 'seated', 'cancelled', 'no_show'];

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    tableId: '',
    partySize: '2',
    reservationDate: new Date().toISOString().slice(0, 10),
    reservationTime: '19:00',
  });

  const loadReservations = async () => {
    setLoading(true);
    setError('');
    try {
      const [list, tblList] = await Promise.all([
        reservationService.getReservations({ limit: 150 }),
        tableService.getTables().catch(() => []),
      ]);
      setReservations(list);
      setTables(tblList);
      if (tblList.length > 0 && !formData.tableId) {
        setFormData((prev) => ({ ...prev, tableId: String(tblList[0].id) }));
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.data?.message ||
          err.message ||
          'Failed to load reservations.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.reservationDate || saving) return;
    setSaving(true);
    setError('');
    try {
      const timeValue = (formData.reservationTime || '19:00').slice(0, 5);
      await reservationService.createReservation({
        customerName: formData.customerName.trim(),
        customerPhone: formData.customerPhone.trim() || undefined,
        tableId: formData.tableId ? Number(formData.tableId) : undefined,
        partySize: Number(formData.partySize) || 2,
        date: formData.reservationDate,
        time: timeValue,
      });
      setIsAddOpen(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        tableId: tables[0] ? String(tables[0].id) : '',
        partySize: '2',
        reservationDate: new Date().toISOString().slice(0, 10),
        reservationTime: '19:00',
      });
      await loadReservations();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.data?.message ||
          err.message ||
          'Failed to create reservation.'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id, status) => {
    const normalized = String(status || '').toLowerCase();
    if (!VALID_STATUSES.includes(normalized)) {
      setError(`Invalid status "${status}".`);
      return;
    }
    setError('');
    try {
      await reservationService.updateReservationStatus(id, normalized);
      await loadReservations();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.data?.message ||
          err.message ||
          'Failed to update reservation status.'
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reservation?')) return;
    setError('');
    try {
      await reservationService.deleteReservation(id);
      setReservations((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.data?.message ||
          err.message ||
          'Failed to delete reservation.'
      );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-emerald-600" /> Reservations
          </h1>
          <p className="text-xs text-gray-500 mt-1">Manage guest table bookings and statuses.</p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" /> <span>New Reservation</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Guest</th>
              <th className="p-4">Table</th>
              <th className="p-4">Guests</th>
              <th className="p-4">Date & Time</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  Loading reservations...
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-400">
                  No reservations found.
                </td>
              </tr>
            ) : (
              reservations.map((r) => {
                const st = String(r.status || 'pending').toLowerCase();
                const isLocked = st === 'seated';
                return (
                  <tr key={r.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-bold text-gray-900">
                      {r.customerName || r.customer_name || 'Guest'}
                    </td>
                    <td className="p-4 text-gray-600">
                      {r.tableNumber || r.table_number ? `Table ${r.tableNumber || r.table_number}` : '-'}
                    </td>
                    <td className="p-4 text-gray-600">
                      {r.partySize ?? r.party_size ?? r.guests ?? 2}
                    </td>
                    <td className="p-4 text-gray-600">
                      {(r.reservationDate || r.reservation_date || '').slice(0, 10)}{' '}
                      {(r.reservationTime || r.reservation_time || '').slice(0, 5)}
                    </td>
                    <td className="p-4">
                      {isLocked ? (
                        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold capitalize">
                          seated
                        </span>
                      ) : (
                        <select
                          value={st}
                          onChange={(e) => handleStatus(r.id, e.target.value)}
                          className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-bold capitalize outline-none"
                        >
                          {VALID_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold uppercase">New Reservation</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">GUEST NAME</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">TABLE</label>
                  <select
                    value={formData.tableId}
                    onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  >
                    <option value="">Auto-select available</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        Table {t.tableNumber || t.table_number || t.id}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">PARTY SIZE</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.partySize}
                    onChange={(e) => setFormData({ ...formData, partySize: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">DATE</label>
                  <input
                    type="date"
                    required
                    value={formData.reservationDate}
                    onChange={(e) => setFormData({ ...formData, reservationDate: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">TIME</label>
                  <input
                    type="time"
                    value={formData.reservationTime}
                    onChange={(e) => setFormData({ ...formData, reservationTime: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
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