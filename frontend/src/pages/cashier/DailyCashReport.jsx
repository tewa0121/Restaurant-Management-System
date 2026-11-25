import React, { useEffect, useState } from 'react';
import { FileSpreadsheet, RefreshCw } from 'lucide-react';
import cashSessionService from '../../services/cashSessionService';

export function DailyCashReport() {
  const [current, setCurrent] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [openingAmount, setOpeningAmount] = useState('0');
  const [countedAmount, setCountedAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadSessions = async () => {
    setLoading(true);
    setError('');
    try {
      const [curRes, list] = await Promise.all([
        cashSessionService.getCurrentSession().catch(() => null),
        cashSessionService.getSessions({ limit: 30 }).catch(() => []),
      ]);
      const curData = curRes?.data ?? curRes;
      setCurrent(curData && (curData.id || curData.session) ? curData.session || curData : null);
      setSessions(list);
    } catch (err) {
      setError(err.message || 'Failed to load cash sessions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleOpen = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await cashSessionService.openSession({
        openingAmount: Number(openingAmount) || 0,
        notes: notes.trim() || undefined,
      });
      setNotes('');
      await loadSessions();
    } catch (err) {
      setError(err.message || 'Failed to open cash session.');
    } finally {
      setBusy(false);
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();
    if (!current?.id || countedAmount === '') return;
    setBusy(true);
    setError('');
    try {
      await cashSessionService.closeSession(current.id, {
        countedAmount: Number(countedAmount),
        notes: notes.trim() || undefined,
      });
      setCountedAmount('');
      setNotes('');
      await loadSessions();
    } catch (err) {
      setError(err.message || 'Failed to close cash session.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-500" /> Daily Cash Register Report
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Open, monitor, and close cashier register shifts.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSessions}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading cash register data...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="font-black text-sm text-slate-900 border-b pb-2">
              {current ? `Active Session #${current.id}` : 'Open New Register Session'}
            </h2>

            {current ? (
              <form onSubmit={handleClose} className="space-y-3">
                <p className="text-slate-600">
                  Opening Amount:{' '}
                  <span className="font-bold text-slate-900">
                    ${Number(current.openingAmount ?? current.opening_amount ?? 0).toFixed(2)}
                  </span>
                </p>
                <div>
                  <label className="font-bold block mb-1">COUNTED CLOSING AMOUNT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={countedAmount}
                    onChange={(e) => setCountedAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">NOTES</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 bg-rose-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {busy ? 'Closing...' : 'Close Session'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleOpen} className="space-y-3">
                <div>
                  <label className="font-bold block mb-1">OPENING AMOUNT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={openingAmount}
                    onChange={(e) => setOpeningAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">NOTES</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {busy ? 'Opening...' : 'Open Session'}
                </button>
              </form>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-black text-sm text-slate-900 border-b pb-2">
              Recent Sessions ({sessions.length})
            </h2>
            <div className="divide-y divide-slate-100">
              {sessions.length === 0 ? (
                <p className="text-slate-400 py-4">No past sessions recorded.</p>
              ) : (
                sessions.map((s) => (
                  <div key={s.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">Session #{s.id}</p>
                      <p className="text-[11px] text-slate-400 capitalize">
                        Status: {s.status || (s.closedAt || s.closed_at ? 'closed' : 'open')}
                      </p>
                    </div>
                    <span className="font-extrabold text-emerald-600">
                      ${Number(s.openingAmount ?? s.opening_amount ?? 0).toFixed(2)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DailyCashReport;