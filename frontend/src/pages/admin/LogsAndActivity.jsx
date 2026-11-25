import React, { useEffect, useState } from 'react';
import { Search, RefreshCw } from 'lucide-react';
import logService from '../../services/logService';

export default function LogsAndActivity() {
  const [logs, setLogs] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = { limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (selectedType) params.activityType = selectedType;

      const [logList, typeList] = await Promise.all([
        logService.getLogs(params),
        logService.getLogTypes().catch(() => []),
      ]);
      setLogs(logList);
      setTypes(typeList);
    } catch (err) {
      setError(err.message || 'Failed to load activity logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, [selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLogs();
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            System Logs & Activity
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Audit administrative actions, user sign-ins, and system events.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold outline-none"
          >
            <option value="">All Types</option>
            {types.map((t, idx) => {
              const val = typeof t === 'string' ? t : t.type || t.activityType || t.name || '';
              return (
                <option key={val || idx} value={val}>
                  {val}
                </option>
              );
            })}
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search logs..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />
          </div>

          <button
            type="button"
            onClick={loadLogs}
            className="p-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </form>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-100 text-xs">
          {loading ? (
            <div className="p-8 text-center text-gray-400">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="p-8 text-center text-gray-400">No activity logs found.</div>
          ) : (
            logs.map((item, idx) => {
              const actor = item.userName || item.user_name || item.actor || 'System';
              const action = item.description || item.action || item.message || 'Activity';
              const type = item.activityType || item.activity_type || item.type || 'LOG';
              const time = item.createdAt || item.created_at || item.timestamp || '';

              return (
                <div key={item.id || idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-gray-900">
                      {actor} — <span className="font-medium text-gray-700">{action}</span>
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5 uppercase font-bold">{type}</p>
                  </div>
                  <span className="text-[11px] text-gray-400">{time}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}