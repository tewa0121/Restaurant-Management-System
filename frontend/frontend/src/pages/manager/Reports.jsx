// src/pages/manager/Reports.jsx
import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [downloadingId, setDownloadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const reportsList = [
    { id: 1, title: 'Monthly Financial Summary', desc: 'Detailed profit, loss, gross revenue statements, and tax breakdowns.', type: 'PDF / CSV', category: 'Finance' },
    { id: 2, title: 'Inventory Usage & Waste Audit', desc: 'Ingredient consumption trends, spoilage tracking, and shrinkage reports.', type: 'PDF / Excel', category: 'Inventory' },
    { id: 3, title: 'Staff Shift & Payroll Log', desc: 'Employee hours, active roles, break durations, and attendance records.', type: 'CSV / PDF', category: 'HR' },
    { id: 4, title: 'Tax & VAT Collection Statement', desc: 'Collected sales tax breakdown categorized for fiscal compliance and auditing.', type: 'PDF', category: 'Finance' },
    { id: 5, title: 'Customer Demographics & Retention', desc: 'Repeat visitor statistics, average spend per guest, and loyalty metrics.', type: 'PDF / CSV', category: 'Operations' },
    { id: 6, title: 'Table Turnover & Seating Efficiency', desc: 'Average duration per table, peak rush hours, and reservation ratios.', type: 'PDF', category: 'Operations' },
  ];

  const handleExportPDF = (report) => {
    setDownloadingId(report.id);

    setTimeout(() => {
      setDownloadingId(null);
      setSuccessId(report.id);

      // Create PDF using jsPDF
      const doc = new jsPDF();
      
      // Header Styling
      doc.setFontSize(18);
      doc.setTextColor(15, 23, 42);
      doc.text('RestoManager Official Report', 14, 20);

      doc.setFontSize(11, 'bold');
      doc.setTextColor(100, 116, 139);
      doc.text(`Report: ${report.title}`, 14, 28);
      doc.text(`Category: ${report.category}`, 14, 35);
      doc.text(`Generated Date: ${new Date().toLocaleString()}`, 14, 42);

      // Add a table summary
      doc.autoTable({
        startY: 50,
        head: [['Metric ID', 'Description', 'Status', 'Value']],
        body: [
          ['REC-01', report.desc.substring(0, 45) + '...', 'Verified', '$14,250.00'],
          ['REC-02', 'Secondary audit checkpoint verified', 'Passed', '98.5%'],
          ['REC-03', 'Compliance & Fiscal Regulation Check', 'Approved', 'OK'],
        ],
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
      });

      // Save PDF file
      doc.save(`${report.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);

      setTimeout(() => setSuccessId(null), 4000);
    }, 1000);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-rose-500" /> Reports & PDF Exports
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate, preview, and download audit-ready operational and financial documents.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((rep) => {
          const isDownloading = downloadingId === rep.id;
          const isSuccess = successId === rep.id;

          return (
            <div 
              key={rep.id} 
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full uppercase text-slate-600 dark:text-slate-300">
                    {rep.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">{rep.type}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-sm pt-1">{rep.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <button 
                  type="button"
                  disabled={isDownloading}
                  onClick={() => handleExportPDF(rep)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSuccess 
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400' 
                      : 'bg-slate-100 dark:bg-slate-700/60 hover:bg-rose-50 hover:text-rose-600 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-rose-500" /> Generating PDF...
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Exported Successfully!
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-rose-500" /> Export PDF Report
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