// src/pages/manager/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, Store, Bell, Shield, Palette, CheckCircle2 } from 'lucide-react';

export default function Settings() {
  const [restaurantName, setRestaurantName] = useState('RestoManager Restaurant');
  const [email, setEmail] = useState('manager@restomanager.com');
  const [phone, setPhone] = useState('+1 (555) 019-2834');
  const [currency, setCurrency] = useState('USD ($)');
  
  // Notification Toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [lowStockWarning, setLowStockWarning] = useState(true);

  // Success feedback state
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" /> System Settings
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage your restaurant profile, preferences, and system configurations.
          </p>
        </div>
        {saved && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-xl text-xs font-bold flex items-center gap-1.5 animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
        {/* General Profile Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-700">
            <Store className="w-4 h-4 text-emerald-500" /> Restaurant Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Restaurant Name</label>
              <input 
                type="text" 
                value={restaurantName} 
                onChange={(e) => setRestaurantName(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Manager Contact Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Phone Number</label>
              <input 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1 font-medium">Default Currency</label>
              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
              >
                <option value="USD ($)">USD ($)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-700">
            <Bell className="w-4 h-4 text-purple-500" /> Notifications & Alerts
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Email Notifications</h4>
                <p className="text-[11px] text-slate-400">Receive daily summaries and critical alerts via email.</p>
              </div>
              <input 
                type="checkbox" 
                checked={emailAlerts} 
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">SMS Order Alerts</h4>
                <p className="text-[11px] text-slate-400">Get text message notifications for new rush orders.</p>
              </div>
              <input 
                type="checkbox" 
                checked={smsAlerts} 
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40">
              <div>
                <h4 className="font-bold text-slate-800 dark:text-white">Low Inventory Warning</h4>
                <p className="text-[11px] text-slate-400">Notify dashboard when stock drops below threshold.</p>
              </div>
              <input 
                type="checkbox" 
                checked={lowStockWarning} 
                onChange={(e) => setLowStockWarning(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button 
            type="submit" 
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}