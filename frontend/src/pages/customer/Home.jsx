import React, { useState } from 'react';
import { ArrowRight, Star, Plus, Heart, ShieldCheck, Truck, HeadphonesIcon, Award, Tag, X, Check } from 'lucide-react';
import { getCustomerPortalData } from '../../services/mockAdapter';
import { useCart } from '../../context/CartContext';

export default function CustomerHome() {
  const data = getCustomerPortalData() || {};
  const categories = data.categories || [];
  const initialDishes = data.popularDishes || [];
  
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState({});
  const [showOffersModal, setShowOffersModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);

  // Toggle favorite status for a dish
  const toggleFavorite = (dishId, e) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [dishId]: !prev[dishId]
    }));
  };

  // 1. "Order Now" Action Handler
  const handleOrderNow = () => {
    // Smooth scroll down to the dishes menu
    const dishesSection = document.getElementById('popular-dishes-section');
    if (dishesSection) {
      dishesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 2. "View Offers" Action Handler
  const handleViewOffers = () => {
    setShowOffersModal(true);
  };

  // Copy offer code handler
  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const categoryItems = [
    { id: 'breakfast', name: 'Breakfast', icon: '🥞' },
    { id: 'lunch', name: 'Lunch', icon: '🍲' },
    { id: 'dinner', name: 'Dinner', icon: '🍖' },
    { id: 'appetizers', name: 'Appetizers', icon: '🧆' },
    { id: 'drinks', name: 'Drinks', icon: '🍹' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
  ];

  const dishImages = {
    'Grilled Chicken with Veggies': '/assets/food-placeholders/food-grilled-chicken.png',
    'Beef Burger with Fries': '/assets/food-placeholders/food-burger-fries.png',
    'Margherita Pizza': '/assets/food-placeholders/food-pizza.png',
    'Pasta Alfredo': '/assets/food-placeholders/food-pasta-alfredo.png',
    'Chicken Biryani': '/assets/food-placeholders/food-biryani.png',
    'Fresh Orange Juice': '/assets/food-placeholders/food-juice.png',
    'Chocolate Lava Cake': '/assets/food-placeholders/food-chocolate-cake.png',
  };

  const heroImage = '/assets/food-placeholders/food-healthy-bowl.png';

  const getImageSrc = (dish) => {
    if (dishImages[dish.name]) return dishImages[dish.name];
    if (dish.image_url) return dish.image_url;
    if (dish.image) return dish.image;
    return heroImage;
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = heroImage;
  };

  const filteredDishes = selectedCategory 
    ? initialDishes.filter(d => d.category_id === selectedCategory || d.category === selectedCategory)
    : initialDishes;

  return (
    <div className="w-full space-y-6 pb-8 relative">
      
      {/* 1. Hero Banner */}
      <div className="relative bg-[#111111] rounded-3xl overflow-hidden flex items-center min-h-[240px] w-full shadow-sm">
        <div className="relative z-10 p-6 md:p-8 w-full md:w-3/5 space-y-3">
          <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-white tracking-tight">
            Delicious food,<br />
            delivered <span className="text-green-500">to you</span>
          </h1>
          <p className="text-gray-300 max-w-sm text-xs font-medium">
            Order your favorite meals from our wide range of tasty dishes.
          </p>
          
          <div className="flex gap-3 pt-1">
            {/* Functional ORDER NOW Button */}
            <button 
              onClick={handleOrderNow}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer active:scale-95"
            >
              Order Now <ArrowRight size={14} />
            </button>

            {/* Functional VIEW OFFERS Button */}
            <button 
              onClick={handleViewOffers}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <Tag size={13} className="text-yellow-400" /> View Offers
            </button>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 h-full">
          <img 
            src={heroImage} 
            alt="Delicious Healthy Bowl" 
            onError={handleImageError}
            className="w-full h-full object-cover object-right opacity-90" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111111] via-[#111111]/70 to-transparent md:via-[#111111]/40" />
        </div>
      </div>

      {/* 2. Categories Grid */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900">Categories</h2>
          <button 
            onClick={() => setSelectedCategory(null)} 
            className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors cursor-pointer"
          >
            {selectedCategory ? 'Clear Filter' : 'View All'}
          </button>
        </div>
        
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {(categories && categories.length > 0 ? categories : categoryItems).map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div 
                key={cat.id || cat.name} 
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className={`flex flex-col items-center p-2.5 rounded-2xl cursor-pointer transition-all border ${
                  isSelected 
                    ? 'bg-green-50 border-green-500 shadow-sm ring-2 ring-green-100' 
                    : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-lg mb-1">
                  {cat.icon || '🍲'}
                </div>
                <span className="text-[11px] font-bold text-gray-800 text-center">{cat.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Dishes Grid */}
      <div id="popular-dishes-section" className="scroll-mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-900">
            {selectedCategory ? `Dishes in ${selectedCategory}` : 'Popular Dishes'}
          </h2>
          <button onClick={() => setSelectedCategory(null)} className="text-xs font-bold text-green-600 hover:text-green-700 transition-colors cursor-pointer">
            View All
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredDishes.map((dish) => {
            const imageSrc = getImageSrc(dish);
            const isFav = favorites[dish.id];
            return (
              <div 
                key={dish.id || dish.name} 
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col p-3"
              >
                <div className="relative h-32 w-full rounded-xl overflow-hidden bg-gray-100 mb-2.5 flex items-center justify-center">
                  <img 
                    src={imageSrc} 
                    alt={dish.name} 
                    onError={handleImageError}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button 
                    onClick={(e) => toggleFavorite(dish.id, e)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <Heart size={13} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                  </button>
                </div>

                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-xs truncate">{dish.name}</h3>
                    <div className="flex items-center gap-1 mt-1 mb-2">
                      <Star size={11} className="fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-bold text-gray-800">
                        {dish.rating ? Number(dish.rating).toFixed(1) : '4.7'}
                      </span>
                      <span className="text-[10px] text-gray-400">({dish.reviews || '320'})</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                    <span className="font-extrabold text-gray-900 text-xs">
                      ${Number(dish.price || 0).toFixed(2)}
                    </span>
                    <button 
                      onClick={() => addToCart({ ...dish, image_url: imageSrc })}
                      className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                    >
                      Add <Plus size={12} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Trust Badges Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-green-50 rounded-xl text-green-600">
            <Truck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Fast Delivery</h4>
            <p className="text-[9px] text-gray-400">Get your orders delivered fast</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-green-50 rounded-xl text-green-600">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Secure Payment</h4>
            <p className="text-[9px] text-gray-400">100% secure payment methods</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-green-50 rounded-xl text-green-600">
            <HeadphonesIcon size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">24/7 Support</h4>
            <p className="text-[9px] text-gray-400">We're here to help you anytime</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-green-50 rounded-xl text-green-600">
            <Award size={20} />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-xs">Best Quality</h4>
            <p className="text-[9px] text-gray-400">Fresh ingredients & hygienic</p>
          </div>
        </div>
      </div>

      {/* 5. How It Works & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-gray-100 space-y-4">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider">How It Works</h2>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Choose Food</h4>
                <p className="text-[10px] text-gray-400">Browse your favorite dishes & add to cart</p>
              </div>
            </div>

            <div className="hidden sm:block text-gray-300"><ArrowRight size={16} /></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Place Order</h4>
                <p className="text-[10px] text-gray-400">Place your order & make payment</p>
              </div>
            </div>

            <div className="hidden sm:block text-gray-300"><ArrowRight size={16} /></div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-xs">Fast Delivery</h4>
                <p className="text-[10px] text-gray-400">We'll deliver it hot & fresh to your door</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
          <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">We Accept</h2>
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-extrabold text-blue-700">VISA</div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-extrabold text-red-500">MC</div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-extrabold text-blue-500">AMEX</div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-extrabold text-blue-600">PayPal</div>
            <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-extrabold text-black">Pay</div>
          </div>
        </div>
      </div>

      {/* 6. Active Special Offers Modal */}
      {showOffersModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-xl border border-gray-100 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowOffersModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-green-600">
              <Tag size={20} />
              <h3 className="text-base font-extrabold text-gray-900">Active Deals & Offers</h3>
            </div>

            <p className="text-xs text-gray-500 font-medium">Copy promo codes below and apply them in your cart sidebar!</p>

            <div className="space-y-3 pt-2">
              {/* Offer Item 1 */}
              <div className="p-3.5 bg-green-50/60 border border-green-200/60 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs">10% Off First Order</h4>
                  <p className="text-[10px] text-gray-500">Applies to all food & drink items</p>
                  <span className="inline-block mt-1.5 font-mono text-xs font-bold text-green-700 bg-white border border-green-300 px-2 py-0.5 rounded-md">
                    RESTA10
                  </span>
                </div>
                <button 
                  onClick={() => handleCopyCode('RESTA10')}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  {copiedCode === 'RESTA10' ? <><Check size={12} /> Copied</> : 'Copy Code'}
                </button>
              </div>

              {/* Offer Item 2 */}
              <div className="p-3.5 bg-orange-50/60 border border-orange-200/60 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-gray-900 text-xs">Free Delivery</h4>
                  <p className="text-[10px] text-gray-500">Valid on orders over $25</p>
                  <span className="inline-block mt-1.5 font-mono text-xs font-bold text-orange-700 bg-white border border-orange-300 px-2 py-0.5 rounded-md">
                    FREEDEL
                  </span>
                </div>
                <button 
                  onClick={() => handleCopyCode('FREEDEL')}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  {copiedCode === 'FREEDEL' ? <><Check size={12} /> Copied</> : 'Copy Code'}
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowOffersModal(false)}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}