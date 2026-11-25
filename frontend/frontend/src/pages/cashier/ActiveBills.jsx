// src/pages/cashier/ActiveBills.jsx
import React, { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle2 } from 'lucide-react';

export function ActiveBills() {
  const [bills, setBills] = useState([
    { id: '#BILL-154', table: 'Table 8', customer: 'Alice Cooper', items: '4 items', total: '$54.30', time: '5 min ago' },
    { id: '#BILL-153', table: 'Table 10', customer: 'Robert Johnson', items: '2 items', total: '$36.20', time: '8 min ago' },
    { id: '#BILL-152', table: 'Table 9', customer: 'Michael Brown', items: '3 items', total: '$41.70', time: '12 min ago' },
    { id: '#BILL-151', table: 'Table 6', customer: 'Emily Clark', items: '2 items', total: '$29.90', time: '15 min ago' },
    { id: '#BILL-150', table: 'Table 14', customer: 'David Wilson', items: '5 items', total: '$63.50', time: '18 min ago' },
  ]);

  const [settledMsg, setSettledMsg] = useState(null);

  const handleSettle = (id) => {
    setBills(prev => prev.filter(b => b.id !== id));
    setSettledMsg(`Bill ${id} settled successfully!`);
    setTimeout(() => setSettledMsg(null), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-500" /> Active Unpaid Bills
          </h1>
          <p className="text-xs text-slate-500 font-medium">Real-time open dining checks awaiting settlement.</p>
        </div>
        {settledMsg && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-4 h-4" /> {settledMsg}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {bills.map(b => (
          <div key={b.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <span className="font-bold text-blue-600 text-xs">{b.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-700">Unpaid</span>
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-base">{b.table}</h3>
              <p className="text-xs text-slate-500 font-medium">{b.customer} • {b.items}</p>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Opened {b.time}
              </p>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="font-black text-slate-900 text-sm">{b.total}</span>
              <button
                onClick={() => handleSettle(b.id)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition-all flex items-center gap-1"
              >
                <DollarSign className="w-3.5 h-3.5" /> Settle
              </button>
            </div>
          </div>
        ))}
        {bills.length === 0 && (
          <div className="col-span-full text-center py-16 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-slate-400 font-bold text-xs">
            All active bills have been successfully settled! 🎉
          </div>
        )}
      </div>
    </div>
  );
}

export default ActiveBills;