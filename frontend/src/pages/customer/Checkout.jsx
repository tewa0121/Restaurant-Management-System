import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import orderService from '../../services/orderService';

const qtyOf = (item) => Number(item.qty ?? item.quantity ?? 1) || 1;

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, formatMoney, taxRate } = useCart();

  const [orderType, setOrderType] = useState('takeaway'); // takeaway | delivery
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');

  const [pricing, setPricing] = useState(null); // exact totals from the server
  const [pricingLoading, setPricingLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const items = Array.isArray(cart) ? cart : [];

  // Only real menu items (numeric ids) can be ordered.
  const invalidItems = useMemo(
    () => items.filter((i) => !Number.isInteger(Number(i.id)) || Number(i.id) < 1),
    [items]
  );
  const orderLines = useMemo(
    () =>
      items
        .filter((i) => Number.isInteger(Number(i.id)) && Number(i.id) >= 1)
        .map((i) => ({
          menuItemId: Number(i.id),
          quantity: qtyOf(i),
          ...(i.specialInstructions
            ? { specialInstructions: String(i.specialInstructions).slice(0, 500) }
            : {}),
        })),
    [items]
  );

  // Ask the server for the exact total (same pricing the order will use).
  useEffect(() => {
    if (orderLines.length === 0) {
      setPricing(null);
      return undefined;
    }
    let cancelled = false;
    setPricingLoading(true);
    orderService
      .previewOrder({
        orderType,
        items: orderLines,
        discountCode: promoCode || undefined,
      })
      .then((data) => {
        if (cancelled) return;
        setPricing(data);
        setPromoError('');
      })
      .catch((err) => {
        if (cancelled) return;
        if (promoCode) {
          // a bad promo code should not block the order: drop it and explain
          setPromoError(err.message || 'This promo code cannot be used.');
          setPromoCode('');
        } else {
          setError(err.message || 'Could not calculate the total.');
        }
      })
      .finally(() => {
        if (!cancelled) setPricingLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [orderLines, orderType, promoCode]);

  const applyPromo = () => {
    setPromoError('');
    setPromoCode(promoInput.trim().toUpperCase());
  };

  const removePromo = () => {
    setPromoInput('');
    setPromoCode('');
    setPromoError('');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (orderLines.length === 0 || invalidItems.length > 0) return;

    if (orderType === 'delivery' && (!deliveryAddress.trim() || !deliveryPhone.trim())) {
      setError('Please enter a delivery address and a contact phone number.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await orderService.createOrder({
        orderType,
        items: orderLines,
        discountCode: promoCode || undefined,
        notes: notes.trim() || undefined,
        ...(orderType === 'delivery'
          ? { deliveryAddress: deliveryAddress.trim(), deliveryPhone: deliveryPhone.trim() }
          : {}),
      });
      if (typeof clearCart === 'function') clearCart();
      navigate('/customer/orders');
    } catch (err) {
      setError(err.message || 'Failed to place order.');
    } finally {
      setSubmitting(false);
    }
  };

  const total = pricing ? pricing.total : null;

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

        {items.length === 0 && (
          <div className="p-3 bg-gray-50 border border-gray-200 text-gray-600 rounded-xl font-semibold">
            Your cart is empty.{' '}
            <button type="button" onClick={() => navigate('/customer/menu')} className="text-emerald-700 underline">
              Browse the menu
            </button>
          </div>
        )}

        {invalidItems.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl font-semibold">
            Some items in your cart are sample items and cannot be ordered: {invalidItems.map((i) => i.name).join(', ')}.
            Please remove them from your cart.
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <label className="font-bold block mb-1">ORDER TYPE</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'takeaway', label: 'Takeaway' },
                { value: 'delivery', label: 'Delivery' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setOrderType(opt.value)}
                  className={`py-2 rounded-xl border font-bold cursor-pointer ${
                    orderType === opt.value
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {orderType === 'delivery' && (
            <>
              <div>
                <label className="font-bold block mb-1">DELIVERY ADDRESS</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter delivery address..."
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">CONTACT PHONE</label>
                <input
                  type="tel"
                  value={deliveryPhone}
                  onChange={(e) => setDeliveryPhone(e.target.value)}
                  placeholder="09..."
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
            </>
          )}

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

          <div>
            <label className="font-bold block mb-1">PROMO CODE</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter code"
                className="flex-1 px-3 py-2 bg-gray-50 border rounded-xl outline-none uppercase"
              />
              {promoCode ? (
                <button type="button" onClick={removePromo} className="px-4 rounded-xl border font-bold text-gray-600 cursor-pointer">
                  Remove
                </button>
              ) : (
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={!promoInput.trim()}
                  className="px-4 rounded-xl bg-gray-900 text-white font-bold disabled:opacity-40 cursor-pointer"
                >
                  Apply
                </button>
              )}
            </div>
            {promoError && <p className="mt-1 text-rose-600 font-semibold">{promoError}</p>}
            {pricing?.discountCode && (
              <p className="mt-1 text-emerald-700 font-semibold">Code {pricing.discountCode} applied.</p>
            )}
          </div>

          <div className="border-t pt-3 space-y-1.5">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>{pricing ? formatMoney(pricing.subtotal) : '...'}</span>
            </div>
            {pricing && Number(pricing.discount) > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span>- {formatMoney(pricing.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Tax{pricing ? ` (${pricing.taxRate ?? taxRate}%)` : ''}</span>
              <span>{pricing ? formatMoney(pricing.tax) : '...'}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="flex justify-between text-gray-500">
                <span>Delivery fee</span>
                <span>{pricing ? formatMoney(pricing.deliveryFee) : '...'}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900">
              <span>Total</span>
              <span>{pricing ? formatMoney(pricing.total) : '...'}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={orderLines.length === 0 || invalidItems.length > 0 || submitting || pricingLoading || total === null}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black cursor-pointer"
          >
            {submitting ? 'Placing Order...' : total !== null ? `Place Order (${formatMoney(total)})` : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
}