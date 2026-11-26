import React, { useState } from 'react';
import { FileText, Download, Loader2, FileSpreadsheet, Table2 } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import reportService from '../../services/reportService';
import { dayOffset } from '../../utils/dateRange';

const label = (key) =>
  String(key)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase());

const cols = (...keys) => keys.map((key) => ({ key, label: label(key) }));

// Each report matches one GET /reports/<id> endpoint.
const REPORTS = [
  {
    id: 'summary',
    title: 'Business Summary',
    desc: 'Orders, sales, tax, discounts, refunds and net revenue for the period.',
    category: 'Finance',
    load: reportService.getSummary,
    columns: [{ key: 'metric', label: 'Metric' }, { key: 'value', label: 'Value' }],
    toRows: (d) => {
      const skip = ['from', 'to', 'reservationsByStatus'];
      const rows = Object.entries(d || {})
        .filter(([k]) => !skip.includes(k))
        .map(([k, v]) => ({ metric: label(k), value: v }));
      Object.entries(d?.reservationsByStatus || {}).forEach(([k, v]) =>
        rows.push({ metric: `Reservations (${k})`, value: v })
      );
      return rows;
    },
  },
  {
    id: 'sales',
    title: 'Sales by Day',
    desc: 'Orders, subtotal, discounts, tax and sales for every day.',
    category: 'Finance',
    load: reportService.getSalesReport,
    columns: cols('period', 'orders', 'completedOrders', 'subtotal', 'discount', 'tax', 'sales', 'averageOrderValue'),
  },
  {
    id: 'payment-methods',
    title: 'Payment Methods',
    desc: 'How customers paid: number of payments, totals and share.',
    category: 'Finance',
    load: reportService.getPaymentMethodsReport,
    columns: cols('label', 'payments', 'total', 'share'),
  },
  {
    id: 'categories',
    title: 'Revenue by Category',
    desc: 'Which menu categories bring in the most revenue.',
    category: 'Menu',
    load: reportService.getCategoriesReport,
    columns: cols('category', 'revenue', 'share'),
  },
  {
    id: 'top-items',
    title: 'Top Selling Items',
    desc: 'Best selling dishes by quantity and revenue.',
    category: 'Menu',
    load: reportService.getTopItemsReport,
    columns: cols('rank', 'name', 'category', 'quantity', 'revenue'),
  },
  {
    id: 'staff',
    title: 'Staff Performance',
    desc: 'Orders handled and sales per staff member.',
    category: 'Staff',
    load: reportService.getStaffReport,
    columns: cols('name', 'position', 'orders', 'completedOrders', 'sales', 'averageOrderValue'),
  },
  {
    id: 'inventory',
    title: 'Inventory Usage',
    desc: 'Ingredients used, purchased, returned and current stock.',
    category: 'Inventory',
    load: reportService.getInventoryReport,
    columns: cols('ingredient', 'unit', 'used', 'purchased', 'returned', 'currentStock', 'minStockLevel', 'low'),
  },
];

export default function Reports() {
  const [from, setFrom] = useState(dayOffset(-29));
  const [to, setTo] = useState(dayOffset(0));
  const [activeId, setActiveId] = useState(null);
  const [busy, setBusy] = useState(null);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');

  const active = REPORTS.find((r) => r.id === activeId);
  const params = { from, to };

  const generate = async (report) => {
    setBusy(report.id);
    setError('');
    try {
      const data = await report.load(params);
      const list = report.toRows ? report.toRows(data) : data?.rows || [];
      setActiveId(report.id);
      setRows(list);
    } catch (err) {
      setError(err.message || 'Failed to generate the report.');
    } finally {
      setBusy(null);
    }
  };

  const fileName = (ext) => `${active.id}-${from}-to-${to}.${ext}`;
  const body = () => rows.map((r) => active.columns.map((c) => String(r[c.key] ?? '')));

  const exportCsv = async () => {
    try {
      await reportService.downloadCsv(active.id, params, fileName('csv'));
    } catch (err) {
      setError(err.message || 'CSV download failed.');
    }
  };

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: active.columns.length > 6 ? 'landscape' : 'portrait' });
    doc.setFontSize(14);
    doc.text(active.title, 14, 16);
    doc.setFontSize(9);
    doc.text(`${from} to ${to}`, 14, 22);
    autoTable(doc, { head: [active.columns.map((c) => c.label)], body: body(), startY: 28, styles: { fontSize: 8 } });
    doc.save(fileName('pdf'));
  };

  const exportXlsx = () => {
    const sheet = XLSX.utils.aoa_to_sheet([active.columns.map((c) => c.label), ...body()]);
    const book = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, sheet, active.title.slice(0, 31));
    XLSX.writeFile(book, fileName('xlsx'));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-500" /> Reports
          </h1>
          <p className="text-xs text-slate-500">Generate a report for any period, preview it, then export it.</p>
        </div>
        <div className="flex items-end gap-3 text-xs">
          <label className="space-y-1">
            <span className="block font-semibold text-slate-500">From</span>
            <input type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} className="border rounded-xl px-3 py-2 bg-white dark:bg-slate-800" />
          </label>
          <label className="space-y-1">
            <span className="block font-semibold text-slate-500">To</span>
            <input type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} className="border rounded-xl px-3 py-2 bg-white dark:bg-slate-800" />
          </label>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {REPORTS.map((r) => (
          <div
            key={r.id}
            className={`bg-white dark:bg-slate-800 p-5 rounded-2xl border shadow-sm space-y-3 ${activeId === r.id ? 'border-emerald-400' : ''}`}
          >
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{r.category}</span>
            <h3 className="font-bold text-sm text-slate-800 dark:text-white">{r.title}</h3>
            <p className="text-xs text-slate-500">{r.desc}</p>
            <button
              type="button"
              disabled={busy !== null}
              onClick={() => generate(r)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              {busy === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Table2 className="w-3.5 h-3.5" />}
              Generate
            </button>
          </div>
        ))}
      </div>

      {active && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden">
          <div className="p-4 border-b flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">{active.title}</h3>
              <p className="text-[11px] text-slate-400">
                {from} to {to} · {rows.length} row{rows.length === 1 ? '' : 's'}
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <button type="button" onClick={exportCsv} className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl font-semibold cursor-pointer">
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
              <button type="button" onClick={exportXlsx} disabled={rows.length === 0} className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl font-semibold cursor-pointer disabled:opacity-50">
                <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
              </button>
              <button type="button" onClick={exportPdf} disabled={rows.length === 0} className="inline-flex items-center gap-1.5 px-3 py-2 border rounded-xl font-semibold cursor-pointer disabled:opacity-50">
                <FileText className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400">
                <tr>
                  {active.columns.map((c) => (
                    <th key={c.key} className="p-3">{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={active.columns.length} className="p-6 text-center text-slate-400">
                      No data for this period.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, i) => (
                    <tr key={i} className="border-t">
                      {active.columns.map((c) => (
                        <td key={c.key} className="p-3">{String(r[c.key] ?? '')}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
