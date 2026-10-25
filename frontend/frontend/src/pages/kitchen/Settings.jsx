// src/pages/kitchen/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Volume2, ShieldCheck, Check } from 'lucide-react';

export default function KitchenSettings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);
  const [priorityAlerts, setPriorityAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 max-w-4xl">
      <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-500" /> Kitchen Portal Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Configure notification alerts, terminal audio, and operational preferences.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" /> Terminal Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="font-medium text-slate-700 dark:text-slate-300">Enable Audible Order Alerts (Beep on new orders)</span>
              <input 
                type="checkbox" 
                checked={soundEnabled} 
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="font-medium text-slate-700 dark:text-slate-300">Auto-accept incoming waiter orders into preparation queue</span>
              <input 
                type="checkbox" 
                checked={autoAccept} 
                onChange={(e) => setAutoAccept(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
              <span className="font-medium text-slate-700 dark:text-slate-300">Highlight high-priority urgent orders with flashing border</span>
              <input 
                type="checkbox" 
                checked={priorityAlerts} 
                onChange={(e) => setPriorityAlerts(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}