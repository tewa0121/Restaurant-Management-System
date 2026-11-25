import React, { useEffect, useState } from 'react';
import { Grid, Users, RefreshCw } from 'lucide-react';
import tableService from '../../services/tableService';

export default function WaiterTablesGrid() {
  const [filter, setFilter] = useState('All');
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleStatusChange = async (tableId, status) => {
    setError('');
    try {
      await tableService.updateTableStatus(tableId, status);
      await loadTables();
    } catch (err) {
      setError(err.message || 'Failed to update table status.');
    }
  };

  const filtered = tables.filter((t) => {
    if (filter === 'All') return true;
    return String(t.status || '').toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Grid className="w-6 h-6 text-emerald-600" /> Dining Room Tables
          </h1>
          <p className="text-xs text-slate-500">Live status of restaurant tables.</p>
        </div>
        <button
          type="button"
          onClick={loadTables}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {['All', 'available', 'occupied', 'reserved', 'cleaning'].map((st) => (
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
          Loading tables...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((t) => {
            const st = String(t.status || 'available').toLowerCase();
            return (
              <div
                key={t.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base font-black text-slate-900">
                    Table {t.tableNumber || t.table_number || t.id}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    {t.capacity || 4}
                  </span>
                </div>
                <p className="text-slate-400">{t.section || t.location || 'Main Dining'}</p>
                <select
                  value={st}
                  onChange={(e) => handleStatusChange(t.id, e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold capitalize outline-none"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}