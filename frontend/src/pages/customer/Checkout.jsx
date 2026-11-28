import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totals, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState('card');

  const handlePlaceOrder = () => {
    alert('Order placed successfully!');
    clearCart();
    navigate('/customer/tracking');
  };

  // ❌ REMOVED <CustomerLayout> WRAPPER
  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-10 px-4">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/customer/cart')} className="p-2 bg-white rounded-full shadow-sm border border-gray-200 hover:bg-gray-50">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-500 text-sm">Complete your order</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Delivery & Payment */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Delivery Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-green-600" /> Delivery Address
            </h3>
            <div className="space-y-3">
              <input type="text" placeholder="Full Name" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
              <input type="text" placeholder="Phone Number" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500" />
              <textarea placeholder="Full Address (Street, Building, City)" rows="2" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-500 resize-none"></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard size={20} className="text-green-600" /> Payment Method
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setPaymentMethod('card')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <CreditCard size={24} className={paymentMethod === 'card' ? 'text-green-600' : 'text-gray-500'} />
                <span className="font-semibold text-sm">Credit Card</span>
              </button>
              <button 
                onClick={() => setPaymentMethod('cash')}
                className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Banknote size={24} className={paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-500'} />
                <span className="font-semibold text-sm">Cash on Delivery</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 border-b border-gray-100 pb-4">Your Order</h3>
            
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.quantity}x {item.name}</span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm mb-6 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500 font-medium">
                <span>Total</span>
                <span className="text-lg font-bold text-gray-900">${totals.total.toFixed(2)}</span>
              </div>
            </div>

            <button 
              onClick={handlePlaceOrder}
              disabled={cartItems.length === 0}
              className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              Place Order
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}