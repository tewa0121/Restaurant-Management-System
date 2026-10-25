import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Star, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag, 
  X,
  Truck, 
  ShieldCheck, 
  Headphones, 
  Award,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  XCircle,
  Lock,
  User,
  LogIn
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { cart, addToCart, removeFromCart, updateQuantity, subtotal, tax, deliveryFee, totalAmount, clearCart } = useCart();
  const { isAuthenticated, login } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Drawer & Selection States
  const [isCartOpen, setIsCartOpen] = useState(false); 
  const [selectedPayment, setSelectedPayment] = useState(null); // Null until customer explicitly selects one

  // Modals Flow States
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null); // 'processing' | 'success' | 'failed' | null
  const [authFormData, setAuthFormData] = useState({ email: '', password: '' });

  const categories = [
    { id: 'breakfast', label: 'Breakfast', icon: '🥞' },
    { id: 'lunch', label: 'Lunch', icon: '🥗' },
    { id: 'dinner', label: 'Dinner', icon: '🍖' },
    { id: 'appetizers', label: 'Appetizers', icon: '🧆' },
    { id: 'drinks', label: 'Drinks', icon: '🍹' },
    { id: 'desserts', label: 'Desserts', icon: '🍰' },
    { id: 'salads', label: 'Salads', icon: '🥗' },
  ];

  const popularDishes = [
    { id: 'dish-1', name: 'Grilled Chicken with Veggies', price: 12.99, rating: 4.7, reviews: 320, image: '/assets/food-placeholders/food-grilled-chicken.png' },
    { id: 'dish-2', name: 'Beef Burger with Fries', price: 10.99, rating: 4.6, reviews: 280, image: '/assets/food-placeholders/food-burger-fries.png' },
    { id: 'dish-3', name: 'Margherita Pizza', price: 11.99, rating: 4.8, reviews: 420, image: '/assets/food-placeholders/food-pizza.png' },
    { id: 'dish-4', name: 'Pasta Alfredo', price: 11.49, rating: 4.6, reviews: 210, image: '/assets/food-placeholders/food-pasta-alfredo.png' },
    { id: 'dish-5', name: 'Chicken Biryani', price: 13.49, rating: 4.7, reviews: 310, image: '/assets/food-placeholders/food-biryani.png' },
  ];

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'RESTA10') {
      setDiscount(subtotal * 0.1);
    } else {
      alert('Invalid promo code. Try RESTA10 for 10% off!');
    }
  };

  // Process order execution
  const executePayment = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing delay
    setTimeout(() => {
      // 90% success rate simulation
      const isSuccess = Math.random() > 0.1; 
      if (isSuccess) {
        setPaymentStatus('success');
        if (clearCart) clearCart();
      } else {
        setPaymentStatus('failed');
      }
    }, 1500);
  };

  // Main Action Click
  const handlePayClick = () => {
    if (!selectedPayment || cart.length === 0) return;

    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      executePayment();
    }
  };

  // Handle Modal Login Action
  const handleModalAuthSubmit = (e) => {
    e.preventDefault();
    if (login) {
      login({ email: authFormData.email });
    }
    setShowAuthModal(false);
    executePayment();
  };

  return (
    <div className="p-6 space-y-8 max-w-[1700px] mx-auto relative font-sans text-gray-900 dark:text-white">
      
      {/* 1. TOP HEADER ACTION */}
      <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800">
        <div>
          <h1 className="text-xl font-extrabold">Welcome to RestoDelight</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Order fresh & delicious food directly to your doorstep</p>
        </div>

        {/* 'MY CART' TOP TRIGGER */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer shadow-xs"
        >
          <ShoppingBag size={16} />
          <span>My Cart</span>
          <span className="bg-white text-emerald-600 text-[10px] font-black px-2 py-0.5 rounded-full shadow-inner">
            {totalItemsCount}
          </span>
        </button>
      </div>

      {/* 2. FLOATING 'MY CART' BUTTON */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed right-6 bottom-6 z-40 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-3 transition-all cursor-pointer group"
        title="Open My Cart"
      >
        <ShoppingBag size={20} />
        <span className="font-extrabold text-xs">My Cart</span>
        <span className="bg-white text-emerald-600 text-xs font-black px-2.5 py-0.5 rounded-full shadow-inner">
          {totalItemsCount}
        </span>
      </button>

      {/* 3. MAIN CONTENT FEED */}
      <div className="space-y-8">
        
        {/* Promo Banner */}
        <div className="relative bg-[#0D1813] text-white rounded-3xl p-8 overflow-hidden shadow-sm flex items-center min-h-[220px]">
          <div className="relative z-10 max-w-xs space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Delicious food, delivered <span className="text-emerald-400">to you</span>
            </h2>
            <p className="text-xs text-gray-300">Order your favorite meals from our wide range of tasty dishes.</p>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => navigate('/customer/menu')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                Order Now <ArrowRight size={14} />
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
                View Offers
              </button>
            </div>
          </div>

          <img
            src="/assets/food-placeholders/food-banner-bowl.png"
            alt="Food Bowl Banner"
            className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 object-cover rounded-full opacity-95 hidden sm:block transform translate-x-8"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Categories</h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3 text-center space-y-2 hover:shadow-xs transition-shadow cursor-pointer group"
              >
                <div className="w-12 h-12 mx-auto bg-amber-50/80 dark:bg-gray-800 rounded-2xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block truncate">{cat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Dishes */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">Popular Dishes</h3>
            <button className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {popularDishes.map((dish) => (
              <div key={dish.id} className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-3.5 shadow-2xs space-y-3 relative group">
                <button className="absolute top-4 right-4 p-1.5 bg-white/80 dark:bg-gray-800/80 rounded-full text-gray-400 hover:text-rose-500 transition-colors z-10 cursor-pointer">
                  <Heart size={14} />
                </button>

                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-32 object-cover rounded-xl bg-gray-50"
                  onError={(e) => { e.target.src = '/assets/food-placeholders/food-burger.png'; }}
                />

                <div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white truncate">{dish.name}</h4>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold mt-1">
                    <Star size={12} fill="currentColor" />
                    <span>{dish.rating} ({dish.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-sm text-gray-900 dark:text-white">${dish.price.toFixed(2)}</span>
                  <button
                    type="button"
                    onClick={() => {
                      addToCart({ id: dish.id, name: dish.name, price: Number(dish.price), image: dish.image });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>Add</span> <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-2xl p-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Truck size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Fast Delivery</h5><p className="text-[10px] text-gray-400">Get your orders delivered fast</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><ShieldCheck size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Secure Payment</h5><p className="text-[10px] text-gray-400">100% secure payment methods</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Headphones size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">24/7 Support</h5><p className="text-[10px] text-gray-400">We're here to help you anytime</p></div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl"><Award size={18} /></div>
            <div><h5 className="font-extrabold text-gray-900 dark:text-white">Best Quality</h5><p className="text-[10px] text-gray-400">Fresh ingredients & hygienic cooking</p></div>
          </div>
        </div>

      </div>

      {/* 4. SLIDING 'MY CART' DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white dark:bg-[#0B1426] border-l border-gray-100 dark:border-gray-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
              
              <div className="space-y-4">
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag size={18} className="text-emerald-600" /> MY CART
                    <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{totalItemsCount} items</span>
                  </h3>
                  <button onClick={() => setIsCartOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
                    <X size={18} />
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3 max-h-48 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800 pr-1">
                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-400 py-6 text-center">Your cart is empty. Add food items to proceed!</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="pt-3 flex items-center gap-3">
                        <img src={item.image || '/assets/food-placeholders/food-burger.png'} alt={item.name} className="w-12 h-12 rounded-xl object-cover shrink-0 bg-gray-50" />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-bold text-xs text-gray-900 dark:text-white truncate">{item.name}</h5>
                          <span className="font-black text-xs text-emerald-600 block">${(item.price * item.qty).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"><Minus size={10} /></button>
                          <span className="text-xs font-bold px-1">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"><Plus size={10} /></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-rose-500 cursor-pointer"><Trash2 size={14} /></button>
                      </div>
                    ))
                  )}
                </div>

                {/* PAYMENT METHOD SELECTION */}
                <div className="space-y-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-extrabold text-gray-900 dark:text-white block">Select Payment Method</label>
                    {!selectedPayment && <span className="text-[10px] text-amber-500 font-bold">*Required</span>}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('card')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        selectedPayment === 'card' 
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 ring-2 ring-emerald-600/20' 
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <CreditCard size={16} />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('cash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        selectedPayment === 'cash' 
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 ring-2 ring-emerald-600/20' 
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <Banknote size={16} />
                      <span>Cash</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayment('wallet')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition-all ${
                        selectedPayment === 'wallet' 
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 ring-2 ring-emerald-600/20' 
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300'
                      }`}
                    >
                      <Wallet size={16} />
                      <span>Wallet</span>
                    </button>
                  </div>
                </div>

                {/* Promo Code Input */}
                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    placeholder="Promo Code (RESTA10)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-xs focus:outline-none text-gray-900 dark:text-white"
                  />
                  <button onClick={handleApplyPromo} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-2 rounded-xl cursor-pointer">
                    Apply Promo
                  </button>
                </div>

              </div>

              {/* Bottom Payment Calculations & Active PAY Button */}
              <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800 mt-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900 dark:text-white">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-gray-900 dark:text-white">${tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount (10%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-black text-gray-900 dark:text-white pt-2 border-t border-gray-100 dark:border-gray-800">
                    <span>Total {selectedPayment && `(${selectedPayment.toUpperCase()})`}</span>
                    <span className="text-emerald-600">${(totalAmount - discount).toFixed(2)}</span>
                  </div>
                </div>

                {/* ACTIVE 'PAY' BUTTON */}
                <button
                  onClick={handlePayClick}
                  disabled={!selectedPayment || cart.length === 0}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 disabled:text-gray-400 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:cursor-not-allowed"
                >
                  <span>
                    {!selectedPayment ? 'Select Payment Method' : `Pay $${(totalAmount - discount).toFixed(2)}`}
                  </span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 5. POPUP AUTH MODAL (Pops up when clicking 'Pay' if customer is not logged in) */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm space-y-5 shadow-2xl relative">
            <button onClick={() => setShowAuthModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <LogIn size={22} />
              </div>
              <h3 className="font-extrabold text-base">Sign In to Complete Order</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Log in or enter your credentials to complete your payment.</p>
            </div>

            <form onSubmit={handleModalAuthSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="customer@example.com"
                  value={authFormData.email}
                  onChange={(e) => setAuthFormData({ ...authFormData, email: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authFormData.password}
                  onChange={(e) => setAuthFormData({ ...authFormData, password: e.target.value })}
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer shadow-xs mt-2"
              >
                Sign In & Continue Payment
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 6. PAYMENT STATUS MODAL (Success or Failed) */}
      {paymentStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0B1426] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-sm text-center space-y-4 shadow-2xl">
            
            {/* Processing State */}
            {paymentStatus === 'processing' && (
              <div className="py-6 space-y-3">
                <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <h4 className="font-extrabold text-sm">Processing Payment...</h4>
                <p className="text-xs text-gray-400">Connecting securely with payment provider</p>
              </div>
            )}

            {/* Success State */}
            {paymentStatus === 'success' && (
              <div className="space-y-3 py-2">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="font-extrabold text-lg text-emerald-600">Payment Successful!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your order has been placed successfully. You can track your meal in real-time.
                </p>
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => {
                      setPaymentStatus(null);
                      setIsCartOpen(false);
                      navigate('/customer/track-order');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Track Order Now
                  </button>
                  <button
                    onClick={() => {
                      setPaymentStatus(null);
                      setIsCartOpen(false);
                    }}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            )}

            {/* Failed State */}
            {paymentStatus === 'failed' && (
              <div className="space-y-3 py-2">
                <div className="w-14 h-14 bg-rose-50 dark:bg-rose-950/60 text-rose-500 rounded-full flex items-center justify-center mx-auto">
                  <XCircle size={36} />
                </div>
                <h3 className="font-extrabold text-lg text-rose-500">Payment Failed</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Transaction could not be completed. Please check your account balance or try another method.
                </p>
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => executePayment()}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs py-2.5 rounded-xl transition-all cursor-pointer"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setPaymentStatus(null)}
                    className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Change Payment Method
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}