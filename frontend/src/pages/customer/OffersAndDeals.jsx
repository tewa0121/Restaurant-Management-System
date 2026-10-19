import React from 'react';
import { Tag, Check } from 'lucide-react';

export default function OffersAndDeals() {
  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Offers & Deals</h1>
        <p className="text-xs text-gray-400">Exclusive discount codes for your orders</p>
      </div>

      <div className="space-y-3">
        <div className="bg-green-50 p-4 rounded-2xl border border-green-200 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-xs text-gray-900">10% Off First Order</h3>
            <p className="text-[10px] text-gray-500">Use promo code RESTA10 at checkout</p>
          </div>
          <span className="bg-white border font-mono font-bold text-xs px-3 py-1 rounded-lg text-green-700">RESTA10</span>
        </div>
      </div>
    </div>
  );
}