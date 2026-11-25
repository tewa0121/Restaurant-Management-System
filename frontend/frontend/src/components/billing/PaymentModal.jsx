import React, { useState } from 'react';
import { CreditCard, DollarSign, Smartphone, X, CheckCircle } from 'lucide-react';
import { paymentService } from '../../services/paymentService';

export default function PaymentModal({ totalAmount = 45.50, onComplete, onClose }) {
  const [method, setMethod] = useState('cash');
  const [amountPaid, setAmountPaid] = useState(totalAmount);
  const [loading, setLoading] = useState(false);

  const handlePay = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await paymentService.processPayment({
        method,
        totalAmount,
        amountPaid: Number(amountPaid),
        change: Math.max(0, amountPaid - totalAmount)
      });
      if (onComplete) onComplete();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl">
        
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            💳 Process Payment
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Total Due</p>
          <h2 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${Number(totalAmount).toFixed(2)}</h2>
        </div>

        <form onSubmit={handlePay} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Payment Method</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'cash', label: 'Cash', icon: DollarSign },
                { id: 'card', label: 'Card', icon: CreditCard },
                { id: 'mobile', label: 'Mobile', icon: Smartphone },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMethod(m.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 font-semibold cursor-pointer transition ${
                      method === m.id
                        ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {method === 'cash' && (
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Amount Tendered ($)</label>
              <input
                type="number"
                step="0.01"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-1 focus:ring-emerald-500"
              />
              {amountPaid >= totalAmount && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                  Change to Return: ${(amountPaid - totalAmount).toFixed(2)}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              {loading ? 'Processing...' : 'Complete Payment'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}