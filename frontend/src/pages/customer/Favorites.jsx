import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { PATHS } from '../../utils/paths';

// TEMPORARY demo data. IDs match the dishes on the Home page so the same
// dish is never two different cart lines. Step 3 uses the backend
// favorites API instead.
const INITIAL_FAVORITES = [
  { id: 'dish-1', name: 'Grilled Chicken with Veggies', price: 12.99, image: '/assets/food-placeholders/food-grilled-chicken.png' },
  { id: 'dish-2', name: 'Beef Burger with Fries', price: 10.99, image: '/assets/food-placeholders/food-burger-fries.png' },
  { id: 'dish-3', name: 'Margherita Pizza', price: 11.99, image: '/assets/food-placeholders/food-pizza.png' },
];

const FALLBACK_IMG = '/assets/food-placeholders/food-burger.png';

export default function Favorites() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [favoriteList, setFavoriteList] = useState(INITIAL_FAVORITES);

  return (
    <div className="p-6 space-y-5 pb-8 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-xl font-bold">Saved Favorites</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Quickly reorder your favorite meals</p>
      </div>

      {favoriteList.length === 0 ? (
        <div className="bg-white dark:bg-[#0B1426] rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-800 text-gray-400 space-y-3">
          <Heart size={40} className="mx-auto opacity-30" />
          <p className="text-xs font-semibold">You have no favorites yet</p>
          <button
            onClick={() => navigate(PATHS.menu)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteList.map((dish) => (
            <div
              key={dish.id}
              className="bg-white dark:bg-[#0B1426] rounded-2xl border border-gray-100 dark:border-gray-800 p-3 flex flex-col justify-between"
            >
              <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                />
                <button
                  onClick={() => setFavoriteList((prev) => prev.filter((i) => i.id !== dish.id))}
                  aria-label={`Remove ${dish.name} from favorites`}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-500 cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <h3 className="font-bold text-xs truncate">{dish.name}</h3>
              <div className="flex justify-between items-center mt-2 border-t border-gray-100 dark:border-gray-800 pt-2">
                <span className="font-bold text-xs">${dish.price.toFixed(2)}</span>
                <button
                  onClick={() =>
                    addToCart({ id: dish.id, name: dish.name, price: dish.price, image: dish.image })
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  Add <Plus size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}