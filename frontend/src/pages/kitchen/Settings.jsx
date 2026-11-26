// src/pages/kitchen/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Check, Play } from 'lucide-react';
import { readPrefs, writePrefs, playBeep, KITCHEN_PREFS } from '../../utils/preferences';

const OPTIONS = [
  {
    key: 'soundEnabled',
    label: 'Beep when a new order arrives',
    hint: 'Plays a short sound on the Incoming Orders screen when a new ticket appears.',
  },
  {
    key: 'priorityAlerts',
    label: 'Highlight urgent orders with a flashing border',
    hint: 'Marks tickets that are high priority or have waited 15+ minutes.',
  },
];

export default function KitchenSettings() {
  const [prefs, setPrefs] = useState(() => readPrefs(KITCHEN_PREFS.scope, KITCHEN_PREFS.defaults));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (writePrefs(KITCHEN_PREFS.scope, prefs)) {
      setError('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Could not save - browser storage is unavailable.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 max-w-4xl">
      <div className="border-b pb-4 border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-emerald-500" /> Kitchen Portal Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Preferences for this kitchen screen. They are stored on this device only.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-800 dark:text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-emerald-500" /> Terminal Notification Preferences
          </h3>

          <div className="space-y-3 text-xs">
            {OPTIONS.map(({ key, label, hint }) => (
              <label key={key} className="flex items-center justify-between gap-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <span>
                  <span className="block font-medium text-slate-700 dark:text-slate-300">{label}</span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">{hint}</span>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(prefs[key])}
                  onChange={(e) => setPrefs((p) => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 accent-emerald-600"
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={() => playBeep('new')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" /> Test sound
          </button>
        </div>

        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

        <div className="flex items-center justify-between">
          {saved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Settings saved on this device.
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
