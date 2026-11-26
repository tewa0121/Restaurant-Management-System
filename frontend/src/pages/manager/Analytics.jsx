import React, { useCallback, useEffect, useState } from 'react';
import { BarChart2, RefreshCw } from 'lucide-react';
import reportService from '../../services/reportService';
import useCurrency from '../../hooks/useCurrency';
import usePolling from '../../hooks/usePolling';
import { dayOffset } from '../../utils/dateRange';

const RANGES = [
  { value: 7, label: 'Last 7 days' },
  { value: 30, label: 'Last 30 days' },
  { value: 90, label: 'Last 90 days' },
];

function Bars({ rows, valueKey, labelKey, format }) {
  const max = Math.max(1, ...rows.map((r) => Number(r[valueKey]) || 0));
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={`${r[labelKey]}`} className="space-y-1">
          <div className="flex justify-between text-[11px]">
            <span className="font-semibold">{r[labelKey]}</span>
            <span>{format ? format(r[valueKey]) : r[valueKey]}</span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500" style={{ width: `${((Number(r[valueKey]) || 0) / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const Empty = () => <p className="text-xs text-slate-400">No data for this period.</p>;

export default function Analytics() {
  const { formatMoney } = useCurrency();
  const [metric, setMetric] = useState('sales');
  const [days, setDays] = useState(30);
  const [sales, setSales] = useState([]);
  const [categories, setCategories] = useState([]);
  const [methods, setMethods] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      const params = { from: dayOffset(-(days - 1)), to: dayOffset(0) };
      try {
        const [s, c, m, t] = await Promise.all([
          reportService.getSalesReport({ ...params, groupBy: 'day' }),
          reportService.getCategoriesReport(params),
          reportService.getPaymentMethodsReport(params),
          reportService.getTopItemsReport({ ...params, limit: 10 }),
        ]);
        setSales(s?.rows || []);
        setCategories(c?.rows || []);
        setMethods(m?.rows || []);
        setTopItems(t?.rows || []);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load analytics.');
      } finally {
        setLoading(false);
      }
    },
    [days]
  );

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 60000);

  const maxSales = Math.max(1, ...sales.map((r) => Number(r.sales) || 0));
  const totalOrders = sales.reduce((sum, r) => sum + Number(r.orders || 0), 0);

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-indigo-500" /> Restaurant Analytics
          </h1>
          <p className="text-xs text-slate-500">Performance trends from real orders and payments.</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2">
            {RANGES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          <select value={metric} onChange={(e) => setMetric(e.target.value)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2">
            <option value="sales">Sales & Orders</option>
            <option value="items">Top Selling Items</option>
          </select>
          <button type="button" onClick={() => load()} className="p-2 border rounded-xl bg-white dark:bg-slate-800 cursor-pointer" aria-label="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

      {metric === 'sales' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Daily Sales</h3>
              <span className="text-[11px] text-slate-400">{totalOrders} orders in this period</span>
            </div>
            {sales.length === 0 ? (
              <Empty />
            ) : (
              <div className="h-48 flex items-end gap-1 overflow-x-auto pt-4">
                {sales.map((r) => (
                  <div key={r.period} className="flex-1 min-w-[10px] flex flex-col items-center justify-end h-full group" title={`${r.period}: ${formatMoney(r.sales)} · ${r.orders} orders`}>
                    <div className="w-full bg-indigo-500 group-hover:bg-indigo-600 rounded-t" style={{ height: `${Math.max(2, ((Number(r.sales) || 0) / maxSales) * 100)}%` }} />
                  </div>
                ))}
              </div>
            )}
            {sales.length > 0 && (
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>{sales[0].period}</span>
                <span>{sales[sales.length - 1].period}</span>
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Revenue by Category</h3>
            {categories.length === 0 ? <Empty /> : <Bars rows={categories} labelKey="category" valueKey="revenue" format={formatMoney} />}
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">Payment Methods</h3>
            {methods.length === 0 ? <Empty /> : <Bars rows={methods} labelKey="label" valueKey="total" format={formatMoney} />}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm">Top Selling Items</h3>
          {topItems.length === 0 ? (
            <Empty />
          ) : (
            <>
              <Bars rows={topItems.map((i) => ({ ...i, label: `${i.rank}. ${i.name}` }))} labelKey="label" valueKey="quantity" format={(v) => `${v} sold`} />
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400">
                    <tr><th className="p-2">#</th><th className="p-2">Item</th><th className="p-2">Category</th><th className="p-2">Qty</th><th className="p-2">Revenue</th></tr>
                  </thead>
                  <tbody>
                    {topItems.map((i) => (
                      <tr key={i.id} className="border-t">
                        <td className="p-2">{i.rank}</td><td className="p-2 font-semibold">{i.name}</td><td className="p-2">{i.category}</td><td className="p-2">{i.quantity}</td><td className="p-2">{formatMoney(i.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
