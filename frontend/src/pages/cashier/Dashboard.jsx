import React, { useEffect, useState } from 'react';
import { Wallet, RefreshCw, CheckCircle2 } from 'lucide-react';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';

export default function CashierDashboard() {
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCashierData = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersData, paymentsRes] = await Promise.all([
        orderService.getOrders({ limit: 100 }),
        paymentService.getPayments({ limit: 50 }),
      ]);
      setOrders(ordersData);
      setPayments(paymentsRes.rows || []);
    } catch (err) {
      setError(err.message || 'Failed to load billing data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCashierData();
  }, []);

  const handleSettleOrder = async (order) => {
    const amount = Number(order.totalAmount ?? order.total_amount ?? order.total ?? 0);
    setError('');
    try {
      await paymentService.processPayment({
        orderId: order.id,
        amount,
        method: 'cash',
      });
      await loadCashierData();
    } catch (err) {
      setError(err.message || 'Failed to process payment.');
    }
  };

  const openOrders = orders.filter((o) => {
    const st = String(o.status || '').toLowerCase();
    return st !== 'completed' && st !== 'cancelled';
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
                        onClick={() => handleSettleOrder(ord)}
                        className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Pay Cash</span>
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