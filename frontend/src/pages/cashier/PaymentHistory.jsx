import React, { useEffect, useState } from 'react';
import { CreditCard, RefreshCw } from 'lucide-react';
import paymentService from '../../services/paymentService';

export function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPayments = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await paymentService.getPayments({ limit: 100 });
      setPayments(res?.rows || []);
    } catch (err) {
      setError(err.message || 'Failed to load payment history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-emerald-600" /> Payment History
          </h1>
          <p className="text-slate-500">Recorded transactions from the backend.</p>
        </div>
        <button
          type="button"
          onClick={loadPayments}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">TXN #</th>
              <th className="p-4">Order #</th>
              <th className="p-4">Method</th>
              <th className="p-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading payments...</td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-slate-400">No payments found.</td></tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">#{p.id}</td>
                  <td className="p-4">{p.orderNumber || p.order_number || p.orderId || p.order_id || '-'}</td>
                  <td className="p-4 capitalize">{p.paymentMethod || p.payment_method || p.method || 'cash'}</td>
                  <td className="p-4 font-extrabold text-emerald-600">${Number(p.amount ?? 0).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaymentHistory;