import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle2, RefreshCw } from 'lucide-react';
import customerRequestService from '../../services/customerRequestService';

export default function WaiterCustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await customerRequestService.getRequests({ limit: 100 });
      setRequests(list);
    } catch (err) {
      setError(err.message || 'Failed to load customer requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleComplete = async (id) => {
    setError('');
    try {
      await customerRequestService.updateStatus(id, 'completed');
      await loadRequests();
    } catch (err) {
      setError(err.message || 'Failed to update request status.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" /> Customer Requests
          </h1>
          <p className="text-xs text-slate-500">Assist guests with table calls, water, napkins, and bills.</p>
        </div>
        <button
          type="button"
          onClick={loadRequests}
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

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100 text-xs">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading requests...</div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No customer requests.</div>
        ) : (
          requests.map((req) => {
            const st = String(req.status || 'pending').toLowerCase();
            return (
              <div key={req.id} className="p-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">
                    {req.tableNumber || req.table_number
                      ? `Table ${req.tableNumber || req.table_number}`
                      : req.table || 'Guest'}{' '}
                    — <span className="font-medium">{req.text || req.request || req.message}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 capitalize mt-0.5">Status: {st}</p>
                </div>
                {st !== 'completed' && (
                  <button
                    type="button"
                    onClick={() => handleComplete(req.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete</span>
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