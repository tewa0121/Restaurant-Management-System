import React, { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import paymentService from '../../services/paymentService';
import invoiceService from '../../services/invoiceService';
import orderService from '../../services/orderService';

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    invoiceId: '',
    orderId: '',
    method: 'cash',
    amount: '',
    tendered: '',
    transactionId: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [payRes, invList, ordList] = await Promise.all([
        paymentService.getPayments({ limit: 50 }),
        invoiceService.getInvoices({ limit: 50 }).catch(() => []),
        orderService.getOrders({ limit: 50 }).catch(() => []),
      ]);
      setPayments(payRes.rows || []);
      setInvoices(invList);
      setOrders(ordList);

      const unpaidInv = invList.find((i) => Number(i.balance ?? i.total ?? 0) > 0 && i.status !== 'paid');
      if (unpaidInv) {
        const bal = Number(unpaidInv.balance ?? unpaidInv.total ?? 0);
        setFormData((prev) => ({
          ...prev,
          invoiceId: String(unpaidInv.id),
          orderId: String(unpaidInv.orderId ?? unpaidInv.order_id ?? ''),
          amount: bal > 0 ? bal.toFixed(2) : '',
        }));
      } else if (ordList.length > 0 && !formData.orderId) {
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
    const unpaidInv = invoices.find((i) => Number(i.balance ?? i.total ?? 0) > 0 && i.status !== 'paid');
    if (unpaidInv) {
      const bal = Number(unpaidInv.balance ?? unpaidInv.total ?? 0);
      setFormData({
        invoiceId: String(unpaidInv.id),
        orderId: String(unpaidInv.orderId ?? unpaidInv.order_id ?? ''),
        method: 'cash',
        amount: bal > 0 ? bal.toFixed(2) : '',
        tendered: '',
        transactionId: '',
      });
    } else {
      const first = orders[0];
      const amt = first ? Number(first.totalAmount ?? first.total_amount ?? first.total ?? 0) : 0;
      setFormData({
        invoiceId: '',
        orderId: first ? String(first.id) : '',
        method: 'cash',
        amount: amt > 0 ? amt.toFixed(2) : '',
        tendered: '',
        transactionId: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleInvoiceSelect = (invId) => {
    const found = invoices.find((i) => String(i.id) === String(invId));
    const bal = found ? Number(found.balance ?? found.total ?? 0) : 0;
    setFormData((prev) => ({
      ...prev,
      invoiceId: invId,
      orderId: found ? String(found.orderId ?? found.order_id ?? '') : prev.orderId,
      amount: bal > 0 ? bal.toFixed(2) : prev.amount,
    }));
  };

  const handleOrderSelect = async (ordId) => {
    const found = orders.find((o) => String(o.id) === String(ordId));
    const amt = found ? Number(found.totalAmount ?? found.total_amount ?? found.total ?? 0) : 0;
    setFormData((prev) => ({
      ...prev,
      orderId: ordId,
      invoiceId: '',
      amount: amt > 0 ? amt.toFixed(2) : prev.amount,
    }));
    if (!ordId) return;
    try {
      const inv = await invoiceService.getInvoiceByOrder(ordId);
      if (inv?.id) {
        const bal = Number(inv.balance ?? inv.total ?? amt);
        setFormData((prev) => ({
          ...prev,
          invoiceId: String(inv.id),
          amount: bal > 0 ? bal.toFixed(2) : prev.amount,
        }));
      }
    } catch (err) {
      if (err?.status !== 404) {
        setError(err.message || 'Failed to check order invoice.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.invoiceId && !formData.orderId) return;
    setSaving(true);
    setError('');
    try {
      await paymentService.processPayment({
        ...(formData.invoiceId ? { invoiceId: Number(formData.invoiceId) } : {}),
        ...(formData.orderId ? { orderId: Number(formData.orderId) } : {}),
        method: formData.method,
        ...(formData.amount !== '' ? { amount: Number(formData.amount) } : {}),
        ...(formData.tendered !== '' ? { tendered: Number(formData.tendered) } : {}),
        ...(formData.transactionId.trim() ? { transactionId: formData.transactionId.trim() } : {}),
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
                <th className="p-4">Invoice / Order</th>
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
                      {p.invoiceNumber || p.invoice_number || p.orderNumber || p.order_number || '-'}
                    </td>
                    <td className="p-4 capitalize">
                      {p.methodLabel || p.method || p.paymentMethod || p.payment_method || 'cash'}
                    </td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      ${Number(p.amount || 0).toFixed(2)}
                    </td>
                    <td className="p-4 capitalize font-bold">
                      {p.status || p.payment_status || 'completed'}
                    </td>
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
              {invoices.length > 0 && (
                <div>
                  <label className="font-bold block mb-1">INVOICE</label>
                  <select
                    value={formData.invoiceId}
                    onChange={(e) => handleInvoiceSelect(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border rounded-xl outline-none"
                  >
                    <option value="">Generate from Order below</option>
                    {invoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoiceNumber || inv.invoice_number || `#INV-${inv.id}`} ({inv.orderNumber || inv.order_number || ''}) — Bal: $
                        {Number(inv.balance ?? inv.total ?? 0).toFixed(2)} [{inv.status}]
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="font-bold block mb-1">ORDER (IF GENERATING INVOICE)</label>
                <select
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
                    <option value="mobile_banking">Mobile Banking</option>
                    <option value="telebirr">Telebirr</option>
                    <option value="cbe_birr">CBE Birr</option>
                    <option value="paypal">PayPal</option>
                    <option value="apple_pay">Apple Pay</option>
                    <option value="other">Other</option>
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
                <label className="font-bold block mb-1">
                  TRANSACTION REFERENCE{' '}
                  {['mobile_banking', 'telebirr', 'cbe_birr'].includes(formData.method)
                    ? '(REQUIRED)'
                    : '(OPTIONAL)'}
                </label>
                <input
                  type="text"
                  required={['mobile_banking', 'telebirr', 'cbe_birr'].includes(formData.method)}
                  value={formData.transactionId}
                  onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
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