import React from 'react';
import { Users, Clock, PlusCircle } from 'lucide-react';

export default function AssignedTablesGrid({ tables = [], onNewOrder }) {
  const gridTables = tables.length > 0 ? tables : [
    { id: 1, name: 'Table 2', status: 'Available', seats: 4 },
    { id: 2, name: 'Table 5', status: 'Occupied', seats: 4, orderId: '#ORD-1250', time: '15m' },
    { id: 3, name: 'Table 7', status: 'Reserved', seats: 2, time: '7:30 PM' },
    { id: 4, name: 'Table 12', status: 'Occupied', seats: 6, orderId: '#ORD-1249', time: '25m' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <h3 className="font-bold text-slate-900 dark:text-white text-xs">My Assigned Tables</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {gridTables.map((table) => {
          const isOccupied = table.status === 'Occupied';
          const isAvailable = table.status === 'Available';

          return (
            <div
              key={table.id || table.name}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                isAvailable
                  ? 'border-emerald-200 bg-emerald-50/40 dark:bg-emerald-950/20 dark:border-emerald-900/50'
                  : isOccupied
                  ? 'border-amber-200 bg-amber-50/40 dark:bg-amber-950/20 dark:border-amber-900/50'
                  : 'border-purple-200 bg-purple-50/40 dark:bg-purple-950/20 dark:border-purple-900/50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{table.name}</h4>
                  <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Users className="w-3 h-3" /> {table.seats} Seats
                  </p>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    isAvailable
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : isOccupied
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400'
                      : 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400'
                  }`}
                >
                  {table.status}
                </span>
              </div>

              {table.orderId && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  <p className="font-semibold">{table.orderId}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Active for {table.time}
                  </p>
                </div>
              )}

              <button
                onClick={() => onNewOrder && onNewOrder(table)}
                className="w-full mt-2 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition"
              >
                <PlusCircle className="w-3.5 h-3.5" /> New Order
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}