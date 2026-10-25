import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowRight,
  Star,
  Heart,
  Plus,
  ShoppingBag,
  X,
  Truck,
  ShieldCheck,
  Headphones,
  Award,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function CustomerHome() {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();

  const outletContext = useOutletContext() || {};
  const setIsCartOpen = outletContext.setIsCartOpen || (() => {});

  const [addedToast, setAddedToast] = useState(null);

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

  const totalItemsCount = cart ? cart.reduce((sum, item) => sum + item.qty, 0) : 0;

  const handleAddItem = (dish) => {
    addToCart({ id: dish.id, name: dish.name, price: Number(dish.price), image: dish.image });

    setAddedToast({
      itemName: dish.name,
      totalItems: totalItemsCount + 1,
    });

    setTimeout(() => {
      setAddedToast(null);
    }, 4000);
  };

  return (
    <div className="p-6 space-y-8 max-w-[1700px] mx-auto relative font-sans text-gray-900 dark:text-white">

      {/* ADDED ITEM TOAST */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-40 bg-[#0B1426] text-white p-4 rounded-2xl shadow-2xl border border-emerald-500/30 flex items-center gap-4 max-w-sm">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
            <ShoppingBag size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <h5 className="font-extrabold text-xs text-white truncate">{addedToast.itemName} added!</h5>
            <p className="text-[11px] text-emerald-400 font-bold">{addedToast.totalItems} items in cart</p>
          </div>
          <button
            onClick={() => {
              setIsCartOpen(true);
              setAddedToast(null);
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-3 py-2 rounded-xl transition-all shrink-0 cursor-pointer shadow-xs"
          >
            Go to My Cart
          </button>
          <button onClick={() => setAddedToast(null)} className="text-gray-400 hover:text-white cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* MAIN FEED CONTENT */}
      <div className="space-y-8">

        {/* Banner */}
        <div className="relative bg-[#0D1813] text-white rounded-3xl p-8 overflow-hidden shadow-sm flex items-center min-h-[220px]">
          <div className="relative z-10 max-w-xs space-y-3">
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              Delicious food, delivered <span className="text-emerald-400">to you</span>
            </h2>
            <p className="text-xs text-gray-300">Order your favorite meals from our wide range of tasty dishes.</p>
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => navigate('/menu')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                Order Now <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate('/offers')} className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer">
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
            <button onClick={() => navigate('/categories')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-7 gap-3">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate('/menu')}
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
            <button onClick={() => navigate('/menu')} className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer">View All</button>
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
                    onClick={() => handleAddItem(dish)}
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
    </div>
  );
}