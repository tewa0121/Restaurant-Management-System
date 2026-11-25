import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, subtotal, deliveryFee, tax, totalAmount } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = Array.isArray(cart) ? cart : [];
  const sub = typeof subtotal === 'number' ? subtotal : items.reduce((s, i) => s + Number(i.price || 0) * Number(i.qty || i.quantity || 1), 0);
  const fee = typeof deliveryFee === 'number' ? deliveryFee : 0;
  const taxAmt = typeof tax === 'number' ? tax : sub * 0.15;
  const total = typeof totalAmount === 'number' ? totalAmount : sub + fee + taxAmt;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError('');
    try {
      await orderService.createOrder({
        orderType: deliveryAddress.trim() ? 'delivery' : 'takeaway',
        deliveryAddress: deliveryAddress.trim() || undefined,
        notes: notes.trim() || undefined,
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: Number(i.qty || i.quantity || 1),
        })),
      });
      if (typeof clearCart === 'function') clearCart();
      navigate('/customer/my-orders');
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 font-sans">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
      </button>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 text-xs">
        <h1 className="text-xl font-extrabold text-gray-900">Checkout</h1>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="font-bold block mb-1">DELIVERY ADDRESS (OPTIONAL FOR TAKEAWAY)</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter delivery address..."
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
            />
          </div>
          <div>
            <label className="font-bold block mb-1">ORDER NOTES</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any special requests..."
              className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
            />
          </div>

          <div className="border-t pt-3 space-y-1.5">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${sub.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Tax</span><span>${taxAmt.toFixed(2)}</span></div>
            <div className="flex justify-between text-sm font-black text-gray-900"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>

          <button
            type="submit"
            disabled={items.length === 0 || submitting}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black cursor-pointer"
          >
            {submitting ? 'Placing Order...' : `Place Order ($${total.toFixed(2)})`}
          </button>
        </form>
      </div>
    </div>
  );
}