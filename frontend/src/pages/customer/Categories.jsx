import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATHS } from '../../utils/paths';

export default function Categories() {
  const navigate = useNavigate();

  // TEMPORARY demo data (item counts are fake). Step 2 loads these from
  // GET /api/menu/categories and passes the chosen category to the menu page.
  const categories = [
    { id: 'breakfast', name: 'Breakfast', icon: '🥞', items: '12 items', desc: 'Delicious morning starters & pancakes' },
    { id: 'lunch', name: 'Lunch', icon: '🍲', items: '24 items', desc: 'Hearty bowls, pastas & sandwiches' },
    { id: 'dinner', name: 'Dinner', icon: '🍖', items: '18 items', desc: 'Sizzling steaks, biryani & pizzas' },
    { id: 'appetizers', name: 'Appetizers', icon: '🧆', items: '15 items', desc: 'Crispy sides & finger foods' },
    { id: 'drinks', name: 'Drinks', icon: '🍹', items: '10 items', desc: 'Fresh juices, smoothies & sodas' },
    { id: 'desserts', name: 'Desserts', icon: '🍰', items: '14 items', desc: 'Lava cakes, pies & ice creams' },
    { id: 'salads', name: 'Salads', icon: '🥗', items: '8 items', desc: 'Healthy green bowls & dressings' },
  ];

  return (
    <div className="p-6 space-y-5 pb-8 text-gray-900 dark:text-white">
      <div>
        <h1 className="text-xl font-bold">Food Categories</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Browse food by your favorite meal categories</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => navigate(PATHS.menu)}
            className="text-left bg-white dark:bg-[#0B1426] rounded-2xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
          >
            <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-gray-800 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
              {cat.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm">{cat.name}</h3>
              <p className="text-[10px] text-emerald-600 font-bold mb-1">{cat.items}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">{cat.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}