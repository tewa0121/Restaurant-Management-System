import React, { useEffect, useState } from 'react';
import { Utensils, Users, RefreshCw } from 'lucide-react';
import tableService from '../../services/tableService';

export default function WaiterTables() {
  const [filter, setFilter] = useState('All');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadMine = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await tableService.getMyTables().catch(() => tableService.getTables());
      setTables(list);
    } catch (err) {
      setError(err.message || 'Failed to load assigned tables.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMine();
  }, []);

  const filtered = tables.filter((t) => {
    if (filter === 'All') return true;
    return String(t.status || '').toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-600" /> My Assigned Tables
          </h1>
          <p className="text-xs text-slate-500">Tables assigned to your shift.</p>
        </div>
        <button
          type="button"
          onClick={loadMine}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'available', 'occupied', 'reserved'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize cursor-pointer ${
              filter === st
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading my tables...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-slate-900">
                  Table {t.tableNumber || t.table_number || t.id}
                </span>
                <span className="capitalize font-bold text-emerald-600">
                  {t.status || 'available'}
                </span>
              </div>
              <p className="text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> Capacity: {t.capacity || 4} guests
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}