import React, { useCallback, useEffect, useState } from 'react';
import { History, Search, ShieldAlert, CheckCircle, Info, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import logService from '../../services/logService';
import usePolling from '../../hooks/usePolling';

const LIMIT = 25;

const BADGE = {
  SUCCESS: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
  WARNING: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
  SYSTEM: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
  INFO: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-400',
};

const ICON = { SUCCESS: CheckCircle, WARNING: ShieldAlert, SYSTEM: Info, INFO: Info };

const formatWhen = (value) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? String(value || '') : d.toLocaleString();
};

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [types, setTypes] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // wait a moment after typing before asking the server
  useEffect(() => {
    const id = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    logService
      .getLogTypes()
      .then((list) => setTypes(list.map((t) => (typeof t === 'string' ? t : t.activity_type || t.type || t.name)).filter(Boolean)))
      .catch(() => setTypes([]));
  }, []);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const res = await logService.getLogsPage({
          page,
          limit: LIMIT,
          search: search || undefined,
          activityType: activityType || undefined,
          from: from || undefined,
          to: to || undefined,
        });
        setLogs(res.rows);
        setPagination(res.pagination);
        setError('');
      } catch (err) {
        setError(err.message || 'Failed to load the activity log.');
      } finally {
        setLoading(false);
      }
    },
    [page, search, activityType, from, to]
  );

  useEffect(() => {
    load();
  }, [load]);

  usePolling(() => load(true), 15000);

  const changeFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-indigo-500" /> Activity Log
          </h1>
          <p className="text-xs text-slate-500">Everything staff and the system have done · {pagination.total} entries</p>
        </div>
        <button type="button" onClick={() => load()} className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border rounded-xl text-xs font-semibold cursor-pointer">
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search action or user..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-800 border rounded-xl outline-none"
          />
        </div>
        <select value={activityType} onChange={changeFilter(setActivityType)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2">
          <option value="">All types</option>
          {types.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input type="date" value={from} max={to || undefined} onChange={changeFilter(setFrom)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2" aria-label="From date" />
        <input type="date" value={to} min={from || undefined} onChange={changeFilter(setTo)} className="bg-white dark:bg-slate-800 border rounded-xl px-3 py-2" aria-label="To date" />
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">{error}</div>}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border shadow-sm overflow-hidden">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">{loading ? 'Loading...' : 'No activity found.'}</div>
        ) : (
          <ul className="divide-y">
            {logs.map((log) => {
              const level = log.level || 'INFO';
              const Icon = ICON[level] || Info;
              return (
                <li key={log.id} className="p-4 flex items-start gap-3 text-xs">
                  <span className={`p-1.5 rounded-lg ${BADGE[level] || BADGE.INFO}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800 dark:text-white">{log.action}</p>
                    <p className="text-slate-400">
                      {log.user}
                      {log.activityType ? ` · ${log.activityType}` : ''}
                    </p>
                  </div>
                  <span className="text-slate-400 whitespace-nowrap">{formatWhen(log.created_at)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <div className="flex gap-2">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="inline-flex items-center gap-1 px-3 py-2 border rounded-xl bg-white dark:bg-slate-800 disabled:opacity-50 cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" /> Previous
          </button>
          <button type="button" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)} className="inline-flex items-center gap-1 px-3 py-2 border rounded-xl bg-white dark:bg-slate-800 disabled:opacity-50 cursor-pointer">
            Next <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
