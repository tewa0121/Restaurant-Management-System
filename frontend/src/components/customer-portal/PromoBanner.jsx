import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Shows a promotion only when real content is passed in (for example an
// active discount from GET /discounts/active). Without a title it renders nothing.
export default function PromoBanner({ title, subtitle, buttonText = 'Order now', to = '/customer/menu' }) {
  const navigate = useNavigate();
  if (!title) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
      <div className="relative z-10 max-w-lg space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-amber-300" /> Special Offer
        </span>
        <h2 className="text-xl sm:text-2xl font-black leading-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-emerald-100 font-medium">{subtitle}</p>}
        <button
          type="button"
          onClick={() => navigate(to)}
          className="mt-2 px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer transition"
        >
          {buttonText} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute right-20 -top-10 w-32 h-32 bg-emerald-400/20 rounded-full blur-xl" />
    </div>
  );
}
