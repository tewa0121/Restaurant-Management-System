// src/pages/waiter/CustomerRequests.jsx
import React, { useState } from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle, MessageSquare } from 'lucide-react';

export default function WaiterCustomerRequests() {
  const [requests, setRequests] = useState([
    { id: 1, table: 'Table 7', request: 'Extra Napkins', time: '2 min ago', status: 'New', urgent: false },
    { id: 2, table: 'Table 12', request: 'More Water', time: '5 min ago', status: 'New', urgent: false },
    { id: 3, table: 'Table 3', request: 'Check on Order Progress', time: '8 min ago', status: 'In Progress', urgent: true },
    { id: 4, table: 'Table 15', request: 'Bring Bill & POS Terminal', time: '10 min ago', status: 'New', urgent: true },
  ]);

  // ጥሪውን እንደተጠናቀቀ አድርጎ ማጽዳት
  const handleResolve = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
  };

  // ጥሪውን በመስተናገድ ላይ እንደሆነ መቀየር
  const handleSetInProgress = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'In Progress' } : r));
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-rose-500" /> Customer Service Requests
          </h1>
          <p className="text-xs text-slate-500 font-medium">Respond to table bell calls and guest requests in real time.</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-bold">
          {requests.length} Active Calls
        </span>
      </div>

      {/* Requests List */}
      <div className="space-y-3 max-w-4xl">
        {requests.map(req => (
          <div 
            key={req.id} 
            className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <div className={`p-3 rounded-xl ${req.urgent ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">{req.table}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    req.status === 'New' ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {req.status}
                  </span>
                  {req.urgent && (
                    <span className="text-[10px] font-bold text-rose-500 flex items-center gap-0.5">
                      <AlertCircle className="w-3 h-3" /> Priority
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-700 font-semibold">{req.request}</p>
                <p className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {req.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {req.status === 'New' && (
                <button
                  type="button"
                  onClick={() => handleSetInProgress(req.id)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Mark Attending
                </button>
              )}
              <button
                type="button"
                onClick={() => handleResolve(req.id)}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Resolve
              </button>
            </div>
          </div>
        ))}

        {requests.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs font-bold">
            All customer requests have been attended to! 🎉
          </div>
        )}
      </div>
    </div>
  );
}