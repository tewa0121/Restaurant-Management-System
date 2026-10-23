// src/pages/waiter/MyTables.jsx
import React, { useState } from 'react';
import { Utensils, Users, Clock, PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WaiterTables() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const [tables] = useState([
    { id: 'Table 5', guests: 4, status: 'Ordering', lastOrder: '10:20 AM', section: 'Main Dining' },
    { id: 'Table 7', guests: 2, status: 'Food Preparing', lastOrder: '10:18 AM', section: 'Patio' },
    { id: 'Table 12', guests: 6, status: 'Ready to Serve', lastOrder: '10:15 AM', section: 'VIP Section' },
    { id: 'Table 3', guests: 3, status: 'Ordering', lastOrder: '10:10 AM', section: 'Main Dining' },
    { id: 'Table 15', guests: 2, status: 'Food Preparing', lastOrder: '10:08 AM', section: 'Patio' },
    { id: 'Table 8', guests: 5, status: 'Ready to Serve', lastOrder: '10:05 AM', section: 'VIP Section' },
  ]);

  const filteredTables = filter === 'All' 
    ? tables 
    : tables.filter(t => t.status.toLowerCase() === filter.toLowerCase());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ordering':
        return 'bg-sky-100 text-sky-700';
      case 'Food Preparing':
        return 'bg-amber-100 text-amber-700';
      case 'Ready to Serve':
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

        <div className="flex items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {['All', 'Ordering', 'Food Preparing', 'Ready to Serve'].map(st => (
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

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTables.map((t, idx) => (
          <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-base text-slate-900">{t.id}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <Users className="w-3.5 h-3.5" /> {t.guests} Guests • <span className="font-semibold text-slate-500">{t.section}</span>
                </p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(t.status)}`}>
                {t.status}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> <strong className="text-slate-700">{t.lastOrder}</strong>
              </span>
              <button 
                type="button"
                onClick={() => navigate('/waiter/new-order', { state: { table: t.id } })}
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