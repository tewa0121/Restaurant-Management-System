// src/pages/cashier/Settings.jsx
import React, { useState } from 'react';
import { Settings as SettingsIcon, Printer, DollarSign, Shield, CheckCircle2 } from 'lucide-react';

export function CashierSettings() {
  const [stationId, setStationId] = useState('Register-01');
  const [taxRate, setTaxRate] = useState('10');
  const [autoPrint, setAutoPrint] = useState(true);
  const [cashDrawerOpen, setCashDrawerOpen] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-slate-700" /> Cashier Station Preferences
          </h1>
          <p className="text-xs text-slate-500 font-medium">Configure receipt printer hardware, taxes, and payment terminal parameters.</p>
        </div>
        {savedSuccess && (
          <div className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4" /> Preferences Saved Successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Terminal Hardware Settings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
            <Printer className="w-4 h-4 text-amber-500" /> Hardware & Printer Configuration
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Station Identifier</label>
              <input
                type="text"
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-800">Auto-Print Receipt on Checkout</p>
                <p className="text-[10px] text-slate-400">Instantly send slip to thermal printer upon payment completion.</p>
              </div>
              <input
                type="checkbox"
                checked={autoPrint}
                onChange={(e) => setAutoPrint(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <p className="font-bold text-slate-800">Automatic Cash Drawer Kick</p>
                <p className="text-[10px] text-slate-400">Open drawer automatically when cash payment is selected.</p>
              </div>
              <input
                type="checkbox"
                checked={cashDrawerOpen}
                onChange={(e) => setCashDrawerOpen(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Financial & Tax Defaults */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 border-b pb-2">
            <DollarSign className="w-4 h-4 text-emerald-500" /> Financial & Tax Defaults
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-600 mb-1">Default Sales Tax Rate (%)</label>
              <input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-600 mb-1">Default Payment Gateway Mode</label>
              <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none font-bold text-slate-900">
                <option>Live Production (Stripe / Terminal)</option>
                <option>Test Simulation Mode</option>
              </select>
            </div>
          </div>
        </div>

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