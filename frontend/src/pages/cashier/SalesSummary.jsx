import React, { useEffect, useState } from 'react';
import { BarChart3, RefreshCw } from 'lucide-react';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';

export function SalesSummary() {
  const [totalSales, setTotalSales] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async () => {
    setLoading(true);
    setError('');
    try {
      const [payRes, orders] = await Promise.all([
        paymentService.getPayments({ limit: 200 }).catch(() => ({ rows: [], summary: null })),
        orderService.getOrders({ limit: 200 }).catch(() => []),
      ]);
      const rows = payRes?.rows || [];
      const sumFromSummary = payRes?.summary?.totalAmount ?? payRes?.summary?.total_amount;
      const sum =
        typeof sumFromSummary === 'number'
          ? Number(sumFromSummary)
          : rows.reduce((s, r) => s + Number(r.amount || 0), 0);
      setTotalSales(sum);
      setOrderCount(orders.length);
    } catch (err) {
      setError(err.message || 'Failed to load sales summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-600" /> Cashier Sales Summary
          </h1>
          <p className="text-slate-500">Live payment and order totals from backend.</p>
        </div>
        <button
          type="button"
          onClick={loadSummary}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-slate-400">Loading summary...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Total Collected Payments</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">${totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <p className="text-slate-400 font-bold uppercase text-[10px]">Recorded Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{orderCount}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalesSummary;