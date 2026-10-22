import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DollarSign, 
  FileText, 
  Receipt, 
  CreditCard, 
  RotateCcw, 
  Printer, 
  ArrowUpRight, 
  ArrowDownRight, 
  ChevronDown,
  PlusCircle,
  PauseCircle,
  Bell,
  Utensils
} from 'lucide-react';
import { getCashierDashboardData } from '../../services/mockAdapter';

export default function CashierDashboard() {
  const navigate = useNavigate();
  const [data] = useState(getCashierDashboardData());
  const { stats, recentBills, pendingPayments, salesByHour, notifications } = data;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 text-gray-900 font-sans antialiased bg-gray-50/30">
      
      {/* 1. TOP HEADER BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            Welcome back, Michael! 👋
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Here's what's happening at the counter today.
          </p>
        </div>
      </div>

      {/* 2. TOP KPI CARDS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Today's Revenue</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">$4,325.50</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} /> 12.3% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Bills</span>
            <div className="p-2 bg-sky-50 text-sky-600 rounded-xl">
              <FileText size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">152</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} /> 15.2% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Bill Value</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <Receipt size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">$28.46</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} /> 8.7% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Payments Received</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">$4,200.00</h3>
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight size={12} /> 13.1% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Refunds</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
              <RotateCcw size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">$125.50</h3>
            <span className="text-[10px] font-bold text-rose-600 flex items-center gap-0.5 mt-0.5">
              <ArrowDownRight size={12} /> 2.4% vs yesterday
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-2xs flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pending Payments</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Printer size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-lg font-black text-gray-900">6</h3>
            <span className="text-[10px] font-bold text-gray-400 block mt-0.5">Bills</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MIDDLE SECTION: FIXED REVENUE CHART & DONUT CHART                       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CARD 1: Today's Revenue Overview Line/Area Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex flex-col justify-between min-h-[300px]">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-sm text-gray-900">Today's Revenue Overview</h2>
            <button className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 px-3 py-1 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all cursor-pointer">
              <span>Today</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* SVG Smooth Curved Area Chart */}
          <div className="relative w-full h-52 pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="#F3F4F6" strokeDasharray="4 4" />
              <line x1="0" y1="60" x2="500" y2="60" stroke="#F3F4F6" strokeDasharray="4 4" />
              <line x1="0" y1="100" x2="500" y2="100" stroke="#F3F4F6" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="500" y2="140" stroke="#E5E7EB" />

              {/* Y-Axis Labels */}
              <text x="0" y="18" fill="#9CA3AF" fontSize="10" fontWeight="bold">5K</text>
              <text x="0" y="58" fill="#9CA3AF" fontSize="10" fontWeight="bold">3K</text>
              <text x="0" y="98" fill="#9CA3AF" fontSize="10" fontWeight="bold">1K</text>
              <text x="0" y="138" fill="#9CA3AF" fontSize="10" fontWeight="bold">0</text>

              {/* Filled Curve Area */}
              <path
                d="M 30,120 Q 90,80 150,100 T 270,50 T 380,70 T 480,20 L 480,140 L 30,140 Z"
                fill="url(#revenueGradient)"
              />

              {/* Green Curve Line */}
              <path
                d="M 30,120 Q 90,80 150,100 T 270,50 T 380,70 T 480,20"
                fill="none"
                stroke="#10B981"
                strokeWidth="3"
                strokeLinecap="round"
              />

              {/* Highlight Point Circles */}
              <circle cx="30" cy="120" r="3.5" fill="#10B981" />
              <circle cx="150" cy="100" r="3.5" fill="#10B981" />
              <circle cx="270" cy="50" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="380" cy="70" r="3.5" fill="#10B981" />
              <circle cx="480" cy="20" r="4.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="2" />
            </svg>

            {/* Hover Tooltip Overlay (12 PM $2,450) */}
            <div className="absolute top-2 left-[50%] -translate-x-1/2 bg-white border border-gray-100 text-gray-900 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-md flex flex-col items-center">
              <span className="text-[9px] text-gray-400">12 PM</span>
              <span className="text-emerald-600 font-extrabold text-xs">$2,450</span>
            </div>

            {/* X-Axis Timestamps */}
            <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-2 px-6">
              <span>12 AM</span>
              <span>4 AM</span>
              <span>8 AM</span>
              <span>12 PM</span>
              <span>4 PM</span>
              <span>8 PM</span>
              <span>12 AM</span>
            </div>
          </div>
        </div>

        {/* CARD 2: Fixed Payment Methods Donut Chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex flex-col justify-between min-h-[300px]">
          <h2 className="font-bold text-sm text-gray-900 mb-2">Payment Methods</h2>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto">
            
            {/* SVG Donut Ring Chart */}
            <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="#F3F4F6" strokeWidth="3.8" />
                
                {/* Cash Segment (45%) - Green */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3.8"
                  strokeDasharray="45 55"
                  strokeDashoffset="0"
                />
                
                {/* Card Segment (35%) - Blue */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3.8"
                  strokeDasharray="35 65"
                  strokeDashoffset="-45"
                />
                
                {/* Mobile Banking Segment (15%) - Amber */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#F59E0B"
                  strokeWidth="3.8"
                  strokeDasharray="15 85"
                  strokeDashoffset="-80"
                />

                {/* Other Segment (5%) - Purple */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.9155"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="3.8"
                  strokeDasharray="5 95"
                  strokeDashoffset="-95"
                />
              </svg>

              {/* Center Donut Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-black text-gray-900">$4,200.00</span>
                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-tight">Total Received</span>
              </div>
            </div>

            {/* Right Donut Legend Indicators */}
            <div className="space-y-2.5 w-full sm:w-auto">
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Cash
                </span>
                <span className="font-bold text-gray-900">45%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Card
                </span>
                <span className="font-bold text-gray-900">35%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mobile Banking
                </span>
                <span className="font-bold text-gray-900">15%</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-600">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Other
                </span>
                <span className="font-bold text-gray-900">5%</span>
              </div>
            </div>

          </div>
        </div>

        {/* CARD 3: Payment Summary Breakdown */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs flex flex-col justify-between min-h-[300px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-sm text-gray-900">Payment Summary</h2>
              <button onClick={() => navigate('/cashier/payment-history')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Cash
                </span>
                <span className="font-bold text-gray-900">$1,890.00 <span className="text-gray-400 font-normal ml-1">45%</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Card
                </span>
                <span className="font-bold text-gray-900">$1,470.00 <span className="text-gray-400 font-normal ml-1">35%</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Mobile Banking
                </span>
                <span className="font-bold text-gray-900">$630.00 <span className="text-gray-400 font-normal ml-1">15%</span></span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="flex items-center gap-2 font-medium text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span> Other
                </span>
                <span className="font-bold text-gray-900">$210.00 <span className="text-gray-400 font-normal ml-1">5%</span></span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 mt-4 flex justify-between items-center text-xs">
            <span className="text-gray-500 font-bold">Total Received</span>
            <span className="font-black text-emerald-600 text-sm">$4,200.00</span>
          </div>
        </div>

      </div>

      {/* 4. LOWER SECTION: RECENT BILLS, PENDING PAYMENTS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-900">Recent Bills</h2>
            <button onClick={() => navigate('/cashier/order-history')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              View All Bills
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase">
                  <th className="pb-2">Bill No.</th>
                  <th className="pb-2">Table</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {recentBills.slice(0, 5).map((bill, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-2.5 font-bold text-emerald-700">{bill.id}</td>
                    <td className="py-2.5 font-medium text-gray-700">{bill.table}</td>
                    <td className="py-2.5 font-medium text-gray-800">{bill.customer}</td>
                    <td className="py-2.5 font-black text-gray-900">${bill.amount.toFixed(2)}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                        bill.status.toLowerCase() === 'paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-sm text-gray-900">Pending Payments</h2>
            <button onClick={() => navigate('/cashier/active-bills')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">
              View All
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingPayments.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-amber-50/30 border border-amber-100 rounded-xl">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-emerald-700">{item.id}</span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">{item.table}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 block mt-0.5">{item.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs text-gray-900">${item.amount.toFixed(2)}</span>
                  <button onClick={() => navigate('/cashier/new-bill')} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer">
                    Pay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-2xs">
          <h2 className="font-bold text-sm text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-2.5">
            <button onClick={() => navigate('/cashier/new-bill')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <PlusCircle size={18} className="text-emerald-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">New Bill</span>
            </button>
            <button onClick={() => navigate('/cashier/active-bills')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <FileText size={18} className="text-sky-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">Active Bills</span>
            </button>
            <button onClick={() => navigate('/cashier/payment-history')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <DollarSign size={18} className="text-amber-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">Receive Payment</span>
            </button>
            <button onClick={() => navigate('/cashier/receipts')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <Printer size={18} className="text-purple-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">Print Receipt</span>
            </button>
            <button onClick={() => navigate('/cashier/hold-bills')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <PauseCircle size={18} className="text-teal-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">Hold Bill</span>
            </button>
            <button onClick={() => navigate('/cashier/refunds')} className="p-3 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl border border-gray-100 transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer group">
              <RotateCcw size={18} className="text-rose-600" />
              <span className="font-bold text-xs text-gray-800 group-hover:text-emerald-700">Refund</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}