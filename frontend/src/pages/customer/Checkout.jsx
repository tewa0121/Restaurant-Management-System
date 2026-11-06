import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { http } from '../../services/http';
// import CustomerAuthCard from '../../components/auth/CustomerAuthCard';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, subtotal, totalAmount, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  const [orderType, setOrderType] = useState('takeaway'); // takeaway = pickup | delivery
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const inputCls =
    'w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500';

  const handlePlaceOrder = async () => {
    if (orderType === 'delivery' && !address.trim()) {
      setError('Please enter a delivery address.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const body = {
        orderType,
        items: cart.map((i) => ({ id: i.id, qty: i.qty })),
        paymentMethod,
      };
      if (orderType === 'delivery') {
        body.delivery = { address: address.trim(), phone: (phone || user?.phone || '').trim(), name: user?.name };
      }
      await http('/orders', { method: 'POST', body }); // saved in the database
      clearCart();
      navigate('/customer/orders');
    } catch (err) {
      setError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  if (!authLoading && !user) {
    return (
      <div className="max-w-[900px] mx-auto space-y-4 pb-10 px-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Checkout</h1>
        <CustomerAuthCard heading="Log in to place your order" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-10 px-4">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/customer/cart')}
          className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft size={18} className="text-gray-700 dark:text-gray-200" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
          <p className="text-gray-500 text-sm">Complete your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0B1426] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin size={18} className="text-green-600" /> Order Type
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[['takeaway', 'Pickup'], ['delivery', 'Delivery']].map(([value, text]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => { setOrderType(value); setError(''); }}
                  className={`p-3 rounded-xl border-2 text-sm font-bold cursor-pointer ${
                    orderType === value
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {text}
                </button>
              ))}
            </div>
            {orderType === 'delivery' && (
              <div className="space-y-3 mt-4">
                <textarea
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setError(''); }}
                  placeholder="Full Address (Street, Building, City)"
                  rows="2"
                  className={`${inputCls} resize-none`}
                />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={user?.phone ? `Phone (default: ${user.phone})` : 'Phone Number'}
                  className={inputCls}
                />
              </div>
            )}
          </div>

          <div className="bg-white dark:bg-[#0B1426] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Payment Method</h3>
            <div className="grid grid-cols-2 gap-4">
              {[['card', 'Card', CreditCard], ['cash', 'Cash', Banknote]].map(([value, text, Icon]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setPaymentMethod(value)}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    paymentMethod === value
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={22} className={paymentMethod === value ? 'text-green-600' : 'text-gray-400'} />
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#0B1426] p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm sticky top-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-800 pb-4">
              Your Order
            </h3>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cart.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">{item.qty}x {item.name}</span>
                  <span className="font-medium text-gray-900 dark:text-white">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 text-sm mb-4 border-t border-gray-100 dark:border-gray-800 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Estimated total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-[10px] text-gray-400">The final price is calculated by the restaurant when you place the order.</p>
            </div>

            {error && (
              <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg font-bold border border-rose-200 dark:border-rose-900 mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={cart.length === 0 || busy}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {busy ? 'Placing order…' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}