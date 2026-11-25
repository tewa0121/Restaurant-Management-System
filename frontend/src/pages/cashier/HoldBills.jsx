import React, { useEffect, useState } from 'react';
import { Clock, Play, RefreshCw } from 'lucide-react';
import invoiceService from '../../services/invoiceService';

export function HoldBills() {
  const [heldBills, setHeldBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHeld = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await invoiceService.getInvoices({ status: 'held', limit: 100 });
      setHeldBills(list);
    } catch (err) {
      setError(err.message || 'Failed to load held bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHeld();
  }, []);

  const resumeBill = async (id) => {
    setError('');
    try {
      await invoiceService.resumeInvoice(id);
      setHeldBills((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to resume bill.');
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-500" /> Held / Paused Bills
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Resume invoices that were temporarily placed on hold.
          </p>
        </div>
        <button
          type="button"
          onClick={loadHeld}
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

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Invoice #</th>
              <th className="p-4">Order</th>
              <th className="p-4">Amount</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  Loading held bills...
                </td>
              </tr>
            ) : heldBills.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  No held bills right now.
                </td>
              </tr>
            ) : (
              heldBills.map((b) => {
                const amt = Number(b.totalAmount ?? b.total_amount ?? b.amount ?? 0);
                return (
                  <tr key={b.id} className="hover:bg-slate-50/70">
                    <td className="p-4 font-bold text-slate-900">
                      {b.invoiceNumber || b.invoice_number || `#INV-${b.id}`}
                    </td>
                    <td className="p-4">{b.orderNumber || b.order_number || `Order #${b.orderId || '-'}`}</td>
                    <td className="p-4 font-extrabold text-amber-600">${amt.toFixed(2)}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => resumeBill(b.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Resume</span>
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

export default HoldBills;