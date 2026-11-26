// src/pages/cashier/Settings.jsx
import React, { useEffect, useState } from 'react';
import { Settings as SettingsIcon, Monitor, DollarSign, CheckCircle2, Play } from 'lucide-react';
import settingsService from '../../services/settingsService';
import { readPrefs, writePrefs, playBeep, CASHIER_PREFS } from '../../utils/preferences';

export function CashierSettings() {
  const [prefs, setPrefs] = useState(() => readPrefs(CASHIER_PREFS.scope, CASHIER_PREFS.defaults));
  const [business, setBusiness] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    let active = true;
    settingsService
      .getPublicSettings()
      .then((data) => active && setBusiness(data))
      .catch((err) => active && setLoadError(err.message || 'Could not load restaurant settings.'));
    return () => {
      active = false;
    };
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    if (writePrefs(CASHIER_PREFS.scope, prefs)) {
      setSaveError('');
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } else {
      setSaveError('Could not save - browser storage is unavailable.');
    }
  };

  const rows = business
    ? [
        ['Restaurant', business.restaurantName],
        ['Currency', business.currency],
        ['Sales tax rate', `${Number(business.taxRate ?? 0)}%`],
        ['Delivery fee', `${business.currency || ''} ${Number(business.deliveryFee ?? 0).toFixed(2)}`],
        ['Opening hours', `${business.openingTime || '-'} - ${business.closingTime || '-'}`],
      ]
    : [];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700" /> Cashier Station Preferences
          </h1>
          <p className="text-xs text-slate-500 font-medium">Station options for this device, plus the restaurant values your bills use.</p>
        </div>
        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Preferences saved on this device
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
            <Monitor className="w-4 h-4 text-amber-500" /> This Station
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Station name</label>
              <input
                type="text"
                maxLength={40}
                value={prefs.stationName}
                onChange={(e) => setPrefs({ ...prefs, stationName: e.target.value })}
                placeholder="e.g. Front Counter"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-800">Sound when a new bill is waiting</p>
                <p className="text-[10px] text-slate-400">Beep on Active Bills when an unpaid bill appears.</p>
              </div>
              <input
                type="checkbox"
                checked={prefs.soundOnNewBill}
                onChange={(e) => setPrefs({ ...prefs, soundOnNewBill: e.target.checked })}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <button type="button" onClick={() => playBeep('new')} className="inline-flex items-center gap-1.5 font-bold text-emerald-600 cursor-pointer">
              <Play className="w-3.5 h-3.5" /> Test sound
            </button>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Restaurant Values
          </h3>
          {loadError && <p className="text-xs font-semibold text-rose-600">{loadError}</p>}
          {!business && !loadError && <p className="text-xs text-slate-400">Loading...</p>}
          <dl className="space-y-2 text-xs">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between p-2.5 bg-slate-50 rounded-xl">
                <dt className="font-semibold text-slate-500">{label}</dt>
                <dd className="font-bold text-slate-900">{value || '-'}</dd>
              </div>
            ))}
          </dl>
          <p className="text-[10px] text-slate-400">Tax, currency and fees are set by an administrator and apply to every bill.</p>
        </div>

        {saveError && <p className="md:col-span-2 text-xs font-bold text-rose-600">{saveError}</p>}

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default CashierSettings;
