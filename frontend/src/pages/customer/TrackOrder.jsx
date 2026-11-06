import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { http } from '../../services/http';
// import CustomerAuthCard from '../../components/auth/CustomerAuthCard';

const STEPS = [
  { label: 'Order Received', reached: ['pending', 'preparing', 'ready', 'served', 'completed'] },
  { label: 'Preparing Food', reached: ['preparing', 'ready', 'served', 'completed'] },
  { label: 'Ready', reached: ['ready', 'served', 'completed'] },
  { label: 'Served', reached: ['served', 'completed'] },
];

const formatTime = (value) => {
  const d = value ? new Date(value) : null;
  return d && !Number.isNaN(d.getTime()) ? d.toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : '';
};

export default function CustomerTrackOrder() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      // newest order that is still being worked on, otherwise the newest order
      const active = await http('/orders?active=true&limit=1');
      let summary = Array.isArray(active.data) ? active.data[0] : null;
      if (!summary) {
        const latest = await http('/orders?limit=1');
        summary = Array.isArray(latest.data) ? latest.data[0] : null;
      }
      if (!summary) {
        setOrder(null);
      } else {
        const full = await http(`/orders/${summary.id}`);
        setOrder(full.data);
      }
      setError('');
    } catch (err) {
      setError(err.message || 'Could not load your order.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return undefined;
    if (!user) {
      setLoading(false);
      return undefined;
    }
    load();
    const timer = setInterval(load, 15000); // keep the status fresh
    return () => clearInterval(timer);
  }, [authLoading, user, load]);

  if (!authLoading && !user) {
    return (
      <div className="space-y-5 pb-8 max-w-3xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Track Order</h1>
        <CustomerAuthCard heading="Log in to track your order" />
      </div>
    );
  }

  const cancelled = order?.status === 'cancelled';

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            {order ? `Track Order ${order.orderNumber}` : 'Track Order'}
          </h1>
          <p className="text-xs text-gray-400">Live status of your latest order</p>
        </div>
        <button type="button" onClick={load} className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
          <RefreshCw size={12} /> Refresh
        </button>
      </div>

      {error && (
        <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg font-bold border border-rose-200 dark:border-rose-900">{error}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
      ) : !order ? (
        <div className="bg-white dark:bg-[#0B1426] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 text-center space-y-3">
          <p className="text-sm text-gray-600 dark:text-gray-300">You have no orders to track yet.</p>
          <button type="button" onClick={() => navigate('/customer/menu')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer">
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0B1426] rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex justify-between items-center bg-green-50 dark:bg-green-950/30 p-4 rounded-xl border border-green-100 dark:border-green-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs text-gray-900 dark:text-white">{order.statusLabel}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {order.type === 'delivery' ? 'Delivery' : 'Pickup'} · placed {formatTime(order.createdAt)}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold text-green-700 dark:text-green-400">${Number(order.total).toFixed(2)}</span>
          </div>

          {cancelled ? (
            <p className="text-sm font-bold text-rose-500">This order was cancelled.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STEPS.map((step, idx) => {
                const done = step.reached.includes(order.status);
                return (
                  <div key={step.label} className="flex flex-col items-center text-center space-y-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        done ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {done ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <h4 className="font-bold text-xs text-gray-800 dark:text-gray-200">{step.label}</h4>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
            {order.items.map((i) => (
              <div key={i.id} className="flex justify-between text-xs">
                <span className="text-gray-600 dark:text-gray-300">{i.qty}x {i.name}</span>
                <span className="font-bold text-gray-900 dark:text-white">${i.subtotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}