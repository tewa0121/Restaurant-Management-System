import React, { useEffect, useState } from 'react';
import { FileText, RefreshCw } from 'lucide-react';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';

export function ActiveBills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settledMsg, setSettledMsg] = useState('');
  const [error, setError] = useState('');

  const loadActiveBills = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getOrders({ limit: 100 });
      const active = list.filter((o) => {
        const st = String(o.status || '').toLowerCase();
        return st !== 'completed' && st !== 'cancelled';
      });
      setBills(active);
    } catch (err) {
      setError(err.message || 'Failed to load active bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActiveBills();
  }, []);

  const handleSettle = async (bill) => {
    const amount = Number(bill.totalAmount ?? bill.total_amount ?? bill.total ?? 0);
    setError('');
    setSettledMsg('');
    try {
      await paymentService.processPayment({
        orderId: bill.id,
        amount,
        method: 'cash',
      });
      setSettledMsg(`Settled ${bill.orderNumber || bill.order_number || `#${bill.id}`}.`);
      setTimeout(() => setSettledMsg(''), 3000);
      await loadActiveBills();
    } catch (err) {
      setError(err.message || 'Failed to settle bill.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-emerald-600" /> Active Bills
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Open customer orders waiting for payment settlement.
          </p>
        </div>
        <button
          type="button"
          onClick={loadActiveBills}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {settledMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
          {settledMsg}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer / Table</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  Loading active bills...
                </td>
              </tr>
            ) : bills.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No active bills found.
                </td>
              </tr>
            ) : (
              bills.map((b) => {
                const totalVal = Number(b.totalAmount ?? b.total_amount ?? b.total ?? 0);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">
                      {b.orderNumber || b.order_number || `#${b.id}`}
                    </td>
                    <td className="p-4">
                      {b.customerName || b.customer_name || 'Guest'} •{' '}
                      {b.tableNumber || b.table_number
                        ? `Table ${b.tableNumber || b.table_number}`
                        : b.orderType || b.order_type}
                    </td>
                    <td className="p-4 capitalize font-semibold">{b.status}</td>
                    <td className="p-4 font-extrabold text-emerald-600">${totalVal.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleSettle(b)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Settle Cash
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ActiveBills;