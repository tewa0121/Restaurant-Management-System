import React from 'react';
import { Printer, X, Download } from 'lucide-react';

export default function InvoicePreview({ invoice, onClose }) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-6 shadow-2xl">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📄 Invoice Preview ({invoice.id || '#INV-1001'})
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="space-y-4 text-xs bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="text-center space-y-1">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">RestoManagement System</h4>
            <p className="text-[10px] text-slate-400">123 Culinary Avenue, Food District</p>
          </div>

          <div className="flex justify-between border-t border-b border-slate-200 dark:border-slate-800 py-2 text-[11px]">
            <div>
              <p className="text-slate-400">Table: <strong className="text-slate-700 dark:text-slate-200">{invoice.table || 'Table 4'}</strong></p>
              <p className="text-slate-400">Customer: <strong className="text-slate-700 dark:text-slate-200">{invoice.customer || 'Guest'}</strong></p>
            </div>
            <div className="text-right">
              <p className="text-slate-400">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-slate-400">Time: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between font-bold text-slate-500 text-[10px]">
              <span>ITEM</span>
              <span>QTY</span>
              <span>PRICE</span>
            </div>
            {(invoice.items || [
              { name: 'Special Burger', qty: 2, price: 12.50 },
              { name: 'Fresh Lemonade', qty: 2, price: 4.00 }
            ]).map((item, idx) => (
              <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                <span>{item.name}</span>
                <span>{item.qty}x</span>
                <span className="font-semibold">${(item.qty * item.price).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-1 text-right">
            <p className="text-slate-400">Subtotal: <span className="text-slate-700 dark:text-slate-200 font-bold">${invoice.subtotal || '33.00'}</span></p>
            <p className="text-slate-400">Tax (10%): <span className="text-slate-700 dark:text-slate-200 font-bold">${invoice.tax || '3.30'}</span></p>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 pt-1">
              Total: ${invoice.total || '36.30'}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer w-full"
          >
            Close Receipt
          </button>
        </div>

      </div>
    </div>
  );
}