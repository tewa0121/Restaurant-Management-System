import React, { useEffect, useState } from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import reportService from '../../services/reportService';

export default function ReportsAndAnalytics() {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [summary, setSummary] = useState(null);
  const [topItems, setTopItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [error, setError] = useState('');

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      const [sumData, topData, catData] = await Promise.all([
        reportService.getSummary(params),
        reportService.getTopItemsReport({ ...params, limit: 10 }),
        reportService.getCategoriesReport(params),
      ]);

      setSummary(sumData || {});
      setTopItems(Array.isArray(topData?.rows) ? topData.rows : Array.isArray(topData) ? topData : []);
      setCategories(Array.isArray(catData?.rows) ? catData.rows : Array.isArray(catData) ? catData : []);
    } catch (err) {
      setError(err.message || 'Failed to load reports.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleGenerateReport = async () => {
    setDownloading(true);
    setError('');
    try {
      const params = {};
      if (fromDate) params.from = fromDate;
      if (toDate) params.to = toDate;

      await reportService.downloadCsv('sales', params, 'sales-report.csv');
      setReportGenerated(true);
      setTimeout(() => setReportGenerated(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to export CSV report.');
    } finally {
      setDownloading(false);
    }
  };

  const totalRevenue = Number(
    summary?.totalSales ?? summary?.sales ?? summary?.revenue ?? summary?.totalRevenue ?? 0
  );
  const totalOrders = Number(summary?.totalOrders ?? summary?.orders ?? 0);
  const avgOrder = Number(
    summary?.averageOrderValue ?? summary?.avgOrderValue ?? (totalOrders > 0 ? totalRevenue / totalOrders : 0)
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reports & Analytics</h1>
          <p className="text-xs text-gray-500 mt-1">
            Analyze revenue metrics, top-selling menu items, and export business reports.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50"
          />
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-gray-50"
          />
          <button
            type="button"
            onClick={loadReports}
            className="px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Apply
          </button>
          <button
            type="button"
            disabled={downloading}
            onClick={handleGenerateReport}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{downloading ? 'Exporting...' : 'Export CSV'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {reportGenerated && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex items-center gap-3 text-green-800 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
          <span>Sales report CSV compiled and downloaded successfully!</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Total Sales</p>
              <p className="text-2xl font-extrabold text-gray-900">${totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Total Orders</p>
              <p className="text-2xl font-extrabold text-gray-900">{totalOrders}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
              <p className="text-xs font-bold text-gray-400 uppercase">Average Order Value</p>
              <p className="text-2xl font-extrabold text-emerald-600">${avgOrder.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-gray-900">Top Selling Items</h2>
              <div className="divide-y divide-gray-100 text-xs">
                {topItems.length === 0 ? (
                  <p className="text-gray-400 py-4">No top item records for this range.</p>
                ) : (
                  topItems.map((row, idx) => (
                    <div key={row.id || row.name || idx} className="py-2.5 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-gray-900">
                          #{row.rank || idx + 1} {row.name}
                        </p>
                        <p className="text-gray-400 text-[11px]">
                          {row.category || 'General'} • {row.quantity ?? 0} sold
                        </p>
                      </div>
                      <span className="font-extrabold text-emerald-600">
                        ${Number(row.revenue || 0).toFixed(2)}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-sm font-extrabold text-gray-900">Revenue by Category</h2>
              <div className="divide-y divide-gray-100 text-xs">
                {categories.length === 0 ? (
                  <p className="text-gray-400 py-4">No category revenue records for this range.</p>
                ) : (
                  categories.map((cat, idx) => (
                    <div key={cat.category || idx} className="py-2.5 flex items-center justify-between">
                      <span className="font-bold text-gray-900">{cat.category || 'Uncategorized'}</span>
                      <span className="font-extrabold text-gray-800">
                        ${Number(cat.revenue || 0).toFixed(2)} ({cat.share ?? 0}%)
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}