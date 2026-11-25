// src/pages/cashier/NewBill.jsx
import React, { useState } from 'react';
import { Plus, Minus, Trash2, DollarSign, CheckCircle2, ShoppingCart } from 'lucide-react';

export function NewBill() {
  const [selectedTable, setSelectedTable] = useState('Table 5');
  const [cart, setCart] = useState([
    { id: 1, name: 'Classic Cheeseburger', price: 14.50, qty: 2 },
    { id: 2, name: 'Truffle Fries', price: 6.00, qty: 1 },
    { id: 3, name: 'Iced Fresh Lemonade', price: 4.50, qty: 2 }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('Card');
  const [paidSuccess, setPaidSuccess] = useState(false);

  const menuCatalog = [
    { id: 1, name: 'Classic Cheeseburger', category: 'Mains', price: 14.50 },
    { id: 2, name: 'Truffle Fries', category: 'Sides', price: 6.00 },
    { id: 3, name: 'Caesar Salad', category: 'Starters', price: 10.00 },
    { id: 4, name: 'Grilled Ribeye Steak', category: 'Mains', price: 28.00 },
    { id: 5, name: 'Pepperoni Pizza', category: 'Mains', price: 18.00 },
    { id: 6, name: 'Iced Fresh Lemonade', category: 'Beverages', price: 4.50 },
    { id: 7, name: 'Chocolate Lava Cake', category: 'Desserts', price: 8.50 },
  ];

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = i.qty + delta;
        return newQty > 0 ? { ...i, qty: newQty } : null;
      }
      return i;
    }).filter(Boolean));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const subtotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPaidSuccess(true);
    setTimeout(() => {
      setPaidSuccess(false);
      setCart([]);
    }, 2500);
  };

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-500" /> New Bill Checkout (POS)
          </h1>
          <p className="text-xs text-slate-500 font-medium">Select table orders, apply charges, and settle payments.</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600">Assign Table:</span>
          <select
            value={selectedTable}
            onChange={(e) => setSelectedTable(e.target.value)}
            className="bg-white px-3 py-2 rounded-xl text-xs font-bold border border-slate-200 shadow-sm outline-none"
          >
            {['Table 1', 'Table 2', 'Table 3', 'Table 5', 'Table 7', 'Table 8', 'Table 10', 'Table 12'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Menu Grid */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Menu Catalog Items</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {menuCatalog.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="p-3.5 bg-slate-50/70 border border-slate-200/60 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-600">{item.category}</span>
                  <p className="font-bold text-xs text-slate-800 mt-0.5 leading-snug">{item.name}</p>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                  <span className="text-xs font-black text-slate-900">${item.price.toFixed(2)}</span>
                  <span className="p-1 bg-emerald-600 text-white rounded-lg shadow-sm"><Plus className="w-3.5 h-3.5" /></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart & Payment Drawer */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2 border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Current Cart ({selectedTable})</h3>
              <button onClick={() => setCart([])} className="text-[10px] font-bold text-rose-500 hover:underline cursor-pointer">Clear All</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {cart.map(item => (
                <div key={item.id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{item.name}</p>
                    <p className="text-[10px] text-slate-400">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-0.5">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-rose-500 cursor-pointer"><Minus className="w-3 h-3" /></button>
                      <span className="px-1.5 font-bold">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-emerald-500 cursor-pointer"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-black text-slate-900 w-12 text-right">${(item.price * item.qty).toFixed(2)}</span>
                    <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-rose-500 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && <div className="text-center py-10 text-slate-400 text-xs font-bold">Cart is empty. Select menu items.</div>}
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-500"><span>Tax (10%)</span><span>${tax.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-100">
                <span>Total Due</span>
                <span className="text-emerald-600">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2">
              {['Cash', 'Card', 'Mobile'].map(m => (
                <button
                  key={m}
                  onClick={() => setPaymentMethod(m)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    paymentMethod === m ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              disabled={paidSuccess || cart.length === 0}
              onClick={handleCheckout}
              className={`w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                paidSuccess ? 'bg-emerald-100 text-emerald-700' : cart.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
              }`}
            >
              {paidSuccess ? <><CheckCircle2 className="w-4 h-4" /> Payment Successful! </> : <><DollarSign className="w-4 h-4" /> Complete Payment (${total.toFixed(2)})</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewBill;