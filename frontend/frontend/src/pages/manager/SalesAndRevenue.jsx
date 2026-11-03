// src/pages/manager/SalesAndRevenue.jsx
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calendar, Download, ArrowUpRight } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export default function SalesAndRevenue() {
  const [timeframe, setTimeframe] = useState('monthly');
  const [exported, setExported] = useState(false);

  const handleExport = () => {
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" /> Sales & Revenue
          </h1>
          <p className="text-xs text-slate-500">Comprehensive financial breakdown and daily earnings.</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2 text-xs">
            <option value="daily">Daily Breakdown</option>
            <option value="weekly">Weekly Summary</option>
            <option value="monthly">Monthly Overview</option>
          </select>
          <button type="button" onClick={handleExport} className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" /> {exported ? 'Exported!' : 'Export Report'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-2">
          <p className="text-xs text-slate-400 font-medium">Total Gross Revenue</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">$32,450.00</h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +14.2% vs last period</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-2">
          <p className="text-xs text-slate-400 font-medium">Average Daily Sales</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">$1,280.50</h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +8.5% vs last period</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-2">
          <p className="text-xs text-slate-400 font-medium">Total Completed Orders</p>
          <h3 className="text-2xl font-black text-slate-800 dark:text-white">1,420</h3>
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1"><ArrowUpRight className="w-3 h-3" /> +11.0% volume growth</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm">Recent Revenue Transactions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b text-slate-400 text-[10px]">
                <th className="pb-3">Transaction ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Payment Method</th>
                <th className="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                { id: 'TXN-9041', date: 'May 20, 2025 - 10:30 AM', method: 'Credit Card', amount: 45.50 },
                { id: 'TXN-9040', date: 'May 20, 2025 - 10:15 AM', method: 'Cash', amount: 78.20 },
                { id: 'TXN-9039', date: 'May 20, 2025 - 09:50 AM', method: 'Digital Wallet', amount: 32.00 },
                { id: 'TXN-9038', date: 'May 19, 2025 - 09:20 PM', method: 'Credit Card', amount: 145.00 },
              ].map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-emerald-600">{txn.id}</td>
                  <td className="py-3 text-slate-500">{txn.date}</td>
                  <td className="py-3 font-semibold text-slate-700 dark:text-slate-200">{txn.method}</td>
                  <td className="py-3 text-right font-extrabold text-slate-800 dark:text-white">{formatCurrency(txn.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}