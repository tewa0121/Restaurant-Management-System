import React, { useState } from 'react';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerCartPanel() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([
    { id: 1, name: 'Margherita Pizza', price: 14.99, qty: 1, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&h=100&fit=crop' },
    { id: 2, name: 'Fresh Berry Smoothie', price: 5.50, qty: 2, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=100&h=100&fit=crop' }
  ]);

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev
        .map(item => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter(item => item.qty > 0)
    );
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <div className="flex flex-col h-full p-4 bg-white select-none">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
          <ShoppingBag className="w-4 h-4 text-[#52C41A]" />
          Current Order
        </h3>
        <span className="text-[10px] font-bold text-slate-400">{cartItems.length} items</span>
      </div>

      {/* Cart Item List */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 custom-scrollbar">
        {cartItems.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-semibold">Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex gap-2.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                <p className="text-[11px] font-black text-[#52C41A]">${(item.price * item.qty).toFixed(2)}</p>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    {item.qty === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                  </button>
                  <span className="text-xs font-bold text-slate-700">{item.qty}</span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Price Summary */}
      {cartItems.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-slate-100">
            <span>Total</span>
            <span className="text-[#52C41A]">${total.toFixed(2)}</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/checkout')}
            className="w-full mt-3 py-2.5 bg-[#52C41A] text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 hover:bg-emerald-600 transition cursor-pointer"
          >
            Checkout <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}