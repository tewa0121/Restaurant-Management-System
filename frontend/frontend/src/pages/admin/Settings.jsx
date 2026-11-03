// src/pages/admin/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    restaurantName: 'RestoAdmin Restaurant',
    currency: 'USD ($)',
    taxRate: '15%',
    serviceCharge: '5%',
    notificationsEnabled: true,
  });

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Configure global platform preferences, tax policies, and restaurant metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#122448] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm space-y-4 text-xs">
        {saved && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl border border-emerald-100 dark:border-emerald-900/30">
            ✓ Settings saved successfully!
          </div>
        )}

        <div>
          <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">RESTAURANT SYSTEM NAME</label>
          <input type="text" value={settings.restaurantName} onChange={(e) => setSettings({ ...settings, restaurantName: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">DEFAULT CURRENCY</label>
            <input type="text" value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">TAX RATE (VAT)</label>
            <input type="text" value={settings.taxRate} onChange={(e) => setSettings({ ...settings, taxRate: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" />
          </div>
          <div>
            <label className="font-bold block mb-1 text-gray-700 dark:text-gray-300">SERVICE CHARGE</label>
            <input type="text" value={settings.serviceCharge} onChange={(e) => setSettings({ ...settings, serviceCharge: e.target.value })} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white" />
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer">
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </form>
    </div>
  );
}