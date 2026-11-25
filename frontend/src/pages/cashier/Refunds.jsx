import React, { useEffect, useState } from 'react';
import { RotateCcw, Plus, X } from 'lucide-react';
import refundService from '../../services/refundService';
import paymentService from '../../services/paymentService';

export function Refunds() {
  const [refunds, setRefunds] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ paymentId: '', amount: '', reason: '' });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [refList, payRes] = await Promise.all([
        refundService.getRefunds({ limit: 100 }),
        paymentService.getPayments({ limit: 100 }),
      ]);
      setRefunds(refList);
      setPayments(payRes.rows || []);
      if ((payRes.rows || []).length > 0 && !formData.paymentId) {
        setFormData((prev) => ({ ...prev, paymentId: String(payRes.rows[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load refunds.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.paymentId || !formData.reason.trim()) return;
    setSaving(true);
    setError('');
    try {
      await refundService.requestRefund({
        paymentId: Number(formData.paymentId),
        amount: formData.amount !== '' ? Number(formData.amount) : undefined,
        reason: formData.reason.trim(),
      });
      setIsModalOpen(false);
      setFormData({ paymentId: payments[0] ? String(payments[0].id) : '', amount: '', reason: '' });
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to request refund.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <RotateCcw className="w-6 h-6 text-rose-500" /> Refunds & Returns Log
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Submit and monitor customer refund requests.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request Refund</span>
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
              <th className="p-4">Refund #</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  Loading refunds...
                </td>
              </tr>
            ) : refunds.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-400">
                  No refunds recorded.
                </td>
              </tr>
            ) : (
              refunds.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">
                    {r.refundNumber || r.refund_number || `#REF-${r.id}`}
                  </td>
                  <td className="p-4">#{r.paymentId || r.payment_id}</td>
                  <td className="p-4">{r.reason || '-'}</td>
                  <td className="p-4 font-extrabold text-rose-600">
                    ${Number(r.amount || 0).toFixed(2)}
                  </td>
                  <td className="p-4 capitalize font-bold">{r.status || 'pending'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold uppercase">New Refund Request</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">PAYMENT</label>
                <select
                  required
                  value={formData.paymentId}
                  onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                >
                  {payments.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.paymentNumber || p.payment_number || `Payment #${p.id}`} (${Number(p.amount || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">AMOUNT (OPTIONAL FOR FULL REFUND)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">REASON</label>
                <input
                  type="text"
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-rose-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Refunds;