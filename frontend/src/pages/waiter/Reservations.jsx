import React, { useEffect, useState } from 'react';
import usePolling from '../../hooks/usePolling';
import { CalendarDays, RefreshCw } from 'lucide-react';
import reservationService from '../../services/reservationService';

export default function WaiterReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seatingId, setSeatingId] = useState(null);
  const [error, setError] = useState('');

  const loadReservations = async (silent) => {
    if (silent !== true) setLoading(true);
    setError('');
    try {
      const list = await reservationService.getReservations({ limit: 100 });
      setReservations(list);
    } catch (err) {
      setError(err.message || 'Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => loadReservations(true), 30000);

  useEffect(() => {
    loadReservations();
  }, []);

  const handleSeat = async (id) => {
    setSeatingId(id);
    setError('');
    try {
      await reservationService.updateReservationStatus(id, 'seated');
      await loadReservations();
    } catch (err) {
      setError(err.message || 'Failed to seat guest.');
      if (err?.status === 409) {
        await loadReservations();
      }
    } finally {
      setSeatingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-emerald-600" /> Floor Reservations
          </h1>
          <p className="text-slate-500">Upcoming and active guest reservations.</p>
        </div>
        <button
          type="button"
          onClick={loadReservations}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading reservations...</div>
        ) : reservations.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No reservations found.</div>
        ) : (
          reservations.map((r) => {
            const st = String(r.status || 'pending').toLowerCase();
            const canSeat = !['seated', 'completed', 'cancelled', 'no_show'].includes(st);
            return (
              <div key={r.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">
                    {r.customerName || r.customer_name || 'Guest'}{' '}
                    {(r.tableNumber || r.table_number) && (
                      <span className="text-slate-500 font-semibold">
                        • Table {r.tableNumber || r.table_number}
                      </span>
                    )}
                  </p>
                  <p className="text-slate-500">
                    Guests: {r.partySize ?? r.party_size ?? r.guests ?? 2} •{' '}
                    {(r.reservationDate || r.reservation_date || '').slice(0, 10)}{' '}
                    {r.reservationTime || r.reservation_time || ''} •{' '}
                    <span className="capitalize font-semibold">{st}</span>
                  </p>
                </div>
                {canSeat && (
                  <button
                    type="button"
                    disabled={seatingId === r.id}
                    onClick={() => handleSeat(r.id)}
                    className="px-3 py-1.5 bg-emerald-600 disabled:opacity-60 text-white rounded-lg font-bold cursor-pointer"
                  >
                    {seatingId === r.id ? 'Seating...' : 'Seat Guest'}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}