import React, { useState } from 'react';
import { Heart, Star, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function Favorites() {
  const { addToCart } = useCart();
  const [favoriteList, setFavoriteList] = useState([
    { id: 1, name: 'Grilled Chicken with Veggies', price: 12.99, rating: 4.7, image: '/assets/food-placeholders/food-grilled-chicken.png' },
    { id: 2, name: 'Beef Burger with Fries', price: 10.99, rating: 4.6, image: '/assets/food-placeholders/food-burger-fries.png' },
    { id: 3, name: 'Margherita Pizza', price: 11.99, rating: 4.8, image: '/assets/food-placeholders/food-pizza.png' },
  ]);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Saved Favorites</h1>
        <p className="text-xs text-gray-400">Quickly reorder your favorite meals</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {favoriteList.map((dish) => (
          <div key={dish.id} className="bg-white rounded-2xl border p-3 flex flex-col justify-between">
            <div className="relative h-32 w-full rounded-xl overflow-hidden mb-2">
              <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              <button onClick={() => setFavoriteList(prev => prev.filter(i => i.id !== dish.id))} className="absolute top-2 right-2 p-1 bg-white/90 rounded-full text-red-500">
                <Trash2 size={13} />
              </button>
            </div>
            <h3 className="font-bold text-xs truncate">{dish.name}</h3>
            <div className="flex justify-between items-center mt-2 border-t pt-2">
              <span className="font-bold text-xs">${dish.price.toFixed(2)}</span>
              <button onClick={() => addToCart({ ...dish, image_url: dish.image })} className="bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                Add <Plus size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}