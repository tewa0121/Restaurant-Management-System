import React from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { resolveImageSrc, categoryOf, PLACEHOLDER_IMAGES } from '../../utils/menuImages';

// Renders one real menu item (as returned by GET /menu/items). Needs a `dish` prop.
export default function DishCard({ dish, index = 0 }) {
  const { addToCart, formatMoney } = useCart();
  if (!dish) return null;

  const imgSrc = resolveImageSrc(dish, index);
  const fallbackSrc = PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
  const isAvailable = dish.isAvailable !== false && dish.available !== false;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden group hover:border-emerald-500/50 transition-all flex flex-col justify-between">
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgSrc}
          alt={dish.name}
          onError={(e) => {
            if (e.currentTarget.src !== window.location.origin + fallbackSrc) {
              e.currentTarget.src = fallbackSrc;
            }
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            {categoryOf(dish)}
          </span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1">{dish.name}</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {dish.description || ''}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-2">
          <span className="font-black text-slate-900 dark:text-white text-sm">
            {formatMoney(dish.price)}
          </span>
          <button
            type="button"
            disabled={!isAvailable}
            onClick={() => addToCart({ ...dish, quantity: 1, image: imgSrc })}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> {isAvailable ? 'Add' : 'Sold out'}
          </button>
        </div>
      </div>
    </div>
  );
}
