import React, { useEffect, useState } from 'react';
import { Receipt, RefreshCw, CheckCircle2 } from 'lucide-react';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';

export default function ActiveBillsTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [error, setError] = useState('');

  const loadBills = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await orderService.getOrders({ limit: 100 });
      const active = list.filter((o) => {
        const st = String(o.status || '').toLowerCase();
        return st !== 'completed' && st !== 'cancelled' && st !== 'paid';
      });
      setOrders(active);
    } catch (err) {
      setError(err.message || 'Failed to load active bills.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBills();
  }, []);

  const handleSettle = async (order) => {
    setPayingId(order.id);
    setError('');
    try {
      const amount = Number(order.totalAmount ?? order.total_amount ?? order.total ?? 0);
      await paymentService.processPayment({
        orderId: order.id,
        amount,
        paymentMethod: 'cash',
      });
      await orderService.updateOrderStatus(order.id, 'completed');
      await loadBills();
    } catch (err) {
      setError(err.message || 'Failed to settle bill.');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-4 font-sans text-xs">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Receipt className="w-5 h-5 text-emerald-600" /> Active Bills
        </h3>
        <button
          type="button"
          onClick={loadBills}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-xl font-bold cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-3.5">Order #</th>
              <th className="p-3.5">Table / Type</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5">Amount</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-400">Loading active bills...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="5" className="p-6 text-center text-gray-400">No active bills.</td></tr>
            ) : (
              orders.map((o) => {
                const amt = Number(o.totalAmount ?? o.total_amount ?? o.total ?? 0);
                return (
                  <tr key={o.id} className="hover:bg-gray-50/70">
                    <td className="p-3.5 font-bold text-gray-900">{o.orderNumber || o.order_number || `#${o.id}`}</td>
                    <td className="p-3.5 text-gray-600">
                      {o.tableNumber || o.table_number ? `Table ${o.tableNumber || o.table_number}` : o.orderType || o.order_type || 'Order'}
                    </td>
                    <td className="p-3.5 capitalize font-semibold text-amber-600">{o.status || 'pending'}</td>
                    <td className="p-3.5 font-extrabold text-gray-900">${amt.toFixed(2)}</td>
                    <td className="p-3.5 text-right">
                      <button
                        type="button"
                        disabled={payingId === o.id}
                        onClick={() => handleSettle(o)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 text-white rounded-lg font-bold cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{payingId === o.id ? 'Paying...' : 'Pay Cash'}</span>
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