// src/pages/waiter/Settings.jsx
import React, { useState } from 'react';
import { Settings, Bell, Volume2, Moon } from 'lucide-react';

export default function WaiterSettings() {
  const [requestAlerts, setRequestAlerts] = useState(true);
  const [kitchenSound, setKitchenSound] = useState(true);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-500" /> Waiter Settings
        </h1>
        <p className="text-xs text-slate-500 font-medium">Configure sound alerts and order notification preferences.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-lg space-y-4 text-xs font-medium">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <span className="flex items-center gap-2 text-slate-700">
            <Bell className="w-4 h-4 text-rose-500" /> Table Request Bell Sound
          </span>
          <input 
            type="checkbox" 
            checked={requestAlerts} 
            onChange={() => setRequestAlerts(!requestAlerts)} 
            className="w-4 h-4 text-emerald-600 rounded cursor-pointer" 
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-slate-700">
            <Volume2 className="w-4 h-4 text-emerald-500" /> Kitchen Order Ready Chime
          </span>
          <input 
            type="checkbox" 
            checked={kitchenSound} 
            onChange={() => setKitchenSound(!kitchenSound)} 
            className="w-4 h-4 text-emerald-600 rounded cursor-pointer" 
          />
        </div>
      </div>
    </div>
  );
}