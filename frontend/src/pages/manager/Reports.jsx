// src/pages/manager/Reports.jsx
import React, { useState } from 'react';
import { FileText, Download, CheckCircle2, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
  const [downloadingId, setDownloadingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const reportsList = [
    {
      id: 1,
      title: 'Monthly Financial Summary',
      desc: 'Detailed profit, loss, gross revenue statements, and tax breakdowns.',
      type: 'PDF / CSV',
      category: 'Finance',
    },
    {
      id: 2,
      title: 'Inventory Usage & Waste Audit',
      desc: 'Ingredient consumption trends, spoilage tracking, and shrinkage reports.',
      type: 'PDF / Excel',
      category: 'Inventory',
    },
    {
      id: 3,
      title: 'Staff Shift & Payroll Log',
      desc: 'Employee hours, active roles, break durations, and attendance records.',
      type: 'CSV / PDF',
      category: 'HR',
    },
    {
      id: 4,
      title: 'Tax & VAT Collection Statement',
      desc: 'Collected sales tax breakdown categorized for fiscal compliance and auditing.',
      type: 'PDF',
      category: 'Finance',
    },
    {
      id: 5,
      title: 'Customer Demographics & Retention',
      desc: 'Repeat visitor statistics, average spend per guest, and loyalty metrics.',
      type: 'PDF / CSV',
      category: 'Operations',
    },
    {
      id: 6,
      title: 'Table Turnover & Seating Efficiency',
      desc: 'Average duration per table, peak rush hours, and reservation ratios.',
      type: 'PDF',
      category: 'Operations',
    },
  ];

  const buildRows = (report) => [
    {
      metricId: 'REC-01',
      description: report.desc,
      status: 'Verified',
      value: '$14,250.00',
    },
    {
      metricId: 'REC-02',
      description: 'Secondary audit checkpoint verified',
      status: 'Passed',
      value: '98.5%',
    },
    {
      metricId: 'REC-03',
      description: 'Compliance & Fiscal Regulation Check',
      status: 'Approved',
      value: 'OK',
    },
  ];

  const handleExportPDF = (report) => {
    setDownloadingId(report.id);

    setTimeout(() => {
      try {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.setTextColor(15, 23, 42);
        doc.text('RestoManager Official Report', 14, 20);

        doc.setFontSize(11);
        doc.setTextColor(100, 116, 139);
        doc.text(`Report: ${report.title}`, 14, 28);
        doc.text(`Category: ${report.category}`, 14, 35);
        doc.text(`Generated Date: ${new Date().toLocaleString()}`, 14, 42);

        const rows = buildRows(report).map((r) => [
          r.metricId,
          r.description.length > 50 ? `${r.description.slice(0, 47)}...` : r.description,
          r.status,
          r.value,
        ]);

        autoTable(doc, {
          startY: 50,
          head: [['Metric ID', 'Description', 'Status', 'Value']],
          body: rows,
          theme: 'grid',
          headStyles: { fillColor: [16, 185, 129] },
        });

        doc.save(`${report.title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
        setSuccessId(report.id);
        setTimeout(() => setSuccessId(null), 4000);
      } finally {
        setDownloadingId(null);
      }
    }, 300);
  };

  const handleExportExcel = (report) => {
    setDownloadingId(report.id);
    try {
      const ws = XLSX.utils.json_to_sheet(buildRows(report));
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, `${report.title.toLowerCase().replace(/\s+/g, '_')}.xlsx`);
      setSuccessId(report.id);
      setTimeout(() => setSuccessId(null), 4000);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans text-xs">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" /> Manager Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Export operational, financial, and inventory reports to PDF or Excel.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportsList.map((report) => {
          const isBusy = downloadingId === report.id;
          const isDone = successId === report.id;

          return (
            <div
              key={report.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    {report.category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{report.type}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {report.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{report.desc}</p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleExportPDF(report)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer transition"
                >
                  {isBusy ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{isDone ? 'Exported' : 'PDF'}</span>
                </button>

                <button
                  type="button"
                  disabled={isBusy}
                  onClick={() => handleExportExcel(report)}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Excel</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}