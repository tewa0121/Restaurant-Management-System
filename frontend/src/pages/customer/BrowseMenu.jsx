import React, { useState } from 'react';
import { Search, Star, Plus, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getCustomerPortalData } from '../../services/mockAdapter';

export default function BrowseMenu() {
  const data = getCustomerPortalData() || {};
  const dishes = data.popularDishes || [];
  const { addToCart } = useCart();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Appetizers', 'Drinks', 'Desserts', 'Salads'];

  const filteredDishes = dishes.filter(dish => {
    const matchesSearch = dish.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || dish.category === activeCategory || dish.category_id === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5 pb-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Browse Full Menu</h1>
          <p className="text-xs text-gray-400">Explore all our handcrafted dishes and drinks</p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-3 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search menu items..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat 
                ? 'bg-green-600 text-white shadow-sm' 
                : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredDishes.map((dish) => (
          <div key={dish.id || dish.name} className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div className="relative h-32 w-full rounded-xl overflow-hidden bg-gray-100 mb-2.5">
              <img src={dish.image_url || '/assets/food-placeholders/food-healthy-bowl.png'} alt={dish.name} className="w-full h-full object-cover" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-xs truncate">{dish.name}</h3>
              <div className="flex items-center gap-1 mt-1 mb-2">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-800">{dish.rating || 4.7}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-50 mt-2">
              <span className="font-extrabold text-gray-900 text-xs">${Number(dish.price).toFixed(2)}</span>
              <button 
                onClick={() => addToCart(dish)}
                className="bg-green-600 hover:bg-green-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                Add <Plus size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}