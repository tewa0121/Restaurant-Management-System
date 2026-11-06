// // src/pages/waiter/Tables.jsx
// // "All Tables & Floor Plan" for the waiter. Real tables from the backend.
// import React, { useState } from 'react';
// import { Grid, Users, PlusCircle, Filter } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import useTables from '../../hooks/useTables';

// const FILTERS = ['All', 'Available', 'Occupied', 'Ordering', 'Preparing', 'Ready to Serve', 'Reserved', 'Cleaning'];

// export default function WaiterTablesGrid() {
//   const navigate = useNavigate();
//   const [filter, setFilter] = useState('All');
//   const [actionError, setActionError] = useState('');
//   const { tables, loading, error, changeStatus } = useTables();

//   const filteredTables = filter === 'All'
//     ? tables
//     : tables.filter(t => t.displayStatus.toLowerCase() === filter.toLowerCase());

//   // Seat the guests (table becomes occupied), then go and take the order
//   const handleSeat = async (t) => {
//     setActionError('');
//     const r = await changeStatus(t.id, 'occupied');
//     if (!r.ok) return setActionError(r.message);
//     navigate('/waiter/new-order', { state: { table: `Table ${t.table_number}` } });
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Available':
//         return 'border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:border-emerald-400';
//       case 'Ordering':
//         return 'border-sky-200 bg-sky-50/60 text-sky-800 hover:border-sky-400';
//       case 'Occupied':
//       case 'Preparing':
//         return 'border-amber-200 bg-amber-50/60 text-amber-800 hover:border-amber-400';
//       case 'Ready to Serve':
//         return 'border-[#52C41A] bg-[#52C41A] text-white font-black shadow-md';
//       case 'Reserved':
//         return 'border-indigo-200 bg-indigo-50/60 text-indigo-800';
//       case 'Cleaning':
//         return 'border-purple-200 bg-purple-50/60 text-purple-800';
//       case 'Out of Order':
//         return 'border-rose-200 bg-rose-50/60 text-rose-800';
//       default:
//         return 'border-slate-200 bg-slate-50 text-slate-500';
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
//       {/* Header & Filter Bar */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
//         <div>
//           <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
//             <Grid className="w-6 h-6 text-emerald-500" /> All Tables & Floor Plan
//           </h1>
//           <p className="text-xs text-slate-500 font-medium">Live table occupancy overview and quick seating management.</p>
//         </div>

//         {/* Status Filters */}
//         <div className="flex flex-wrap items-center gap-1 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-bold shadow-sm">
//           <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
//           {FILTERS.map(f => (
//             <button
//               key={f}
//               type="button"
//               onClick={() => setFilter(f)}
//               className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
//                 filter === f
//                   ? 'bg-emerald-600 text-white shadow-sm'
//                   : 'text-slate-500 hover:text-slate-900'
//               }`}
//             >
//               {f}
//             </button>
//           ))}
//         </div>
//       </div>

//       {error && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{error}</div>}
//       {actionError && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError}</div>}
//       {loading && <p className="text-xs text-slate-400">Loading tables...</p>}
//       {!loading && !error && filteredTables.length === 0 && <p className="text-xs text-slate-400">No tables found.</p>}

//       {/* Floor Plan Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         {filteredTables.map((t) => (
//           <div
//             key={t.id}
//             className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${getStatusColor(t.displayStatus)}`}
//           >
//             <div className="flex justify-between items-start">
//               <span className="font-black text-sm">Table {t.table_number}</span>
//               <span className="text-[10px] font-bold flex items-center gap-0.5 opacity-80">
//                 <Users className="w-3 h-3" /> {t.capacity}
//               </span>
//             </div>

//             <p className="text-[10px] font-bold opacity-70">{t.zone || 'No section'}</p>

//             <div className="pt-2 border-t border-black/10 flex justify-between items-center text-[10px] font-bold">
//               <span>{t.displayStatus}</span>
//               {t.displayStatus === 'Available' && (
//                 <button
//                   type="button"
//                   onClick={() => handleSeat(t)}
//                   className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer shadow-sm transition-all"
//                   title="Occupy Table & Take Order"
//                 >
//                   <PlusCircle className="w-3.5 h-3.5" />
//                 </button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// src/pages/waiter/Tables.jsx
// "All Tables & Floor Plan" for the waiter. Real tables from the backend.
import React, { useState } from 'react';
import { Grid, Users, PlusCircle, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTables from '../../hooks/useTables';

const FILTERS = ['All', 'Available', 'Occupied', 'Ordering', 'Preparing', 'Ready to Serve', 'Reserved', 'Cleaning'];

// Works with the new backend (displayStatus, zone) and the old one (status, section)
const statusOf = (t) => {
  if (t.displayStatus) return t.displayStatus;
  const s = String(t.status || '').replace(/_/g, ' ');
  return s ? s.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Available';
};
const zoneOf = (t) => t.zone || t.section || 'No section';

export default function WaiterTablesGrid() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');
  const [actionError, setActionError] = useState('');
  const { tables, loading, error, changeStatus } = useTables();

  const filteredTables = filter === 'All'
    ? tables
    : tables.filter((t) => statusOf(t).toLowerCase() === filter.toLowerCase());

  // Seat the guests (table becomes occupied), then go and take the order
  const handleSeat = async (t) => {
    setActionError('');
    const r = await changeStatus(t.id, 'occupied');
    if (!r.ok) return setActionError(r.message);
    navigate('/waiter/new-order', { state: { table: `Table ${t.table_number}` } });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:border-emerald-400';
      case 'Ordering':
        return 'border-sky-200 bg-sky-50/60 text-sky-800 hover:border-sky-400';
      case 'Occupied':
      case 'Preparing':
        return 'border-amber-200 bg-amber-50/60 text-amber-800 hover:border-amber-400';
      case 'Ready to Serve':
        return 'border-[#52C41A] bg-[#52C41A] text-white font-black shadow-md';
      case 'Reserved':
        return 'border-indigo-200 bg-indigo-50/60 text-indigo-800';
      case 'Cleaning':
        return 'border-purple-200 bg-purple-50/60 text-purple-800';
      case 'Out Of Order':
      case 'Out of Order':
        return 'border-rose-200 bg-rose-50/60 text-rose-800';
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
          {FILTERS.map((f) => (
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

      {error && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{error}</div>}
      {actionError && <div className="px-4 py-2 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">{actionError}</div>}
      {loading && <p className="text-xs text-slate-400">Loading tables...</p>}
      {!loading && !error && filteredTables.length === 0 && (
        <p className="text-xs text-slate-400">
          {filter === 'All' ? 'No tables found.' : `No tables are "${filter}" right now.`}
        </p>
      )}

      {/* Floor Plan Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredTables.map((t) => {
          const status = statusOf(t);
          return (
            <div
              key={t.id}
              className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between h-36 ${getStatusColor(status)}`}
            >
              <div className="flex justify-between items-start">
                <span className="font-black text-sm">Table {t.table_number}</span>
                <span className="text-[10px] font-bold flex items-center gap-0.5 opacity-80">
                  <Users className="w-3 h-3" /> {t.capacity}
                </span>
              </div>

              <p className="text-[10px] font-bold opacity-70">{zoneOf(t)}</p>

              <div className="pt-2 border-t border-black/10 flex justify-between items-center text-[10px] font-bold">
                <span>{status}</span>
                {status === 'Available' && (
                  <button
                    type="button"
                    onClick={() => handleSeat(t)}
                    className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer shadow-sm transition-all"
                    title="Occupy Table & Take Order"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}