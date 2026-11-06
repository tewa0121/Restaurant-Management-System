// src/pages/customer/OffersAndDeals.jsx
import React from "react";
import { Tag } from "lucide-react";
import VipCard from "../../components/vip/VipCard";

// TEMPORARY: these two codes are written here by hand. When the discount endpoint exists,
// this list will come from the backend, so the text can never disagree with the real rules.
// The server always checks dates, usage limits and eligibility, whatever this page says.
const GENERAL_OFFERS = [
  { code: "RESTA10", title: "10% off your order", note: "Enter the code at checkout." },
  { code: "WELCOME10", title: "10% off your first order", note: "New customers only." },
];

export default function OffersAndDeals() {
  return (
    <div className="space-y-6 pb-8 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Offers & Deals</h1>
        <p className="text-xs text-gray-400">Exclusive discount codes for your orders</p>
      </div>

      {/* VIP: real status from the server */}
      <VipCard />

      <div className="space-y-3">
        <h2 className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
          Everyday codes
        </h2>
        {GENERAL_OFFERS.map((offer) => (
          <div
            key={offer.code}
            className="bg-green-50 p-4 rounded-2xl border border-green-200 flex justify-between items-center gap-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Tag size={16} className="text-green-600 shrink-0" />
              <div className="min-w-0">
                <h3 className="font-bold text-xs text-gray-900">{offer.title}</h3>
                <p className="text-[10px] text-gray-500">{offer.note}</p>
              </div>
            </div>
            <span className="bg-white border font-mono font-bold text-xs px-3 py-1 rounded-lg text-green-700 shrink-0">
              {offer.code}
            </span>
          </div>
        ))}
        <p className="text-[10px] text-gray-400">
          Only one code can be used per order.
        </p>
      </div>
    </div>
  );
}