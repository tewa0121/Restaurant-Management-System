// src/pages/waiter/Tables.jsx
import React, { useState } from 'react';
import { Grid, Users, PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WaiterTablesGrid() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const [tables, setTables] = useState([
    { id: 1, name: 'Table 1', capacity: 2, status: 'Available', section: 'Main Dining' },
    { id: 2, name: 'Table 2', capacity: 4, status: 'Available', section: 'Main Dining' },
    { id: 3, name: 'Table 3', capacity: 4, status: 'Preparing', section: 'Main Dining' },
    { id: 4, name: 'Table 4', capacity: 2, status: 'Available', section: 'Main Dining' },
    { id: 5, name: 'Table 5', capacity: 4, status: 'Ordering', section: 'Patio' },
    { id: 6, name: 'Table 6', capacity: 6, status: 'Available', section: 'Patio' },
    { id: 7, name: 'Table 7', capacity: 2, status: 'Preparing', section: 'Patio' },
    { id: 8, name: 'Table 8', capacity: 8, status: 'Available', section: 'VIP Lounge' },
    { id: 9, name: 'Table 9', capacity: 4, status: 'Available', section: 'VIP Lounge' },
    { id: 10, name: 'Table 10', capacity: 4, status: 'Available', section: 'VIP Lounge' },
    { id: 11, name: 'Table 11', capacity: 2, status: 'Available', section: 'VIP Lounge' },
    { id: 12, name: 'Table 12', capacity: 6, status: 'Ready to Serve', section: 'Main Dining' },
    { id: 13, name: 'Table 13', capacity: 4, status: 'Available', section: 'Main Dining' },
    { id: 14, name: 'Table 14', capacity: 4, status: 'Available', section: 'Main Dining' },
    { id: 15, name: 'Table 15', capacity: 2, status: 'Ordering', section: 'Patio' },
    { id: 16, name: 'Table 16', capacity: 4, status: 'Available', section: 'Patio' },
    { id: 17, name: 'Table 17', capacity: 2, status: 'Available', section: 'Patio' },
    { id: 18, name: 'Table 18', capacity: 6, status: 'Available', section: 'Patio' },
  ]);

  const filteredTables = filter === 'All' 
    ? tables 
    : tables.filter(t => t.status.toLowerCase() === filter.toLowerCase());

  const handleStatusChange = (id) => {
    setTables(prev => prev.map(t => t.id === id ? { ...t, status: 'Ordering' } : t));
    navigate('/waiter/new-order', { state: { table: `Table ${id}` } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:border-emerald-400';
      case 'Ordering':
        return 'border-sky-200 bg-sky-50/60 text-sky-800 hover:border-sky-400';
      case 'Preparing':
        return 'border-amber-200 bg-amber-50/60 text-amber-800 hover:border-amber-400';
      case 'Ready to Serve':
        return 'border-[#52C41A] bg-[#52C41A] text-white font-black shadow-md';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Grid className="w-6 h-6 text-emerald-500" /> All Tables & Floor Plan
          </h1>
          <p className="text-xs text-slate-500 font-medium">Live table occupancy overview and quick seating management.</p>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['All', 'Available', 'Ordering', 'Preparing', 'Ready to Serve'].map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                filter === f 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Floor Plan Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${getStatusColor(t.status)}`}
          >
            <div className="flex justify-between items-start">
              <span className="font-black text-sm">{t.name}</span>
              <span className="text-[10px] font-bold flex items-center gap-0.5 opacity-80">
                <Users className="w-3 h-3" /> {t.capacity}
              </span>
            </div>

            <p className="text-[10px] font-bold opacity-70">{t.section}</p>

            <div className="pt-2 border-t border-black/10 flex justify-between items-center text-[10px] font-bold">
              <span>{t.status}</span>
              {t.status === 'Available' && (
                <button
                  type="button"
                  onClick={() => handleStatusChange(t.id)}
                  className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer shadow-sm transition-all"
                  title="Occupy Table & Take Order"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}