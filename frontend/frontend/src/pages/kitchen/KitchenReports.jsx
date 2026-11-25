// src/pages/kitchen/KitchenReports.jsx
import React, { useState } from 'react';
import { BarChart2, Download, CheckCircle2, Loader2, FileText } from 'lucide-react';

export default function KitchenReports() {
  const [downloadingId, setDownloadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const reportsList = [
    { id: 1, title: 'Daily Kitchen Output Summary', desc: 'Total dishes prepared, peak rush hour metrics, and ingredient consumption counts.', type: 'PDF / CSV', category: 'Operations' },
    { id: 2, title: 'Chef Preparation Speed Audit', desc: 'Average processing duration per meal category and individual chef performance metrics.', type: 'PDF', category: 'Performance' },
    { id: 3, title: 'Kitchen Wastage & Spoilage Log', desc: 'Expired ingredients, spilled inventory items, and discarded preparation waste.', type: 'Excel / PDF', category: 'Inventory' },
    { id: 4, title: 'Recipe Demand Trends', desc: 'Most ordered menu items, ingredient turnover frequencies, and seasonal demand shifts.', type: 'PDF / CSV', category: 'Analytics' },
  ];

  const handleDownloadReport = (report) => {
    setDownloadingId(report.id);
    setTimeout(() => {
      setDownloadingId(null);
      setSuccessId(report.id);

      // Reliable data-uri anchor file download simulation
      const reportText = `========================================
RESTOKITCHEN - OFFICIAL KITCHEN REPORT
========================================
Title: ${report.title.toUpperCase()}
Category: ${report.category}
Generated Date: ${new Date().toLocaleString()}
Status: VERIFIED & AUDITED
----------------------------------------
Description: ${report.desc}

[AUDIT SUMMARY]
- Total Tickets Processed: 82 Orders
- Average Turnaround Time: 18 minutes
- Efficiency Rating: 92% (Excellent)

End of Report. RestoManager Kitchen Division.
========================================`;

      const encodedUri = 'data:text/plain;charset=utf-8,' + encodeURIComponent(reportText);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${report.title.toLowerCase().replace(/\s+/g, '_')}_report.txt`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => setSuccessId(null), 4000);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-500" /> Kitchen Reports & Audits
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Generate, review, and export kitchen operations reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportsList.map(report => {
          const isDownloading = downloadingId === report.id;
          const isSuccess = successId === report.id;

          return (
            <div key={report.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full uppercase text-slate-600 dark:text-slate-300">
                    {report.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{report.type}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">{report.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{report.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  disabled={isDownloading}
                  onClick={() => handleDownloadReport(report)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSuccess 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" /> Generating Report...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Downloaded Successfully!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-500" /> Export Report
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}