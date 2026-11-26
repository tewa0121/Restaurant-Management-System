import React, { useEffect, useState } from 'react';
import usePolling from '../../hooks/usePolling';
import { Wallet, RefreshCw, CheckCircle2 } from 'lucide-react';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import invoiceService from '../../services/invoiceService';

export default function CashierDashboard() {
  const [orders, setOrders] = useState([]);
  const [paidOrderIds, setPaidOrderIds] = useState(() => new Set());
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadCashierData = async (silent) => {
    if (silent !== true) setLoading(true);
    setError('');
    try {
      const [ordersData, paymentsRes, invoices] = await Promise.all([
        orderService.getOrders({ limit: 100 }),
        paymentService.getPayments({ limit: 50 }),
        invoiceService.getInvoices({ limit: 50 }).catch(() => []),
      ]);

      const paidIds = new Set(
        invoices
          .filter((inv) => String(inv.status || '').toLowerCase() === 'paid')
          .map((inv) => Number(inv.orderId ?? inv.order_id))
          .filter(Boolean)
      );

      setOrders(ordersData);
      setPaidOrderIds(paidIds);
      setPayments(paymentsRes.rows || []);
    } catch (err) {
      setError(err.message || 'Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  usePolling(() => loadCashierData(true), 15000);

  useEffect(() => {
    loadCashierData();
  }, []);

  const handleSettleOrder = async (order) => {
    const amount = Number(order.totalAmount ?? order.total_amount ?? order.total ?? 0);
    setPayingId(order.id);
    setError('');
    setSuccessMsg('');
    try {
      const invoice = await invoiceService.generateInvoice(order.id);
      if (String(invoice?.status || '').toLowerCase() === 'paid') {
        setSuccessMsg(`${order.orderNumber || order.order_number || `#${order.id}`} is already paid.`);
        await loadCashierData();
        return;
      }

      const balance = Number(invoice?.balance ?? amount);
      await paymentService.processPayment({
        invoiceId: invoice?.id,
        orderId: order.id,
        amount: balance > 0 ? balance : amount,
        method: 'cash',
      });
      setSuccessMsg(`Settled ${order.orderNumber || order.order_number || `#${order.id}`}.`);
      setTimeout(() => setSuccessMsg(''), 3000);
      await loadCashierData();
    } catch (err) {
      const msg =
        err?.code === 'NO_CASH_SESSION'
          ? 'Open your cash session first before accepting cash payments.'
          : err?.message || 'Failed to process payment.';
      setError(msg);
      if (err?.code === 'ALREADY_PAID') {
        await loadCashierData();
      }
    } finally {
      setPayingId(null);
    }
  };

  const openOrders = orders.filter((o) => {
    const st = String(o.status || '').toLowerCase();
    if (st === 'completed' || st === 'cancelled' || st === 'paid') return false;
    if (paidOrderIds.has(Number(o.id))) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Cashier & Billing</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Settle open orders and review recorded payments.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadCashierData}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-bold">
          {successMsg}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading cashier records...
        </div>
      ) : (
        <>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900">
              Unsettled Orders ({openOrders.length})
            </h2>
            {openOrders.length === 0 ? (
              <p className="text-xs text-gray-400">No unsettled orders.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {openOrders.map((ord) => {
                  const amount = Number(ord.totalAmount ?? ord.total_amount ?? ord.total ?? 0);
                  return (
                    <div key={ord.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                      <div>
                        <p className="font-bold text-gray-900">
                          {ord.orderNumber || ord.order_number || `#${ord.id}`} — ${amount.toFixed(2)}
                        </p>
                        <p className="text-gray-500 capitalize">
                          Status: {ord.status} • {ord.customerName || ord.customer_name || 'Guest'}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={payingId === ord.id}
                        onClick={() => handleSettleOrder(ord)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{payingId === ord.id ? 'Paying...' : 'Pay Cash'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-base font-extrabold text-gray-900">
              Recent Payments ({payments.length})
            </h2>
            <div className="divide-y divide-gray-100 text-xs">
              {payments.slice(0, 10).map((pay, idx) => (
                <div key={pay.id || idx} className="py-2.5 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    {pay.paymentNumber || pay.payment_number || `Payment #${pay.id || idx + 1}`} (
                    {pay.method || pay.paymentMethod || 'cash'})
                  </span>
                  <span className="font-extrabold text-emerald-600">
                    ${Number(pay.amount || 0).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}