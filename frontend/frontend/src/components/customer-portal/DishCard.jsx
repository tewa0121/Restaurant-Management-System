import React from 'react';
import { Plus, Star, Heart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function DishCard({ dish }) {
  const { addToCart } = useCart() || {};

  const item = dish || {
    id: 1,
    name: 'Special Doro Wat',
    category: 'Main Course',
    price: 18.50,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
    description: 'Slow-cooked traditional spiced chicken stew served with fresh injera.'
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col justify-between">
      
      {/* Dish Header / Image */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs text-slate-600 dark:text-slate-300 hover:text-rose-500 cursor-pointer shadow-xs">
          <Heart className="w-3.5 h-3.5" />
        </button>
        {item.rating && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-amber-400 text-[10px] font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {item.category}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">
            {item.name}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <span className="font-black text-slate-900 dark:text-white text-sm">
            ${Number(item.price).toFixed(2)}
          </span>
          <button
            onClick={() => addToCart && addToCart(item)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>
      </div>

    </div>
  );
}