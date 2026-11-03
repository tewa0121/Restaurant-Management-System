import React, { useState } from 'react';
import { BellRing, CheckCircle, Clock } from 'lucide-react';

export default function CustomerRequestsWidget() {
  const [requests, setRequests] = useState([
    { id: 1, table: 'Table 5', request: 'Need assistance with menu', time: '2m ago', resolved: false },
    { id: 2, table: 'Table 12', request: 'Requesting bill / payment', time: '8m ago', resolved: false },
  ]);

  const handleResolve = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, resolved: true } : r));
  };

  const activeRequests = requests.filter(r => !r.resolved);

  return (
    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
          <BellRing className="w-4 h-4 text-amber-500 animate-bounce" /> Customer Calls & Requests
        </h3>
        <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 font-bold px-2 py-0.5 rounded-full">
          {activeRequests.length} Pending
        </span>
      </div>

      <div className="space-y-2.5">
        {activeRequests.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-3">No pending customer requests.</p>
        ) : (
          activeRequests.map((req) => (
            <div key={req.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900 dark:text-white">{req.table}</p>
                <p className="text-slate-600 dark:text-slate-300 font-medium">{req.request}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" /> {req.time}
                </p>
              </div>
              <button
                onClick={() => handleResolve(req.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] cursor-pointer inline-flex items-center gap-1 transition"
              >
                <CheckCircle className="w-3 h-3" /> Attend
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}