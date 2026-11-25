import React, { useEffect, useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import menuService from '../../services/menuService';

const DEFAULT_FOOD_IMAGE = '/assets/food-placeholders/food-burger.png';

export default function BrowseMenu() {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([{ id: 'all', label: 'All Items' }]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function fetchMenu() {
      setLoading(true);
      setError('');
      try {
        const [itemsData, catsData] = await Promise.all([
          menuService.getMenuItems({ limit: 200 }),
          menuService.getCategories(),
        ]);
        if (!active) return;
        setMenuItems(itemsData);
        const mappedCats = [
          { id: 'all', label: 'All Items' },
          ...catsData.map((c) => ({
            id: String(c.id),
            slug: c.slug,
            name: c.name,
            label: c.name,
          })),
        ];
        setCategories(mappedCats);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu.');
      } finally {
        if (active) setLoading(false);
      }
    }
    fetchMenu();
    return () => {
      active = false;
    };
  }, []);

  const filteredItems = menuItems.filter((item) => {
    const isAvail = item.isAvailable ?? item.available ?? item.is_available ?? true;
    if (!isAvail) return false;

    const itemCatId = String(item.categoryId ?? item.category_id ?? '');
    const itemCatName = String(item.category || item.category_name || '').toLowerCase();
    const selectedObj = categories.find((c) => c.id === activeCategory);

    const matchesCategory =
      activeCategory === 'all' ||
      (selectedObj &&
        (itemCatId === String(selectedObj.id) ||
          itemCatName === String(selectedObj.name || '').toLowerCase()));

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      String(item.name || '').toLowerCase().includes(q) ||
      String(item.description || '').toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12 px-4 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Browse Menu</h1>
          <p className="text-xs text-gray-500 mt-1">
            Explore fresh dishes, drinks, and specials prepared for you.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-emerald-600"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading menu items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          No menu items match your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <div>
                <img
                  src={item.imageUrl || item.image_url || item.image || DEFAULT_FOOD_IMAGE}
                  alt={item.name}
                  onError={(e) => {
                    e.currentTarget.src = DEFAULT_FOOD_IMAGE;
                  }}
                  className="w-full h-44 object-cover bg-gray-100"
                />
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-sm text-gray-900">{item.name}</h3>
                    <span className="font-extrabold text-sm text-emerald-600">
                      ${Number(item.price || 0).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-semibold">
                    {item.category || item.category_name || 'Menu'}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {item.description || 'Freshly prepared restaurant specialty.'}
                  </p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      menuItemId: item.id,
                      name: item.name,
                      price: Number(item.price || 0),
                      image: item.imageUrl || item.image_url || DEFAULT_FOOD_IMAGE,
                    })
                  }
                  className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}