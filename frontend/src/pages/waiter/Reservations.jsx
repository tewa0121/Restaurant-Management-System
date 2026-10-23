// src/pages/waiter/Reservations.jsx
import React, { useState } from 'react';
import { CalendarDays, Clock, Users, CheckCircle2 } from 'lucide-react';

export default function WaiterReservations() {
  const [reservations] = useState([
    { id: 1, guestName: 'Alice Cooper', table: 'Table 8', partySize: 4, time: '7:00 PM', status: 'Confirmed' },
    { id: 2, guestName: 'Robert Johnson', table: 'Table 14', partySize: 2, time: '8:30 PM', status: 'Pending' },
    { id: 3, guestName: 'Michael Brown', table: 'Table 2', partySize: 6, time: '9:00 PM', status: 'Confirmed' },
  ]);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-purple-500" /> Shift Reservations
          </h1>
          <p className="text-xs text-slate-500 font-medium">View guest bookings and table reservations for today.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reservations.map(res => (
          <div key={res.id} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{res.guestName}</h3>
                <span className="text-xs font-bold text-blue-600">{res.table}</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                res.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {res.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1 font-semibold"><Users className="w-3.5 h-3.5" /> {res.partySize} Guests</span>
              <span className="flex items-center gap-1 font-semibold"><Clock className="w-3.5 h-3.5" /> {res.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}