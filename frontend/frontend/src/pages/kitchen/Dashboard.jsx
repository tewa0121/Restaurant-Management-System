import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Clock, CheckCircle2, CheckSquare, Timer, TrendingUp, 
  AlertTriangle, Info, ArrowUpRight 
} from 'lucide-react';

export default function KitchenDashboard() {
  const navigate = useNavigate();

  // State simulating backend kitchen orders DB
  const [incomingOrders, setIncomingOrders] = useState([
    { id: '#ORD-1250', table: 'Table 5', items: '3 items', time: '10:20 AM', priority: 'High' },
    { id: '#ORD-1249', table: 'Table 7', items: '4 items', time: '10:18 AM', priority: 'High' },
    { id: '#ORD-1248', table: 'Table 12', items: '5 items', time: '10:15 AM', priority: 'Medium' },
    { id: '#ORD-1247', table: 'Table 3', items: '2 items', time: '10:10 AM', priority: 'Medium' },
    { id: '#ORD-1246', table: 'Table 15', items: '3 items', time: '10:08 AM', priority: 'Low' },
  ]);

  const [inProgressOrders, setInProgressOrders] = useState([
    { id: '#ORD-1245', table: 'Table 1', items: '3 items', started: '10:05 AM', preparing: 'Main Course', progress: 60 },
    { id: '#ORD-1244', table: 'Table 8', items: '2 items', started: '10:02 AM', preparing: 'Appetizer', progress: 45 },
    { id: '#ORD-1243', table: 'Table 10', items: '4 items', started: '9:58 AM', preparing: 'Main Course', progress: 70 },
    { id: '#ORD-1242', table: 'Table 3', items: '2 items', started: '9:55 AM', preparing: 'Drinks', progress: 90 },
    { id: '#ORD-1236', table: 'Table 14', items: '3 items', started: '9:50 AM', preparing: 'Main Course', progress: 30 },
  ]);

  const handleStartOrder = (orderId) => {
    setIncomingOrders(prev => prev.filter(o => o.id !== orderId));
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100">
      
      {/* Banner */}
      <div>
        <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          Welcome back, Chef! 👋
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Here's what's happening in the kitchen today.
        </p>
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* New Orders */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 flex items-center justify-center">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">New Orders</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">12</h3>
            <p className="text-[10px] text-rose-600 font-bold">Needs Attention</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">In Progress</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">18</h3>
            <p className="text-[10px] text-amber-600 font-bold">Being Prepared</p>
          </div>
        </div>

        {/* Ready to Serve */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Ready to Serve</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">7</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Waiting to be served</p>
          </div>
        </div>

        {/* Completed Today */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 flex items-center justify-center">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Completed Today</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">45</h3>
            <p className="text-[10px] text-slate-400">Orders</p>
          </div>
        </div>

        {/* Average Prep Time */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400 flex items-center justify-center">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Average Prep Time</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">18 <span className="text-xs font-normal text-slate-400">min</span></h3>
            <p className="text-[10px] text-slate-400">Per Order</p>
          </div>
        </div>

        {/* Kitchen Efficiency */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Kitchen Efficiency</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">92%</h3>
            <p className="text-[10px] text-emerald-600 font-bold">Excellent</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Incoming Orders & Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Incoming Orders Table */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white">Incoming Orders</h3>
            <button type="button" onClick={() => navigate('/kitchen/incoming-orders')} className="text-[10px] text-emerald-600 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px]">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Table</th>
                  <th className="py-2">Items</th>
                  <th className="py-2">Time</th>
                  <th className="py-2">Priority</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {incomingOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 font-bold text-emerald-600">{o.id}</td>
                    <td className="py-2.5">{o.table}</td>
                    <td className="py-2.5">{o.items}</td>
                    <td className="py-2.5 text-slate-400 text-[10px]">{o.time}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        o.priority === 'High' ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400' :
                        o.priority === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {o.priority}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <button 
                        type="button" 
                        onClick={() => handleStartOrder(o.id)} 
                        className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 font-bold text-[10px] hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
                      >
                        Start
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[10px] text-slate-400 pt-1">Showing 1 to {incomingOrders.length} of 12 orders</p>
        </div>

        {/* Order Status Overview Kanban Board */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">Order Status Overview</h3>
          <div className="grid grid-cols-4 gap-2 text-[10px]">
            
            {/* New Column */}
            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 font-bold flex justify-between">
                <span>New (12)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1250</span>
                <p className="text-slate-400 text-[9px]">Table 5 • 3 items</p>
                <span className="text-[8px] text-slate-400">10:20 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1249</span>
                <p className="text-slate-400 text-[9px]">Table 7 • 4 items</p>
                <span className="text-[8px] text-slate-400">10:18 AM</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center pt-1">+9 more orders</p>
            </div>

            {/* In Progress Column */}
            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 font-bold flex justify-between">
                <span>In Progress (18)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1245</span>
                <p className="text-slate-400 text-[9px]">Table 1 • 3 items</p>
                <span className="text-[8px] text-slate-400">Started 10:05 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1244</span>
                <p className="text-slate-400 text-[9px]">Table 8 • 2 items</p>
                <span className="text-[8px] text-slate-400">Started 10:02 AM</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center pt-1">+15 more orders</p>
            </div>

            {/* Ready Column */}
            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold flex justify-between">
                <span>Ready (7)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1242</span>
                <p className="text-slate-400 text-[9px]">Table 3 • 2 items</p>
                <span className="text-[8px] text-slate-400">Ready 10:12 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1241</span>
                <p className="text-slate-400 text-[9px]">Table 6 • 3 items</p>
                <span className="text-[8px] text-slate-400">Ready 10:10 AM</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center pt-1">+4 more orders</p>
            </div>

            {/* Completed Column */}
            <div className="space-y-2">
              <div className="p-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 font-bold flex justify-between">
                <span>Completed (45)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1239</span>
                <p className="text-slate-400 text-[9px]">Table 5 • 3 items</p>
                <span className="text-[8px] text-slate-400">10:00 AM</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <span className="font-bold text-slate-800 dark:text-white">#ORD-1238</span>
                <p className="text-slate-400 text-[9px]">Table 7 • 4 items</p>
                <span className="text-[8px] text-slate-400">9:58 AM</span>
              </div>
              <p className="text-[9px] text-slate-400 text-center pt-1">+42 more orders</p>
            </div>

          </div>
        </div>

      </div>

      {/* Middle Grid: In Progress Orders Progress & Kitchen Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* In Progress Orders Table with Progress Bars */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white">In Progress Orders</h3>
            <button type="button" onClick={() => navigate('/kitchen/in-progress')} className="text-[10px] text-emerald-600 font-bold hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[9px]">
                  <th className="py-2">Order ID</th>
                  <th className="py-2">Table</th>
                  <th className="py-2">Items</th>
                  <th className="py-2">Started</th>
                  <th className="py-2">Preparing</th>
                  <th className="py-2">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium text-slate-700 dark:text-slate-300">
                {inProgressOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-2.5 font-bold text-emerald-600">{o.id}</td>
                    <td className="py-2.5">{o.table}</td>
                    <td className="py-2.5">{o.items}</td>
                    <td className="py-2.5 text-slate-400 text-[10px]">{o.started}</td>
                    <td className="py-2.5">{o.preparing}</td>
                    <td className="py-2.5 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div 
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${o.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{o.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kitchen Alerts Panel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white">Kitchen Alerts</h3>
            <button type="button" onClick={() => navigate('/kitchen/stock-alerts')} className="text-[10px] text-emerald-600 font-bold hover:underline">View All</button>
          </div>
          <div className="space-y-3 text-xs">
            
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-white">Low stock: Chicken Breast</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Only 1.5 kg left</p>
              </div>
              <span className="text-[9px] text-slate-400">10 min ago</span>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-white">Low stock: Cooking Oil</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Only 1 L left</p>
              </div>
              <span className="text-[9px] text-slate-400">20 min ago</span>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-white">Order #ORD-1250 is waiting</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">for 15 minutes</p>
              </div>
              <span className="text-[9px] text-slate-400">25 min ago</span>
            </div>

          </div>
        </div>

      </div>

      {/* Today's Summary & Recent Completed Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Today's Summary */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <h3 className="font-bold text-xs text-slate-800 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">Today's Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500">Total Orders</span>
              <span className="font-black text-slate-800 dark:text-white">82</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500">Completed Orders</span>
              <span className="font-black text-slate-800 dark:text-white">45</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500">Average Preparation Time</span>
              <span className="font-black text-slate-800 dark:text-white">18 min</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500">Orders Ready to Serve</span>
              <span className="font-black text-emerald-600">7</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-500">Kitchen Efficiency</span>
              <span className="font-black text-emerald-600">92%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-500">Orders Delayed</span>
              <span className="font-black text-rose-600">2</span>
            </div>
          </div>
        </div>

        {/* Recent Completed Orders horizontally scrollable card list */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b pb-2 border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-xs text-slate-800 dark:text-white">Recent Completed Orders</h3>
            <button type="button" onClick={() => navigate('/kitchen/completed-orders')} className="text-[10px] text-emerald-600 font-bold hover:underline">View All</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {[
              { id: '#ORD-1239', table: 'Table 5', items: '3 items', time: '10:00 AM' },
              { id: '#ORD-1238', table: 'Table 7', items: '4 items', time: '9:58 AM' },
              { id: '#ORD-1237', table: 'Table 12', items: '2 items', time: '9:55 AM' },
              { id: '#ORD-1236', table: 'Table 1', items: '3 items', time: '9:50 AM' },
              { id: '#ORD-1235', table: 'Table 10', items: '4 items', time: '9:45 AM' },
              { id: '#ORD-1234', table: 'Table 3', items: '2 items', time: '9:40 AM' },
            ].map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                <p className="font-bold text-xs text-slate-800 dark:text-white">{c.id}</p>
                <p className="text-[10px] text-slate-500">{c.table}</p>
                <p className="text-[9px] text-slate-400">{c.items}</p>
                <span className="block text-[8px] text-emerald-600 font-bold pt-1">{c.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}