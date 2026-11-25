// src/pages/cashier/Dashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DollarSign,
  FileText,
  CreditCard,
  RotateCcw,
  Printer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  Bell
} from 'lucide-react';

export default function CashierDashboard() {
  const navigate = useNavigate();

  // 6 Top KPI Cards
  const topKpis = [
    { label: "Today's Revenue", value: '$4,325.50', sub: '12.3% vs yesterday', subColor: 'text-emerald-500', isUp: true, icon: DollarSign, iconBg: 'bg-emerald-100 text-emerald-600' },
    { label: 'Total Bills', value: '152', sub: '15.2% vs yesterday', subColor: 'text-emerald-500', isUp: true, icon: FileText, iconBg: 'bg-blue-100 text-blue-600' },
    { label: 'Average Bill Value', value: '$28.46', sub: '8.7% vs yesterday', subColor: 'text-emerald-500', isUp: true, icon: CreditCard, iconBg: 'bg-amber-100 text-amber-600' },
    { label: 'Payments Received', value: '$4,200.00', sub: '13.1% vs yesterday', subColor: 'text-emerald-500', isUp: true, icon: DollarSign, iconBg: 'bg-purple-100 text-purple-600' },
    { label: 'Refunds', value: '$125.50', sub: '2.4% vs yesterday', subColor: 'text-rose-500', isUp: false, icon: RotateCcw, iconBg: 'bg-rose-100 text-rose-600' },
    { label: 'Pending Payments', value: '6', sub: 'Bills', subColor: 'text-slate-500', isUp: null, icon: Clock, iconBg: 'bg-teal-100 text-teal-600' },
  ];

  // Recent Bills
  const recentBills = [
    { id: '#BILL-152', table: 'Table 5', customer: 'John Smith', amount: '$45.50', method: 'Card', status: 'Paid', time: '10:30 AM' },
    { id: '#BILL-151', table: 'Table 12', customer: 'Sarah Johnson', amount: '$78.20', method: 'Cash', status: 'Paid', time: '10:25 AM' },
    { id: '#BILL-150', table: 'Table 3', customer: 'Michael Brown', amount: '$32.00', method: 'Mobile Banking', status: 'Paid', time: '10:20 AM' },
    { id: '#BILL-149', table: 'Table 7', customer: 'Emily Davis', amount: '$67.80', method: 'Card', status: 'Paid', time: '10:15 AM' },
    { id: '#BILL-148', table: 'Table 1', customer: 'David Wilson', amount: '$29.40', method: 'Cash', status: 'Pending', time: '10:10 AM' },
  ];

  // Pending Payments
  const pendingPayments = [
    { id: '#BILL-154', table: 'Table 8', amount: '$54.30', time: '5 min ago' },
    { id: '#BILL-153', table: 'Table 10', amount: '$36.20', time: '8 min ago' },
    { id: '#BILL-152', table: 'Table 9', amount: '$41.70', time: '12 min ago' },
    { id: '#BILL-151', table: 'Table 6', amount: '$29.90', time: '15 min ago' },
    { id: '#BILL-150', table: 'Table 14', amount: '$63.50', time: '18 min ago' },
  ];

  // Notifications Feed
  const notificationsFeed = [
    { text: 'Payment received for Bill #BILL-151 (Table 12)', time: '2 min ago' },
    { text: 'New bill created for Table 8', time: '5 min ago' },
    { text: 'Payment pending for Bill #BILL-154 (Table 8)', time: '8 min ago' },
    { text: 'Refund processed for Bill #BILL-147', time: '15 min ago' },
  ];

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] text-slate-800 font-sans">
      {/* Welcome */}
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          Welcome back, Michael! 👋
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          Here's what's happening at the counter today.
        </p>
      </div>

      {/* 6 Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topKpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex justify-between items-start">
                <div className={`p-2.5 rounded-xl ${kpi.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                {kpi.isUp !== null && (
                  <span className={`flex items-center text-[10px] font-bold ${kpi.subColor}`}>
                    {kpi.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {kpi.sub.split(' ')[0]}
                  </span>
                )}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">{kpi.label}</p>
                <p className="text-xl font-black text-slate-900 mt-0.5">{kpi.value}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 1: REVENUE OVERVIEW & PAYMENT METHODS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Revenue Overview Line Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Today's Revenue Overview</h3>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">Today</span>
          </div>
          <div className="h-48 flex items-end justify-between pt-8 pb-2 px-2 relative bg-emerald-50/30 rounded-xl border border-emerald-100">
            <div className="absolute top-4 left-1/3 bg-white px-2.5 py-1 rounded-xl shadow-md border border-slate-100 text-center">
              <span className="text-[9px] text-slate-400 block font-bold">12 PM</span>
              <span className="text-xs font-black text-emerald-600">$2,450</span>
            </div>
            {[20, 35, 28, 45, 60, 40, 50, 75, 90].map((h, i) => (
              <div key={i} className="w-4 bg-emerald-500 rounded-t-sm opacity-60 hover:opacity-100 transition-all" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Payment Methods Donut */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Payment Methods</h3>
          <div className="flex items-center justify-center my-2">
            <div className="w-32 h-32 rounded-full border-8 border-blue-500 flex items-center justify-center text-center shadow-inner relative" style={{ background: 'conic-gradient(#10B981 0% 45%, #3B82F6 45% 80%, #F59E0B 80% 95%, #8B5CF6 95% 100%)' }}>
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                <span className="text-[10px] text-slate-400 font-bold">Total</span>
                <span className="text-xs font-black text-slate-900">$4,200</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-[11px] font-semibold text-slate-600">
            <div className="flex justify-between"><span><span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-1.5" /> Cash</span><span className="font-bold">45%</span></div>
            <div className="flex justify-between"><span><span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1.5" /> Card</span><span className="font-bold">35%</span></div>
            <div className="flex justify-between"><span><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-1.5" /> Mobile Banking</span><span className="font-bold">15%</span></div>
            <div className="flex justify-between"><span><span className="inline-block w-2 h-2 rounded-full bg-purple-500 mr-1.5" /> Other</span><span className="font-bold">5%</span></div>
          </div>
        </div>

        {/* Payment Summary Table */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Payment Summary</h3>
            <button onClick={() => navigate('/cashier/payment-history')} className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-700">Cash</span>
              <span className="font-black text-slate-900">$1,890.00 <span className="text-slate-400 text-[10px] font-normal ml-1">45%</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-700">Card</span>
              <span className="font-black text-slate-900">$1,470.00 <span className="text-slate-400 text-[10px] font-normal ml-1">35%</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-700">Mobile Banking</span>
              <span className="font-black text-slate-900">$630.00 <span className="text-slate-400 text-[10px] font-normal ml-1">15%</span></span>
            </div>
            <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl">
              <span className="font-semibold text-slate-700">Other</span>
              <span className="font-black text-slate-900">$210.00 <span className="text-slate-400 text-[10px] font-normal ml-1">5%</span></span>
            </div>
            <div className="pt-2 border-t border-slate-100 flex justify-between items-center font-black">
              <span>Total Received</span>
              <span className="text-emerald-600">$4,200.00</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: RECENT BILLS, PENDING PAYMENTS & QUICK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Bills */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Recent Bills</h3>
            <button onClick={() => navigate('/cashier/order-history')} className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View All Bills</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 font-semibold border-b border-slate-100 text-[10px] uppercase">
                <tr>
                  <th className="pb-2">Bill No.</th>
                  <th className="pb-2">Table</th>
                  <th className="pb-2">Customer</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {recentBills.map((b, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="py-2.5 font-bold text-blue-600">{b.id}</td>
                    <td className="py-2.5 font-bold text-slate-900">{b.table}</td>
                    <td className="py-2.5 text-slate-500">{b.customer}</td>
                    <td className="py-2.5 font-black">{b.amount}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${b.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Payments */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Pending Payments</h3>
            <button onClick={() => navigate('/cashier/active-bills')} className="text-[11px] font-bold text-blue-600 hover:underline cursor-pointer">View All</button>
          </div>
          <div className="space-y-2.5">
            {pendingPayments.map((p, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                <div>
                  <span className="font-bold text-blue-600 mr-2">{p.id}</span>
                  <span className="font-bold text-slate-900">{p.table}</span>
                  <p className="text-[10px] text-slate-400">{p.time}</p>
                </div>
                <span className="font-black text-slate-900">{p.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/cashier/new-bill')} className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <PlusCircle className="w-5 h-5 text-emerald-600" />
              <span className="text-xs font-bold text-slate-800">New Bill</span>
            </button>
            <button onClick={() => navigate('/cashier/active-bills')} className="p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <FileText className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold text-slate-800">Active Bills</span>
            </button>
            <button onClick={() => navigate('/cashier/payment-history')} className="p-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <DollarSign className="w-5 h-5 text-purple-600" />
              <span className="text-xs font-bold text-slate-800">Receive Payment</span>
            </button>
            <button onClick={() => navigate('/cashier/receipts')} className="p-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <Printer className="w-5 h-5 text-amber-600" />
              <span className="text-xs font-bold text-slate-800">Print Receipt</span>
            </button>
            <button onClick={() => navigate('/cashier/hold-bills')} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <Clock className="w-5 h-5 text-slate-600" />
              <span className="text-xs font-bold text-slate-800">Hold Bill</span>
            </button>
            <button onClick={() => navigate('/cashier/refunds')} className="p-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all">
              <RotateCcw className="w-5 h-5 text-rose-600" />
              <span className="text-xs font-bold text-slate-800">Refund</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 3: BOTTOM ANALYTICS & NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Sales by Hour */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Today's Sales by Hour</h3>
            <span className="text-[10px] font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">Today</span>
          </div>
          <div className="h-40 flex items-end justify-between px-2 pt-6 pb-2 bg-slate-50/50 rounded-xl border border-slate-100">
            {[30, 45, 60, 50, 45, 40, 70, 85, 120, 90, 60, 95, 80, 65, 45].map((h, i) => (
              <div key={i} className="w-3 bg-emerald-500 rounded-t-sm" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        {/* Top Payment Methods */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Top Payment Methods (Today)</h3>
          <div className="space-y-3 text-xs font-medium">
            <div>
              <div className="flex justify-between mb-1"><span>1. Cash</span><span className="font-bold">$1,890.00 (45%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full w-[45%]" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>2. Card</span><span className="font-bold">$1,470.00 (35%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-blue-500 h-full w-[35%]" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>3. Mobile Banking</span><span className="font-bold">$630.00 (15%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full w-[15%]" /></div>
            </div>
            <div>
              <div className="flex justify-between mb-1"><span>4. Other</span><span className="font-bold">$210.00 (5%)</span></div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-purple-500 h-full w-[5%]" /></div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            <span className="text-[11px] font-bold text-blue-600">View All</span>
          </div>
          <div className="space-y-2.5">
            {notificationsFeed.map((n, i) => (
              <div key={i} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-0.5 border border-slate-100">
                <p className="font-semibold text-slate-800 leading-snug">{n.text}</p>
                <p className="text-[9px] text-slate-400">{n.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}