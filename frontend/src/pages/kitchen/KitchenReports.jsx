// src/pages/kitchen/KitchenReports.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BarChart2, Download, Eye, Loader2, X } from 'lucide-react';
import kitchenService from '../../services/kitchenService';
import { dayOffset } from '../../utils/dateRange';

const REPORTS = [
  {
    type: 'output',
    title: 'Daily Kitchen Output Summary',
    desc: 'Finished tickets, dishes prepared, average prep time and on-time rate per day.',
    category: 'Operations',
    columns: [
      ['day', 'Day'],
      ['orders', 'Orders'],
      ['dishes', 'Dishes'],
      ['avgPrepMinutes', 'Avg prep (min)'],
      ['onTimeRate', 'On time %'],
    ],
  },
  {
    type: 'speed',
    title: 'Preparation Speed by Category',
    desc: 'How long orders containing each menu category take from start to ready.',
    category: 'Performance',
    columns: [
      ['category', 'Category'],
      ['orders', 'Orders'],
      ['avgPrepMinutes', 'Avg prep (min)'],
      ['slowestMinutes', 'Slowest (min)'],
      ['onTimeRate', 'On time %'],
    ],
  },
  {
    type: 'wastage',
    title: 'Kitchen Wastage & Write-offs',
    desc: 'Ingredients removed from stock through negative inventory adjustments.',
    category: 'Inventory',
    columns: [
      ['ingredient', 'Ingredient'],
      ['unit', 'Unit'],
      ['entries', 'Entries'],
      ['quantity', 'Written off'],
      ['lastNote', 'Last note'],
    ],
  },
  {
    type: 'demand',
    title: 'Recipe Demand Trends',
    desc: 'Most ordered dishes with quantity, orders and share of total.',
    category: 'Analytics',
    columns: [
      ['rank', '#'],
      ['name', 'Item'],
      ['category', 'Category'],
      ['quantity', 'Qty'],
      ['orders', 'Orders'],
      ['share', 'Share %'],
    ],
  },
];

export default function KitchenReports() {
  const [from, setFrom] = useState(dayOffset(-6));
  const [to, setTo] = useState(dayOffset(0));
  const [busy, setBusy] = useState(null); // `${type}:preview` | `${type}:csv`
  const [open, setOpen] = useState(null); // { report, data }
  const [error, setError] = useState('');

  const params = useMemo(() => ({ from, to }), [from, to]);
  const rangeInvalid = !from || !to || from > to;

  const preview = useCallback(
    async (report) => {
      setBusy(`${report.type}:preview`);
      setError('');
      try {
        const data = await kitchenService.getReport(report.type, params);
        setOpen({ report, data });
      } catch (err) {
        setError(err.message || 'Failed to load the report.');
      } finally {
        setBusy(null);
      }
    },
    [params]
  );

  // keep an opened preview in step with the date range
  useEffect(() => {
    if (open && !rangeInvalid) preview(open.report);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [from, to]);

  const download = async (report) => {
    setBusy(`${report.type}:csv`);
    setError('');
    try {
      await kitchenService.downloadReportCsv(report.type, params);
    } catch (err) {
      setError(err.message || 'Failed to download the report.');
    } finally {
      setBusy(null);
    }
  };

  const cell = (row, key) => {
    const v = row[key];
    if (v === null || v === undefined || v === '') return '-';
    return String(v);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-emerald-500" /> Kitchen Reports & Audits
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Live reports built from kitchen tickets and stock movements. Export any of them as CSV.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 font-semibold text-slate-500">
            From
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </label>
          <label className="flex items-center gap-1.5 font-semibold text-slate-500">
            To
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>
      )}
      {rangeInvalid && (
        <div className="p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-xs font-semibold">
          Choose a valid date range (the start date must not be after the end date).
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {REPORTS.map((report) => {
          const previewing = busy === `${report.type}:preview`;
          const downloading = busy === `${report.type}:csv`;
          return (
            <div
              key={report.type}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full uppercase text-slate-600 dark:text-slate-300">
                    {report.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">CSV</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-white">{report.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{report.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={rangeInvalid || Boolean(busy)}
                  onClick={() => preview(report)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-50 cursor-pointer"
                >
                  {previewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                  Preview
                </button>
                <button
                  type="button"
                  disabled={rangeInvalid || Boolean(busy)}
                  onClick={() => download(report)}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 cursor-pointer"
                >
                  {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export CSV
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {open && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm">{open.report.title}</h3>
              <p className="text-[11px] text-slate-400">
                {open.data.from} to {open.data.to} · {open.data.rows.length} row{open.data.rows.length === 1 ? '' : 's'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(null)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              aria-label="Close preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  {open.report.columns.map(([key, label]) => (
                    <th key={key} className="p-3">{label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {open.data.rows.map((row, i) => (
                  <tr key={i}>
                    {open.report.columns.map(([key]) => (
                      <td key={key} className="p-3">{cell(row, key)}</td>
                    ))}
                  </tr>
                ))}
                {open.data.rows.length === 0 && (
                  <tr>
                    <td colSpan={open.report.columns.length} className="p-8 text-center text-slate-400">
                      No data for this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
