import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, Download, RefreshCw } from 'lucide-react';
import reportService from '../../services/reportService';
import useCurrency from '../../hooks/useCurrency';
import usePolling from '../../hooks/usePolling';
import { dayOffset, monthStart, weekStart, toCsv, downloadTextFile } from '../../utils/dateRange';

// What each timeframe asks the server for.
const buildQuery = (timeframe) => {
  if (timeframe === 'daily') return { from: dayOffset(-29), to: dayOffset(0), groupBy: 'day' };
  if (timeframe === 'weekly') return { from: dayOffset(-83), to: dayOffset(0), groupBy: 'day' };
  return { from: monthStart(11), to: dayOffset(0), groupBy: 'month' };
};

// Weekly view: add the daily rows up into Monday-based weeks.
const toWeeks = (rows) => {
  const weeks = new Map();
  rows.forEach((r) => {
    const key = weekStart(r.period);
    const w = weeks.get(key) || { period: `Week of ${key}`, orders: 0, completedOrders: 0, discount: 0, tax: 0, sales: 0 };
    w.orders += Number(r.orders) || 0;
    w.completedOrders += Number(r.completedOrders) || 0;
    w.discount += Number(r.discount) || 0;
    w.tax += Number(r.tax) || 0;
    w.sales += Number(r.sales) || 0;
    weeks.set(key, w);
  });
  return [...weeks.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([, w]) => ({ ...w, averageOrderValue: w.completedOrders ? w.sales / w.completedOrders : 0 }));
};

export default function SalesAndRevenue() {
  const { formatMoney } = useCurrency();
  const [timeframe, setTimeframe] = useState('monthly');
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      const q = buildQuery(timeframe);
      try {
        const [sales, sum] = await Promise.all([
          reportService.getSalesReport(q),
          reportService.getSummary({ from: q.from, to: q.to }),
        ]);
        const list = sales?.rows || [];
        setRows(timeframe === 'weekly' ? toWeeks(list) : list);
        setSummary(sum);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load sales data.');
      } finally {
        setLoading(false);
      }
    },
    [timeframe]
  );

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 60000);

  const max = useMemo(() => Math.max(1, ...rows.map((r) => Number(r.sales) || 0)), [rows]);

  const exportCsv = () => {
    const columns = [
      { key: 'period', label: 'Period' },
      { key: 'orders', label: 'Orders' },
      { key: 'discount', label: 'Discounts' },
      { key: 'tax', label: 'Tax' },
      { key: 'sales', label: 'Sales' },
      { key: 'averageOrderValue', label: 'Average order' },
    ];
    const fixed = rows.map((r) => ({ ...r, discount: Number(r.discount).toFixed(2), tax: Number(r.tax).toFixed(2), sales: Number(r.sales).toFixed(2), averageOrderValue: Number(r.averageOrderValue).toFixed(2) }));
    downloadTextFile(`sales-${timeframe}-${dayOffset(0)}.csv`, toCsv(columns, fixed));
  };

  const cards = summary
    ? [
        { label: 'Sales', value: formatMoney(summary.sales) },
        { label: 'Net revenue', value: formatMoney(summary.netRevenue) },
        { label: 'Orders', value: summary.orders },
        { label: 'Average order', value: formatMoney(summary.averageOrderValue) },
        { label: 'Discounts given', value: formatMoney(summary.discounts) },
        { label: 'Refunded', value: formatMoney(summary.refunded) },
      ]
    : [];

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-500" /> Sales & Revenue
          </h1>
          <p className="text-xs text-slate-500">
            {summary ? `${summary.from} to ${summary.to}` : 'Financial breakdown from real orders and payments.'}
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2">
            <option value="daily">Daily (last 30 days)</option>
            <option value="weekly">Weekly (last 12 weeks)</option>
            <option value="monthly">Monthly (last 12 months)</option>
          </select>
          <button type="button" onClick={() => load()} className="p-2 border rounded-xl bg-white dark:bg-slate-800 cursor-pointer" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button type="button" onClick={exportCsv} disabled={rows.length === 0} className="px-4 py-2 bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-white dark:bg-slate-800 p-4 rounded-2xl border shadow-sm">
            <p className="text-[11px] text-slate-400 font-medium">{c.label}</p>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">{c.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-400">
              <tr>
                <th className="p-3">Period</th>
                <th className="p-3">Orders</th>
                <th className="p-3">Discounts</th>
                <th className="p-3">Tax</th>
                <th className="p-3">Sales</th>
                <th className="p-3">Avg. order</th>
                <th className="p-3 w-40"> </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-slate-400">
                    {loading ? 'Loading...' : 'No sales in this period.'}
                  </td>
                </tr>
              ) : (
                [...rows].reverse().map((r) => (
                  <tr key={r.period} className="border-t">
                    <td className="p-3 font-semibold">{r.period}</td>
                    <td className="p-3">{r.orders}</td>
                    <td className="p-3">{formatMoney(r.discount)}</td>
                    <td className="p-3">{formatMoney(r.tax)}</td>
                    <td className="p-3 font-bold">{formatMoney(r.sales)}</td>
                    <td className="p-3">{formatMoney(r.averageOrderValue)}</td>
                    <td className="p-3">
                      <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${((Number(r.sales) || 0) / max) * 100}%` }} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
