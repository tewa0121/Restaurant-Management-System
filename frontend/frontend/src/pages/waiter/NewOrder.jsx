// src/pages/waiter/NewOrder.jsx
import React, { useState } from 'react';
import { Plus, Minus, Send, CheckCircle2, ShoppingBag } from 'lucide-react';

export default function WaiterNewOrder() {
  const [selectedTable, setSelectedTable] = useState('Table 5');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([
    { id: 1, name: 'Classic Cheeseburger', price: 14.50, qty: 2 },
    { id: 2, name: 'Truffle Fries', price: 6.00, qty: 1 }
  ]);
  const [submitted, setSubmitted] = useState(false);

  const menuItems = [
    { id: 1, name: 'Classic Cheeseburger', category: 'Mains', price: 14.50 },
    { id: 2, name: 'Truffle Fries', category: 'Sides', price: 6.00 },
    { id: 3, name: 'Caesar Salad', category: 'Starters', price: 10.00 },
    { id: 4, name: 'Grilled Ribeye Steak', category: 'Mains', price: 28.00 },
    { id: 5, name: 'Pepperoni Pizza', category: 'Mains', price: 18.00 },
    { id: 6, name: 'Iced Fresh Lemonade', category: 'Beverages', price: 4.50 },
  ];

  const filteredMenu = category === 'All' 
    ? menuItems 
    : menuItems.filter(i => i.category === category);

  const handleAddToCart = (item) => {
    setCart(prev => {
      const exists = prev.find(c => c.id === item.id);
      if (exists) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const handleUpdateQty = (id, delta) => {
    setCart(prev => prev.map(c => {
      if (c.id === id) {
        const newQty = c.qty + delta;
        return newQty > 0 ? { ...c, qty: newQty } : null;
      }
      return c;
    }).filter(Boolean));
  };

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleSendToKitchen = () => {
    if (cart.length === 0) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setCart([]);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Plus className="w-6 h-6 text-emerald-500" /> Create Table Order
          </h1>
          <p className="text-xs text-slate-500 font-medium">Select items and send tickets directly to kitchen chefs.</p>
        </div>

        {/* Table Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Target Table:</span>
          <select 
            value={selectedTable} 
            onChange={(e) => setSelectedTable(e.target.value)}
            className="bg-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 shadow-sm outline-none"
          >
            <option>Table 5 (4 Guests)</option>
            <option>Table 7 (2 Guests)</option>
            <option>Table 12 (6 Guests)</option>
            <option>Table 3 (3 Guests)</option>
            <option>Table 15 (2 Guests)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Grid */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex gap-1 overflow-x-auto pb-1 text-xs font-bold">
            {['All', 'Starters', 'Mains', 'Sides', 'Beverages'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  category === cat 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'bg-slate-100 text-slate-500 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredMenu.map((item) => (
              <div key={item.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 space-y-3 flex flex-col justify-between hover:border-emerald-500/50 transition-all">
                <div>
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">{item.category}</span>
                  <p className="font-bold text-xs text-slate-800">{item.name}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                  <span className="text-xs font-mono font-black text-slate-900">${item.price.toFixed(2)}</span>
                  <button 
                    type="button" 
                    onClick={() => handleAddToCart(item)}
                    className="p-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-sm transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Order Ticket */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Order Ticket</h3>
              <span className="text-xs font-bold text-emerald-600">{selectedTable}</span>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {cart.map(c => (
                <div key={c.id} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 text-xs">
                  <div>
                    <p className="font-bold text-slate-800">{c.name}</p>
                    <p className="text-[10px] text-slate-400">${c.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button type="button" onClick={() => handleUpdateQty(c.id, -1)} className="p-1 hover:text-rose-500 cursor-pointer">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-1.5 font-bold">{c.qty}</span>
                      <button type="button" onClick={() => handleUpdateQty(c.id, 1)} className="p-1 hover:text-emerald-500 cursor-pointer">
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="font-black text-slate-900 w-12 text-right">${(c.price * c.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs font-bold">No items in order ticket.</div>
              )}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="flex justify-between text-xs font-bold">
              <span>Total Amount:</span>
              <span className="text-emerald-600 text-sm font-black">${total.toFixed(2)}</span>
            </div>
            <button
              type="button"
              disabled={submitted || cart.length === 0}
              onClick={handleSendToKitchen}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                submitted 
                  ? 'bg-emerald-100 text-emerald-700' 
                  : cart.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              {submitted ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Sent Ticket to Kitchen!
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Send Ticket to Kitchen
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
