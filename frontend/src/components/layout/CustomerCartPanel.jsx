import React, { useState } from 'react';
import { Trash2, Minus, Plus, ArrowRight, ShoppingCart, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CustomerCartPanel() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, totals } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromoName, setAppliedPromoName] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('VISA');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Handle Promo Code Application
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'RESTA10') {
      setDiscount(0.10); // 10% discount
      setAppliedPromoName('RESTA10');
      alert('Promo code "RESTA10" applied successfully! 10% off your order.');
    } else {
      alert('Invalid promo code. Try using "RESTA10".');
    }
  };

  // Calculate final total with discount applied
  const subtotalWithDiscount = totals.subtotal * (1 - discount);
  const finalCalculatedTotal = subtotalWithDiscount + totals.deliveryFee + (subtotalWithDiscount * 0.08);

  // Handle Checkout Execution
  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
      clearCart();
    }, 1500);
  };

  if (orderComplete) {
    return (
      <aside className="w-full bg-white min-h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <CheckCircle2 size={48} className="text-green-600 animate-bounce" />
        <h3 className="font-extrabold text-gray-900 text-sm">Order Placed Successfully!</h3>
        <p className="text-[10px] text-gray-500">Your fresh food is on its way. Thank you for ordering with RestoDelight!</p>
        <button 
          onClick={() => setOrderComplete(false)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition-all shadow-sm"
        >
          Place New Order
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-full bg-white min-h-full flex flex-col p-3 pr-1">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
          Cart 
          <span className="bg-green-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {cartItems.length}
          </span>
        </h2>
        {cartItems.length > 0 && (
          <button 
            onClick={clearCart} 
            className="text-[10px] text-red-500 font-semibold hover:text-red-700 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="space-y-2.5 mb-3 flex-1 overflow-y-auto max-h-[220px]">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-28 text-gray-400 space-y-1">
            <ShoppingCart size={24} className="opacity-40" />
            <p className="text-[10px] font-medium">Cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <img 
                src={item.image_url || '/assets/food-placeholders/food-healthy-bowl.png'} 
                alt={item.name} 
                className="w-10 h-10 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0" 
              />
              
              <div className="flex-1 min-w-0">
                <h4 className="text-[10px] font-semibold text-gray-900 truncate">{item.name}</h4>
                <p className="text-gray-900 font-bold text-[10px]">${item.price.toFixed(2)}</p>
                
                <div className="flex items-center gap-1 mt-0.5">
                  <div className="flex items-center bg-gray-100 rounded px-1 py-0.5">
                    <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-600 hover:text-gray-900">
                      <Minus size={9} />
                    </button>
                    <span className="px-1.5 text-[10px] font-bold text-gray-800">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-600 hover:text-gray-900">
                      <Plus size={9} />
                    </button>
                  </div>
                </div>
              </div>

              <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-0.5 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Interactive Promo Code Input */}
      <div className="flex gap-1 mb-3">
        <input 
          type="text" 
          placeholder="Promo (try RESTA10)" 
          value={promoCode}
          onChange={(e) => setPromoCode(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-2 py-1 text-[10px] bg-gray-50/50 focus:outline-none focus:ring-1 focus:ring-green-500 font-mono"
        />
        <button 
          onClick={handleApplyPromo}
          className="text-green-600 font-bold text-[10px] px-2 py-1 hover:bg-green-50 rounded-lg transition-colors cursor-pointer"
        >
          Apply
        </button>
      </div>

      {appliedPromoName && (
        <div className="text-[9px] text-green-600 font-semibold mb-2 bg-green-50 px-2 py-0.5 rounded flex justify-between items-center">
          <span>Promo {appliedPromoName} active (-10%)</span>
          <button onClick={() => { setDiscount(0); setAppliedPromoName(''); }} className="text-red-500 hover:underline">Remove</button>
        </div>
      )}

      {/* Interactive Payment Method Selector */}
      <div className="mb-3 space-y-1">
        <label className="text-[10px] font-bold text-gray-700 block">Payment Method:</label>
        <div className="grid grid-cols-5 gap-1">
          {['VISA', 'MC', 'AMEX', 'PP', 'APay'].map((method) => (
            <button
              key={method}
              onClick={() => setSelectedPayment(method)}
              className={`py-1 text-[9px] font-bold rounded border transition-all cursor-pointer ${
                selectedPayment === method 
                  ? 'bg-green-600 text-white border-green-600 shadow-sm' 
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
            >
              {method}
            </button>
          ))}
        </div>
      </div>

      {/* Totals Breakdown */}
      <div className="border-t border-gray-100 pt-2 space-y-1 text-[10px] mb-3">
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Subtotal</span>
          <span className="font-semibold text-gray-900">${totals.subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600 font-medium">
            <span>Discount (10%)</span>
            <span>-${(totals.subtotal * discount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Delivery</span>
          <span className="font-semibold text-gray-900">${totals.deliveryFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-500 font-medium">
          <span>Tax (8%)</span>
          <span className="font-semibold text-gray-900">${(subtotalWithDiscount * 0.08).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-extrabold text-gray-900 text-xs pt-1.5 border-t border-gray-100">
          <span>Total ({selectedPayment})</span>
          <span>${finalCalculatedTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Functional Checkout Button */}
      <div className="space-y-1.5">
        <button 
          disabled={cartItems.length === 0 || isCheckingOut}
          onClick={handleCheckout}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] disabled:opacity-50 shadow-sm cursor-pointer"
        >
          {isCheckingOut ? 'Processing...' : <>Checkout <ArrowRight size={12} /></>}
        </button>
      </div>

      {/* Offer Banner */}
      <div className="mt-3 bg-[#121212] rounded-xl p-2.5 relative overflow-hidden text-white flex justify-between items-center">
        <div className="relative z-10 space-y-0.5">
          <p className="text-[8px] text-gray-400 font-medium">Hungry for more?</p>
          <h4 className="text-[10px] font-bold leading-tight">Get 10% OFF</h4>
          <span className="border border-dashed border-gray-600 bg-white/5 px-1.5 py-0.5 rounded text-[8px] font-mono text-green-400 inline-block">
            RESTA10
          </span>
        </div>
        <img 
          src="/assets/food-placeholders/food-healthy-bowl.png" 
          className="w-12 h-12 object-cover rounded-full opacity-80" 
          alt="Promo dish" 
        />
      </div>

    </aside>
  );
}