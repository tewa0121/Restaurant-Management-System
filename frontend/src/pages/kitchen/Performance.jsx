// src/pages/kitchen/Performance.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { TrendingUp, Clock, CheckCircle2, Flame, Timer, RefreshCw } from 'lucide-react';
import kitchenService from '../../services/kitchenService';
import usePolling from '../../hooks/usePolling';
import { dayOffset } from '../../utils/dateRange';

const RANGES = [
  { label: 'Today', days: 1 },
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
];

const fmt = (v, suffix = '') => (v === null || v === undefined ? '-' : `${v}${suffix}`);

export default function Performance() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (silent !== true) setLoading(true);
      try {
        const res = await kitchenService.getPerformance({ from: dayOffset(-(days - 1)), to: dayOffset(0) });
        setData(res);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load kitchen performance.');
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

  const s = data?.summary || {};
  const maxDaily = Math.max(1, ...(data?.daily || []).map((d) => d.orders));
  const maxHour = Math.max(1, ...(data?.byHour || []).map((h) => h.orders));

  const cards = [
    { label: 'Completed Orders', value: fmt(s.completedOrders), icon: CheckCircle2, tone: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950' },
    { label: 'Avg Prep Time', value: fmt(s.avgPrepMinutes, ' min'), icon: Clock, tone: 'text-blue-600 bg-blue-100 dark:bg-blue-950' },
    { label: 'On-time Rate', value: fmt(s.onTimeRate, '%'), icon: Timer, tone: 'text-purple-600 bg-purple-100 dark:bg-purple-950' },
    { label: 'Peak Hour', value: fmt(s.peakHour), icon: Flame, tone: 'text-orange-600 bg-orange-100 dark:bg-orange-950' },
  ];

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-purple-500" /> Kitchen Performance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Team speed and output from kitchen tickets
            {data ? ` · target ${data.targetMinutes} min per order` : ''}. Updates automatically.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {RANGES.map((r) => (
            <button
              key={r.days}
              type="button"
              onClick={() => setDays(r.days)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                days === r.days
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              {r.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => load()}
            className="p-2 rounded-xl bg-slate-900 text-white cursor-pointer"
            aria-label="Refresh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>
      )}

      {loading && !data ? (
        <div className="p-10 text-center text-xs text-slate-400">Loading performance...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map(({ label, value, icon: Icon, tone }) => (
              <div key={label} className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tone}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Orders finished per day</h3>
              {(data?.daily || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No finished orders in this period.</p>
              ) : (
                <div className="space-y-2.5">
                  {data.daily.map((d) => (
                    <div key={d.day} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{d.day}</span>
                        <span className="text-slate-400">
                          {d.orders} orders · {fmt(d.avgPrepMinutes, ' min')} avg · {fmt(d.onTimeRate, '%')} on time
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(d.orders / maxDaily) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm mb-4">Busiest hours</h3>
              {(data?.byHour || []).length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No data yet.</p>
              ) : (
                <div className="flex items-end gap-1.5 h-40">
                  {data.byHour.map((h) => (
                    <div key={h.hour} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
                      <span className="text-[9px] text-slate-400 mb-1">{h.orders}</span>
                      <div className="w-full bg-orange-400 rounded-t" style={{ height: `${Math.max(4, (h.orders / maxHour) * 100)}%` }} />
                      <span className="text-[9px] text-slate-400 mt-1 truncate">{h.hour}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm">Speed by menu category</h3>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Orders</th>
                  <th className="p-3">Avg prep</th>
                  <th className="p-3">Slowest</th>
                  <th className="p-3">On time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(data?.byCategory || []).map((c) => (
                  <tr key={c.category}>
                    <td className="p-3 font-bold">{c.category}</td>
                    <td className="p-3">{c.orders}</td>
                    <td className="p-3 text-emerald-600 font-bold">{fmt(c.avgPrepMinutes, ' min')}</td>
                    <td className="p-3">{fmt(c.slowestMinutes, ' min')}</td>
                    <td className="p-3 text-blue-600 font-bold">{fmt(c.onTimeRate, '%')}</td>
                  </tr>
                ))}
                {(data?.byCategory || []).length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-400">No finished orders in this period.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
