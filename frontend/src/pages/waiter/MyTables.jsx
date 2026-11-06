// src/pages/waiter/MyTables.jsx
// "My Assigned Tables": only the tables a manager assigned to this waiter.
import React, { useState } from 'react';
import { Utensils, Users, Clock, PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTables from '../../hooks/useTables';

const FILTERS = ['All', 'Available', 'Occupied', 'Ordering', 'Food Preparing', 'Ready to Serve'];

// The backend says "Preparing"; this page has always said "Food Preparing"
const label = (status) => (status === 'Preparing' ? 'Food Preparing' : status);

const timeOf = (iso) =>
  iso ? new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '—';

export default function WaiterTables() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [actionError, setActionError] = useState('');
  const { tables, loading, error, changeStatus } = useTables({ mine: true });

  const filteredTables = filter === 'All'
    ? tables
    : tables.filter(t => label(t.displayStatus).toLowerCase() === filter.toLowerCase());

  // A free table is marked occupied when the waiter starts an order on it
  const handleTakeOrder = async (t) => {
    setActionError('');
    if (t.status === 'available') {
      const r = await changeStatus(t.id, 'occupied');
      if (!r.ok) return setActionError(r.message);
    }
    navigate('/waiter/new-order', { state: { table: `Table ${t.table_number}` } });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ordering':
        return 'bg-sky-100 text-sky-700';
      case 'Food Preparing':
      case 'Occupied':
        return 'bg-amber-100 text-amber-700';
      case 'Ready to Serve':
      case 'Available':
        return 'bg-emerald-100 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-emerald-500" /> My Assigned Tables
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage seating, take new orders, and monitor guest meal progress.</p>
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {FILTERS.map(st => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{error}</div>}
      {actionError && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError}</div>}
      {loading && <p className="text-xs text-slate-400">Loading your tables...</p>}
      {!loading && !error && tables.length === 0 && (
        <p className="text-xs text-slate-400">No tables are assigned to you yet. Ask a manager to assign tables to you.</p>
      )}
      {!loading && !error && tables.length > 0 && filteredTables.length === 0 && (
        <p className="text-xs text-slate-400">No tables match this filter.</p>
      )}

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTables.map((t) => (
          <div key={t.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">Table {t.table_number}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" /> {t.guests} Guests • <span className="font-semibold text-slate-500">{t.zone || 'No section'}</span>
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(label(t.displayStatus))}`}>
                {label(t.displayStatus)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> <strong className="text-slate-700">{timeOf(t.lastOrderAt)}</strong>
              </span>
              <button
                type="button"
                onClick={() => handleTakeOrder(t)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Take Order
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}