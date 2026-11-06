// src/pages/customer/Categories.jsx
// Real categories from the backend. Counts include only dishes a customer can order.
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import useCustomerMenu from '../../hooks/useCustomerMenu';

// The database stores no icon or blurb for a category, so they are looked up by name.
// A category the manager adds later still works: it gets the fallback icon and text.
const ICONS = [
  ['breakfast', '🥞'],
  ['lunch', '🍲'],
  ['dinner', '🍖'],
  ['appetizer', '🧆'],
  ['starter', '🧆'],
  ['drink', '🍹'],
  ['beverage', '🍹'],
  ['dessert', '🍰'],
  ['salad', '🥗'],
  ['pizza', '🍕'],
  ['burger', '🍔'],
  ['pasta', '🍝'],
];

const BLURBS = {
  breakfast: 'Delicious morning starters & pancakes',
  lunch: 'Hearty bowls, pastas & sandwiches',
  dinner: 'Sizzling steaks, biryani & pizzas',
  appetizers: 'Crispy sides & finger foods',
  drinks: 'Fresh juices, smoothies & sodas',
  desserts: 'Lava cakes, pies & ice creams',
  salads: 'Healthy green bowls & dressings',
};

const iconFor = (name) => {
  const n = String(name).toLowerCase();
  const hit = ICONS.find(([key]) => n.includes(key));
  return hit ? hit[1] : '🍽️';
};

const blurbFor = (name) =>
  BLURBS[String(name).toLowerCase()] || `Explore our ${name} selection`;

export default function Categories() {
  const navigate = useNavigate();
  const { items, categories, loading, error, reload } = useCustomerMenu();

  // Count the dishes a customer can actually order, per category.
  // Categories with no available dish are hidden.
  const cards = useMemo(() => {
    const counts = {};
    items.forEach((d) => {
      counts[d.categoryId] = (counts[d.categoryId] || 0) + 1;
    });
    return categories
      .filter((c) => c.active !== false && counts[c.id] > 0)
      .map((c) => ({ ...c, count: counts[c.id] }));
  }, [items, categories]);

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Food Categories</h1>
        <p className="text-xs text-gray-400">Browse food by your favorite meal categories</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={reload}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600 text-white rounded-lg cursor-pointer"
          >
            <RefreshCw size={12} /> Retry
          </button>
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && !error && cards.length === 0 && (
        <p className="py-12 text-center text-xs text-gray-400">
          No categories are available right now. Please check back soon.
        </p>
      )}

      {!loading && !error && cards.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((cat) => (
            <button
              type="button"
              key={cat.id}
              // Open Browse Menu with this category already selected
              onClick={() => navigate('/customer/menu', { state: { categoryId: cat.id } })}
              className="text-left bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {iconFor(cat.name)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-900">{cat.name}</h3>
                <p className="text-[10px] text-green-600 font-bold mb-1">
                  {cat.count} {cat.count === 1 ? 'item' : 'items'}
                </p>
                <p className="text-xs text-gray-400 leading-tight">{blurbFor(cat.name)}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}