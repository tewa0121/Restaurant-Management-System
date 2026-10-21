// src/pages/waiter/Profile.jsx
import React from 'react';
import { User, Shield, Star, Award } from 'lucide-react';

export default function WaiterProfile() {
  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-emerald-500" /> My Profile
        </h1>
        <p className="text-xs text-slate-500 font-medium">Account overview and shift performance badges.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-lg space-y-4">
        <div className="flex items-center gap-4">
          <img 
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
            alt="David Waiter" 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
          />
          <div>
            <h3 className="font-black text-lg text-slate-900">David Waiter</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-500" /> Waiter Staff ID: #W-8042
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Shift Status</span>
            <span className="font-bold text-emerald-600">Active Duty</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-slate-400 block text-[10px]">Customer Rating</span>
            <span className="font-bold text-amber-500 flex items-center gap-1">
              4.9 <Star className="w-3 h-3 fill-current" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}