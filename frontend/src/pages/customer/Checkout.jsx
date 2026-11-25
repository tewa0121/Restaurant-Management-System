import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, subtotal, deliveryFee, tax, totalAmount } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderType, setOrderType] = useState('delivery');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const itemsPayload = cart.map((item) => ({
        menuItemId: Number(item.menuItemId || item.id),
        quantity: Number(item.qty || item.quantity || 1),
        specialInstructions: item.notes || item.specialInstructions || undefined,
      }));

      const created = await orderService.createOrder({
        orderType,
        items: itemsPayload,
        customerName: customerName.trim() || undefined,
        deliveryPhone: deliveryPhone.trim() || undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress.trim() || undefined : undefined,
        paymentMethod,
      });

      clearCart();
      const createdId = created?.id || created?.order?.id;
      navigate(createdId ? `/track?orderId=${createdId}` : '/orders');
    } catch (err) {
      setError(err.message || 'Failed to place order. Please sign in or check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-10 px-4 font-sans">
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50 cursor-pointer"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm">Complete your order</p>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-emerald-600" /> Order & Delivery Details
            </h3>
            <div className="space-y-3">
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
              >
                <option value="delivery">Delivery</option>
                <option value="takeaway">Takeaway</option>
              </select>

              <input
                type="text"
                placeholder="Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              <input
                type="text"
                placeholder="Phone Number"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />

              {orderType === 'delivery' && (
                <textarea
                  placeholder="Full Address (Street, Building, City)"
                  rows="2"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Preferred Payment Method</h3>
            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <CreditCard size={16} /> Card / Digital
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                <Banknote size={16} /> Cash
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-lg text-gray-900">Order Summary</h3>
          <div className="space-y-2 text-xs text-gray-600">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>
                  {item.name} × {item.qty || item.quantity || 1}
                </span>
                <span className="font-semibold">
                  ${(Number(item.price || 0) * Number(item.qty || item.quantity || 1)).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>${Number(subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery Fee</span>
              <span>${Number(deliveryFee || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Tax</span>
              <span>${Number(tax || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>${Number(totalAmount || 0).toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || cart.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-xs transition cursor-pointer"
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
}