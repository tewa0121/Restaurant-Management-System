// src/pages/waiter/Customers.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { Users, Search, Phone, Mail, Award, RefreshCw } from 'lucide-react';
import customerService from '../../services/customerService';
import usePolling from '../../hooks/usePolling';

const STATUS_BADGE = {
  VIP: 'bg-purple-100 text-purple-700',
  Regular: 'bg-amber-100 text-amber-700',
  New: 'bg-emerald-100 text-emerald-700',
};

export default function WaiterCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [query, setQuery] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = setTimeout(() => setQuery(searchTerm.trim()), 300);
    return () => clearTimeout(id);
  }, [searchTerm]);

  const load = useCallback(
    async (silent = false) => {
      if (silent !== true) setLoading(true);
      try {
        const list = await customerService.getCustomers({ search: query || undefined, limit: 100 });
        setCustomers(list);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load customers.');
      } finally {
        setLoading(false);
      }
    },
    [query]
  );

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 30000);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" /> Guest Directory
          </h1>
          <p className="text-xs text-slate-500 font-medium">Find a guest to greet them by name and check their loyalty status.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-emerald-500 shadow-sm"
            />
          </div>
          <button type="button" onClick={() => load()} className="p-2.5 bg-slate-900 text-white rounded-xl cursor-pointer" aria-label="Refresh">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">Loading guests...</div>
      ) : customers.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400 font-bold">
          {query ? 'No guests found matching your search.' : 'No guests registered yet.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((c) => (
            <div key={c.id} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 shrink-0 rounded-full bg-blue-100 text-blue-600 font-black flex items-center justify-center">
                    {(c.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{c.name}</h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${STATUS_BADGE[c.status] || STATUS_BADGE.Regular}`}>
                  {c.status || 'Regular'}
                </span>
              </div>
              <div className="space-y-1.5 text-slate-500 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400" /> {c.phone || '-'}</p>
                <p className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 text-slate-400" /> {c.email || '-'}</p>
                <p className="flex items-center gap-1.5 font-bold text-emerald-600">
                  <Award className="w-3.5 h-3.5" /> {Number(c.loyaltyPoints ?? 0)} pts · {Number(c.visits ?? 0)} orders
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
