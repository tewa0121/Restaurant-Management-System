// src/pages/waiter/Settings.jsx
import React, { useState } from 'react';
import { Settings, Bell, Volume2, Check, Play } from 'lucide-react';
import { readPrefs, writePrefs, playBeep, WAITER_PREFS } from '../../utils/preferences';

const OPTIONS = [
  { key: 'requestAlerts', icon: Bell, tone: 'text-rose-500', label: 'Table request bell', kind: 'request', hint: 'Sound when a guest sends a new request.' },
  { key: 'kitchenSound', icon: Volume2, tone: 'text-emerald-500', label: 'Kitchen order ready chime', kind: 'ready', hint: 'Sound when an order becomes ready to serve.' },
];

export default function WaiterSettings() {
  const [prefs, setPrefs] = useState(() => readPrefs(WAITER_PREFS.scope, WAITER_PREFS.defaults));
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (writePrefs(WAITER_PREFS.scope, prefs)) {
      setError('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } else {
      setError('Could not save - browser storage is unavailable.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="border-b pb-4 border-slate-200">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-slate-500" /> Waiter Settings
        </h1>
        <p className="text-xs text-slate-500 font-medium">Sound alerts for this device. They are stored in this browser only.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm max-w-lg space-y-4 text-xs font-medium">
        {OPTIONS.map(({ key, icon: Icon, tone, label, kind, hint }) => (
          <div key={key} className="flex justify-between items-center gap-4 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
            <div>
              <span className="flex items-center gap-2 text-slate-700 font-bold">
                <Icon className={`w-4 h-4 ${tone}`} /> {label}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{hint}</span>
              <button type="button" onClick={() => playBeep(kind)} className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 cursor-pointer">
                <Play className="w-3 h-3" /> Test
              </button>
            </div>
            <input
              type="checkbox"
              checked={Boolean(prefs[key])}
              onChange={(e) => setPrefs({ ...prefs, [key]: e.target.checked })}
              className="w-4 h-4 accent-emerald-600 cursor-pointer"
            />
          </div>
        ))}

        {error && <p className="font-bold text-rose-600">{error}</p>}

        <div className="flex items-center justify-between pt-2">
          {saved && (
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-4 h-4" /> Saved on this device.
            </span>
          )}
          <button type="submit" className="ml-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
