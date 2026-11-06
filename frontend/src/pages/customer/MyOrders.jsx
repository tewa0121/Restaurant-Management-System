import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, RefreshCw, ChevronDown, ChevronUp, ShoppingBag } from 'lucide-react';

import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import { http } from '../../services/http';
// import CustomerAuthCard from '../../components/auth/CustomerAuthCard';

const FALLBACK_IMAGE = '/assets/food-placeholders/food-healthy-bowl.png';

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  preparing: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  ready: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  served: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  completed: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  cancelled: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};

const formatDate = (value) => {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState([]);
  const [details, setDetails] = useState({}); // orderId -> full order (with dishes)
  const [openId, setOpenId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await http('/orders?limit=50');
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err.message || 'Could not load your orders.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadOrders();
  }, [authLoading, user, loadOrders]);

  const getDetail = async (id) => {
    if (details[id]) return details[id];
    const res = await http(`/orders/${id}`);
    setDetails((prev) => ({ ...prev, [id]: res.data }));
    return res.data;
  };

  const toggleOpen = async (id) => {
    if (openId === id) {
      setOpenId(null);
      return;
    }
    setOpenId(id);
    try {
      await getDetail(id);
    } catch (err) {
      setError(err.message || 'Could not load this order.');
    }
  };

  const reorderAll = async (id) => {
    try {
      const order = await getDetail(id);
      order.items.forEach((i) => {
        for (let n = 0; n < i.qty; n += 1) {
          addToCart({ id: i.menuItemId, name: i.name, price: i.price, image: i.image || FALLBACK_IMAGE });
        }
      });
    } catch (err) {
      setError(err.message || 'Could not reorder.');
    }
  };

  const title = (
    <div className="flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900 dark:text-white">Order History</h1>
      {user && (
        <button
          type="button"
          onClick={loadOrders}
          className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
        >
          <RefreshCw size={12} /> Refresh
        </button>
      )}
    </div>
  );

  if (!authLoading && !user) {
    return (
      <div className="space-y-5 pb-8">
        {title}
        <CustomerAuthCard heading="Log in to see your orders" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">
      {title}

      {error && (
        <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg font-bold border border-rose-200 dark:border-rose-900">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading your orders…</p>
      ) : orders.length === 0 && !error ? (
        <div className="bg-white dark:bg-[#0B1426] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 text-center space-y-3">
          <ShoppingBag size={28} className="mx-auto text-gray-400" />
          <p className="text-sm text-gray-600 dark:text-gray-300">You have no orders yet.</p>
          <button
            type="button"
            onClick={() => navigate('/customer/menu')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const detail = details[order.id];
            const isOpen = openId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white dark:bg-[#0B1426] rounded-2xl p-4 border border-gray-200 dark:border-gray-800 space-y-3"
              >
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 gap-2">
                  <div className="min-w-0">
                    <span className="font-bold text-xs text-gray-900 dark:text-white block truncate">
                      {order.orderNumber}
                    </span>
                    <span className="text-[10px] text-gray-500 dark:text-gray-400">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        STATUS_STYLES[order.status] || STATUS_STYLES.completed
                      }`}
                    >
                      {order.statusLabel}
                    </span>
                    <span className="text-xs font-extrabold text-green-600">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-500 dark:text-gray-400">
                  {order.itemCount} item{order.itemCount === 1 ? '' : 's'} ·{' '}
                  {order.type === 'delivery' ? 'Delivery' : 'Pickup'}
                </div>

                {isOpen && (
                  <div className="space-y-2">
                    {!detail ? (
                      <p className="text-[11px] text-gray-400">Loading…</p>
                    ) : (
                      detail.items.map((i) => (
                        <div key={i.id} className="flex items-center gap-2">
                          <img
                            src={i.image || FALLBACK_IMAGE}
                            alt={i.name}
                            className="w-9 h-9 rounded-lg object-cover bg-gray-50 dark:bg-gray-800"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{i.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {i.qty} × ${i.price.toFixed(2)}
                            </p>
                          </div>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            ${i.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => reorderAll(order.id)}
                    className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold cursor-pointer"
                  >
                    <RotateCcw size={12} /> Reorder All
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleOpen(order.id)}
                    className="text-xs font-bold text-gray-600 dark:text-gray-300 px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center gap-1 cursor-pointer"
                  >
                    {isOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {isOpen ? 'Hide items' : 'View items'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}