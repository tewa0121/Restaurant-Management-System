import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import paymentService from '../../services/paymentService';
import orderService from '../../services/orderService';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    method: 'cash',
    amount: '',
    referenceNumber: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [payRes, ordList] = await Promise.all([
        paymentService.getPayments({ limit: 100 }),
        orderService.getOrders({ limit: 100 }),
      ]);
      setPayments(payRes.rows || []);
      setOrders(ordList);
      if (ordList.length > 0 && !formData.orderId) {
        const first = ordList[0];
        const amt = Number(first.totalAmount ?? first.total_amount ?? first.total ?? 0);
        setFormData((prev) => ({
          ...prev,
          orderId: String(first.id),
          amount: amt > 0 ? amt.toFixed(2) : '',
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    const first = orders[0];
    const amt = first ? Number(first.totalAmount ?? first.total_amount ?? first.total ?? 0) : 0;
    setFormData({
      orderId: first ? String(first.id) : '',
      method: 'cash',
      amount: amt > 0 ? amt.toFixed(2) : '',
      referenceNumber: '',
    });
    setIsModalOpen(true);
  };

  const handleOrderSelect = (ordId) => {
    const found = orders.find((o) => String(o.id) === String(ordId));
    const amt = found ? Number(found.totalAmount ?? found.total_amount ?? found.total ?? 0) : 0;
    setFormData((prev) => ({
      ...prev,
      orderId: ordId,
      amount: amt > 0 ? amt.toFixed(2) : prev.amount,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.orderId || formData.amount === '') return;
    setSaving(true);
    setError('');
    try {
      await paymentService.processPayment({
        orderId: Number(formData.orderId),
        method: formData.method,
        amount: Number(formData.amount),
        referenceNumber: formData.referenceNumber.trim() || undefined,
      });
      setIsModalOpen(false);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to record payment.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Payment Management
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track order settlements, payment methods, and transaction history.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Record Payment</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Payment #</th>
                <th className="p-4">Order</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    Loading payments...
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">
                    No payments recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p, idx) => (
                  <tr key={p.id || idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">
                      {p.paymentNumber || p.payment_number || `#PAY-${p.id || idx + 1}`}
                    </td>
                    <td className="p-4">
                      {p.orderNumber || p.order_number || (p.orderId ? `Order #${p.orderId}` : '-')}
                    </td>
                    <td className="p-4 capitalize">{p.method || p.paymentMethod || 'cash'}</td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      ${Number(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4 capitalize font-bold">{p.status || 'completed'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">Record Payment</h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">ORDER</label>
                <select
                  required
                  value={formData.orderId}
                  onChange={(e) => handleOrderSelect(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                >
                  <option value="">Select Order</option>
                  {orders.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.orderNumber || o.order_number || `#${o.id}`} — $
                      {Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">METHOD</label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">AMOUNT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">REFERENCE NUMBER (OPTIONAL)</label>
                <input
                  type="text"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}