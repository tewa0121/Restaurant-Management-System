import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ArrowLeft, DollarSign, CreditCard, ShoppingBag } from 'lucide-react';

export default function SalesSummary() {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 text-gray-900 font-sans">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/cashier/dashboard')}
          className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 flex items-center gap-2">
            <TrendingUp className="text-emerald-600" size={24} />
            Shift Sales Summary
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">Counter performance and daily shift sales totals.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Gross Sales</span>
          <h3 className="text-xl font-black text-gray-900 mt-1">$4,325.50</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Total Invoices</span>
          <h3 className="text-xl font-black text-gray-900 mt-1">152 Bills</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-2xs">
          <span className="text-[10px] font-bold text-gray-400 uppercase">Average Ticket</span>
          <h3 className="text-xl font-black text-emerald-600 mt-1">$28.46</h3>
        </div>
      </div>
    </div>
  );
}