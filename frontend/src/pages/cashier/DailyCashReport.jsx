import React from 'react';
import { Calendar, DollarSign, CreditCard, Smartphone, Download } from 'lucide-react';

export default function DailyCashReport() {
  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Cash Report</h1>
          <p className="text-gray-500 text-sm mt-1">End-of-day summary for your shift.</p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2 shadow-sm">
            <Calendar size={16} /> Oct 20, 2026
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 shadow-sm">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Opening Balance</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$500.00</h3>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><DollarSign size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Cash Received</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$1,890.00</h3>
            </div>
            <div className="p-2 bg-green-50 rounded-lg text-green-600"><DollarSign size={20} /></div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Expected Closing</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">$2,390.00</h3>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><DollarSign size={20} /></div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN TABLE */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Payment Breakdown</h3>
        </div>
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-xs text-gray-500">
            <tr>
              <th className="px-6 py-3 font-medium">Payment Method</th>
              <th className="px-6 py-3 font-medium">Transactions</th>
              <th className="px-6 py-3 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            <tr>
              <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-800"><DollarSign size={16} className="text-green-600"/> Cash</td>
              <td className="px-6 py-4 text-gray-600">42</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">$1,890.00</td>
            </tr>
            <tr>
              <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-800"><CreditCard size={16} className="text-blue-600"/> Card</td>
              <td className="px-6 py-4 text-gray-600">28</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">$1,470.00</td>
            </tr>
            <tr>
              <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-800"><Smartphone size={16} className="text-orange-600"/> Mobile Banking</td>
              <td className="px-6 py-4 text-gray-600">12</td>
              <td className="px-6 py-4 text-right font-bold text-gray-900">$630.00</td>
            </tr>
          </tbody>
          <tfoot className="bg-gray-50 border-t border-gray-200">
            <tr>
              <td className="px-6 py-4 font-bold text-gray-900" colSpan={2}>Total Collected</td>
              <td className="px-6 py-4 text-right font-bold text-green-600 text-lg">$3,990.00</td>
            </tr>
          </tfoot>
        </table>
      </div>

    </div>
  );
}