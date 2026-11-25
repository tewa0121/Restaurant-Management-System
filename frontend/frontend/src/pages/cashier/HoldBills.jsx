// src/pages/cashier/HoldBills.jsx
import React, { useState } from 'react';
import { Clock, Play, Trash2 } from 'lucide-react';

export function HoldBills() {
  const [heldBills, setHeldBills] = useState([
    { id: '#BILL-145', table: 'Table 2', customer: 'David Miller', reason: 'Customer stepped out to take a phone call', amount: '$45.00' },
    { id: '#BILL-142', table: 'Table 4', customer: 'Sophia Turner', reason: 'Split payment discussion pending', amount: '$82.50' },
  ]);

  const resumeBill = (id) => {
    setHeldBills(prev => prev.filter(b => b.id !== id));
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-amber-500" /> Held / Paused Bills
        </h1>
        <p className="text-xs text-slate-500 font-medium">Resume or void transactions that were placed on hold.</p>
      </div>

      <div className="space-y-3 max-w-3xl">
        {heldBills.map(h => (
          <div key={h.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-600">{h.id}</span>
                <span className="font-black text-slate-900">{h.table}</span>
                <span className="text-slate-400 font-medium">({h.customer})</span>
              </div>
              <p className="text-slate-600 font-medium mt-1">Reason: <span className="italic">{h.reason}</span></p>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-black text-slate-900 text-sm">{h.amount}</span>
              <button
                onClick={() => resumeBill(h.id)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <Play className="w-3 h-3 fill-current" /> Resume
              </button>
            </div>
          </div>
        ))}
        {heldBills.length === 0 && <div className="text-center py-12 text-slate-400 font-bold text-xs">No held bills at the moment.</div>}
      </div>
    </div>
  );
}