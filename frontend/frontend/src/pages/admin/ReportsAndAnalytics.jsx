// src/pages/admin/ReportsAndAnalytics.jsx
import React, { useState } from 'react';
import { BarChart3, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function ReportsAndAnalytics() {
  const [reportGenerated, setReportGenerated] = useState(false);

  const handleGenerateReport = () => {
    setReportGenerated(true);
    setTimeout(() => setReportGenerated(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">Analyze revenue metrics, top-selling menu items, and generate comprehensive business reports.</p>
        </div>
        <button
          onClick={handleGenerateReport}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>

      {reportGenerated && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-800 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Financial and operations report successfully compiled and downloaded as PDF!</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase">Total Monthly Revenue</p>
          <h3 className="text-2xl font-extrabold text-gray-900">$24,850.00</h3>
          <p className="text-[11px] text-green-600 font-bold">+14% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase">Total Orders Fulfilled</p>
          <h3 className="text-2xl font-extrabold text-gray-900">1,420</h3>
          <p className="text-[11px] text-green-600 font-bold">+8% efficiency gain</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase">Average Table Turnaround</p>
          <h3 className="text-2xl font-extrabold text-gray-900">42 Mins</h3>
          <p className="text-[11px] text-gray-500 font-semibold">Optimal range</p>
        </div>
      </div>
    </div>
  );
}