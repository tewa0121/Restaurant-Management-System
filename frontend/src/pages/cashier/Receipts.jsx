import React, { useEffect, useState } from 'react';
import { Receipt, Printer, RefreshCw } from 'lucide-react';
import invoiceService from '../../services/invoiceService';

export function Receipts() {
  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReceipts = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await invoiceService.getInvoices({ limit: 100 });
      setInvoices(list);
      if (list.length > 0 && !selected) setSelected(list[0]);
    } catch (err) {
      setError(err.message || 'Failed to load receipts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReceipts();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-amber-500" /> Receipt Printer & Logs
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Inspect and print invoices/receipts from the backend.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadReceipts}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 text-slate-800 rounded-xl text-xs font-bold cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
          Loading receipts...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
          <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm divide-y divide-slate-100">
            {invoices.length === 0 ? (
              <p className="p-6 text-slate-400">No invoices available.</p>
            ) : (
              invoices.map((inv) => (
                <button
                  key={inv.id}
                  type="button"
                  onClick={() => setSelected(inv)}
                  className={`w-full p-4 text-left flex items-center justify-between cursor-pointer ${
                    selected?.id === inv.id ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <p className="font-bold text-slate-900">
                      {inv.invoiceNumber || inv.invoice_number || `Invoice #${inv.id}`}
                    </p>
                    <p className="text-[11px] text-slate-400 capitalize">
                      Status: {inv.status || 'issued'}
                    </p>
                  </div>
                  <span className="font-extrabold text-slate-900">
                    ${Number(inv.totalAmount ?? inv.total_amount ?? inv.amount ?? 0).toFixed(2)}
                  </span>
                </button>
              ))
            )}
          </div>

          <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h2 className="font-black text-sm text-slate-900 border-b pb-2">Receipt Preview</h2>
            {selected ? (
              <div className="space-y-2">
                <p>
                  <span className="font-bold">Invoice:</span>{' '}
                  {selected.invoiceNumber || selected.invoice_number || `#${selected.id}`}
                </p>
                <p>
                  <span className="font-bold">Order:</span>{' '}
                  {selected.orderNumber || selected.order_number || `#${selected.orderId || '-'}`}
                </p>
                <p>
                  <span className="font-bold">Status:</span>{' '}
                  <span className="capitalize">{selected.status || 'issued'}</span>
                </p>
                <p className="text-base font-black text-emerald-600 pt-2">
                  Total: $
                  {Number(selected.totalAmount ?? selected.total_amount ?? selected.amount ?? 0).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-slate-400">Select an invoice to preview.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Receipts;