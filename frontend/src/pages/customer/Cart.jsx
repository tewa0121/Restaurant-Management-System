import React from 'react';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totals } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-5 pb-8 max-w-3xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Your Shopping Cart</h1>
          <p className="text-xs text-gray-400">Review your selected items before checkout</p>
        </div>
        {cartItems.length > 0 && (
          <button onClick={clearCart} className="text-xs font-semibold text-red-500 hover:underline">
            Clear Cart
          </button>
        )}
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 text-gray-400 space-y-3">
          <ShoppingCart size={40} className="mx-auto opacity-30" />
          <p className="text-xs font-semibold">Your cart is currently empty</p>
          <button 
            onClick={() => navigate('/customer/menu')}
            className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
          <div className="divide-y divide-gray-100">
            {cartItems.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                    <p className="text-xs text-gray-500">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-100 rounded-lg px-2 py-1">
                    <button onClick={() => updateQuantity(item.id, -1)}><Minus size={12} /></button>
                    <span className="px-2 text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)}><Plus size={12} /></button>
                  </div>
                  <span className="font-extrabold text-xs w-16 text-right">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-gray-500"><span>Delivery Fee</span><span>${totals.deliveryFee.toFixed(2)}</span></div>
            <div className="flex justify-between font-extrabold text-sm text-gray-900 pt-2 border-t"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
          </div>

          <button 
            onClick={() => navigate('/customer/checkout')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2"
          >
            Proceed to Checkout <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}