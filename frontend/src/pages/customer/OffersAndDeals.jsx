import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, Copy, Check, CalendarClock, ShoppingBag } from 'lucide-react';
import discountService from '../../services/discountService';
import { useCart } from '../../context/CartContext';

const describeValue = (offer, formatMoney) =>
  String(offer.discountType || offer.discount_type) === 'percentage'
    ? `${Number(offer.value)}% off`
    : `${formatMoney(offer.value)} off`;

export default function OffersAndDeals() {
  const navigate = useNavigate();
  const { formatMoney } = useCart();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await discountService.getActiveDiscounts();
        if (active) setOffers(list);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load offers.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode((prev) => (prev === code ? '' : prev)), 1500);
    } catch {
      // clipboard blocked: the code is still shown on the card
    }
  };

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto font-sans">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Offers & Deals</h1>
        <p className="text-xs text-gray-400">Discount codes you can use on your next order</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-xs text-gray-400">
          Loading offers...
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-xs text-gray-500 font-semibold">
          There are no active offers right now. Please check back soon.
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-green-50 p-4 rounded-2xl border border-green-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-green-700" />
                  <h3 className="font-bold text-sm text-gray-900">{describeValue(offer, formatMoney)}</h3>
                  {offer.firstOrderOnly && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border text-green-700">
                      First order only
                    </span>
                  )}
                </div>
                {offer.description && <p className="text-xs text-gray-600">{offer.description}</p>}
                <div className="text-[11px] text-gray-500 flex flex-wrap items-center gap-x-3 gap-y-1">
                  {Number(offer.minOrderAmount) > 0 && (
                    <span>Minimum order {formatMoney(offer.minOrderAmount)}</span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="w-3 h-3" />
                    Valid until {offer.endDate}
                  </span>
                  {offer.remaining !== null && offer.remaining !== undefined && (
                    <span>{offer.remaining} left</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => copyCode(offer.code)}
                  title="Copy code"
                  className="inline-flex items-center gap-1.5 bg-white border font-mono font-bold text-xs px-3 py-1.5 rounded-lg text-green-700 cursor-pointer hover:bg-green-100"
                >
                  {offer.code}
                  {copiedCode === offer.code ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/customer/menu')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer transition"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11px] text-gray-400">
        Enter the code in the promo code box at checkout. The final discount is confirmed by the server.
      </p>
    </div>
  );
}
