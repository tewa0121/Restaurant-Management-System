import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Check,
  ShoppingBag,
  X,
  ArrowUpDown,
  Images,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import menuService from '../../services/menuService';

export const FOOD_PLACEHOLDER_FILES = [
  'food-biryani.png',
  'food-burger-fries.png',
  'food-burger.png',
  'food-chocolate-cake.png',
  'food-dessert.png',
  'food-grilled-chicken.png',
  'food-healthy-bowl.png',
  'food-juice.png',
  'food-pasta-alfredo.png',
  'food-pizza.png',
  'food-salad.png',
  'food-steak.png',
  'login.png',
];

export const PLACEHOLDER_IMAGES = FOOD_PLACEHOLDER_FILES.map(
  (file) => `/assets/food-placeholders/${file}`
);

const formatPlaceholderTitle = (fileName) =>
  fileName
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .replace(/[-_]+/g, ' ')
    .trim();

const resolveImageSrc = (item, index = 0) => {
  const raw = item?.imageUrl || item?.image_url || item?.image || '';
  if (raw && typeof raw === 'string' && raw.trim()) {
    const clean = raw.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('/')) {
      return clean;
    }
    return `/assets/food-placeholders/${clean.replace(/^\/+/, '')}`;
  }
  return PLACEHOLDER_IMAGES[index % PLACEHOLDER_IMAGES.length];
};

export default function BrowseMenu() {
  const navigate = useNavigate();
  const { cart = [], addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal & quick-add state
  const [activeItem, setActiveItem] = useState(null);
  const [modalQty, setModalQty] = useState(1);
  const [modalNotes, setModalNotes] = useState('');
  const [justAddedId, setJustAddedId] = useState(null);

  useEffect(() => {
    let active = true;
    async function loadMenu() {
      setLoading(true);
      setError('');
      try {
        const [menuRes, catRes] = await Promise.all([
          menuService.getMenuItems({ limit: 100 }),
          menuService.getCategories().catch(() => []),
        ]);
        if (!active) return;
        setItems(Array.isArray(menuRes) ? menuRes : []);
        setCategories(Array.isArray(catRes) ? catRes : []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu.');
      } finally {
        if (active) setLoading(false);
      }
    }
    loadMenu();
    return () => {
      active = false;
    };
  }, []);

  const menuList = useMemo(() => {
    if (items.length > 0) return items;
    return FOOD_PLACEHOLDER_FILES.filter((f) => f !== 'login.png').map((file, idx) => ({
      id: `placeholder-item-${idx + 1}`,
      name: formatPlaceholderTitle(file),
      description: 'Prepared fresh to order with quality ingredients.',
      categoryName: idx < 4 ? 'Mains' : idx < 8 ? 'Sides & Drinks' : 'Desserts & Bowls',
      preparationTime: 15 + (idx % 4) * 5,
      price: Number((9.5 + idx * 1.5).toFixed(2)),
      image: `/assets/food-placeholders/${file}`,
      isAvailable: true,
    }));
  }, [items]);

  const categoryNames = useMemo(() => {
    const names = new Set(['All']);
    categories.forEach((c) => {
      const label = typeof c === 'string' ? c : c?.name;
      if (label) names.add(label);
    });
    menuList.forEach((m) => {
      const label =
        m?.categoryName ||
        m?.category?.name ||
        (typeof m?.category === 'string' ? m.category : '');
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [categories, menuList]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = menuList.filter((item) => {
      const cat =
        item?.categoryName ||
        item?.category?.name ||
        (typeof item?.category === 'string' ? item.category : '') ||
        '';
      const matchesCategory =
        selectedCategory === 'All' || cat.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !q ||
        String(item?.name || '').toLowerCase().includes(q) ||
        String(item?.description || '').toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    }
    if (sortBy === 'price-desc') {
      return [...list].sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    }
    if (sortBy === 'name') {
      return [...list].sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
    }
    return list;
  }, [menuList, selectedCategory, search, sortBy]);

  const cartTotalCount = useMemo(() => {
    if (!Array.isArray(cart)) return 0;
    return cart.reduce((sum, entry) => sum + Number(entry.quantity || entry.qty || 1), 0);
  }, [cart]);

  const getItemCartQty = (itemId) => {
    if (!Array.isArray(cart)) return 0;
    const found = cart.find((c) => String(c.id) === String(itemId));
    return found ? Number(found.quantity || found.qty || 1) : 0;
  };

  const triggerAdd = (item, imgSrc, quantity = 1, notes = '') => {
    const id = item.id ?? item.name;
    addToCart({
      ...item,
      id,
      price: Number(item.price || 0),
      quantity,
      specialInstructions: notes || undefined,
      image: imgSrc,
    });
    setJustAddedId(id);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === id ? null : prev));
    }, 1200);
  };

  const openDetailsModal = (item, imgSrc) => {
    setActiveItem({ ...item, resolvedImage: imgSrc });
    setModalQty(1);
    setModalNotes('');
  };

  const handleModalAdd = (e) => {
    e.preventDefault();
    if (!activeItem) return;
    triggerAdd(activeItem, activeItem.resolvedImage, Math.max(1, Number(modalQty) || 1), modalNotes);
    setActiveItem(null);
  };

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearch('');
    setSortBy('default');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-xs pb-12">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-gray-900">Browse Menu</h1>
            <p className="text-gray-500">
              Search dishes, filter by category, customize items, and add to your order.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative flex-1 sm:w-56">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes..."
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
              />
            </div>

            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-gray-700 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="default">Sort: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cartTotalCount})</span>
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex flex-wrap gap-2">
            {categoryNames.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {(selectedCategory !== 'All' || search.trim() !== '' || sortBy !== 'default') && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-800 font-semibold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {/* Menu Grid */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">
          Loading menu items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center space-y-3">
          <p className="text-gray-500 font-semibold">No dishes match your current filter.</p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl font-bold cursor-pointer"
          >
            Show All Dishes
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item, idx) => {
            const id = item.id ?? idx;
            const imgSrc = resolveImageSrc(item, idx);
            const fallbackSrc = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
            const inCartQty = getItemCartQty(id);
            const wasJustAdded = justAddedId === id;
            const isAvailable = item.isAvailable !== false && item.available !== false;

            return (
              <div
                key={id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-200 transition"
              >
                <div>
                  <div
                    onClick={() => openDetailsModal(item, imgSrc)}
                    className="relative cursor-pointer group overflow-hidden bg-gray-100"
                  >
                    <img
                      src={imgSrc}
                      alt={item.name || 'Menu dish'}
                      onError={(e) => {
                        if (e.currentTarget.src !== window.location.origin + fallbackSrc) {
                          e.currentTarget.src = fallbackSrc;
                        }
                      }}
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {inCartQty > 0 && (
                      <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold shadow">
                        {inCartQty} in cart
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => openDetailsModal(item, imgSrc)}
                        className="text-left font-extrabold text-sm text-gray-900 hover:text-emerald-700 capitalize cursor-pointer"
                      >
                        {item.name}
                      </button>
                      <span className="font-black text-emerald-600 text-sm shrink-0">
                        ${Number(item.price || 0).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-gray-500 line-clamp-2">{item.description || ''}</p>

                    {(item.preparationTime || item.preparation_time) && (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>~{item.preparationTime || item.preparation_time} min</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openDetailsModal(item, imgSrc)}
                    className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer transition"
                  >
                    Customize
                  </button>
                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => triggerAdd(item, imgSrc, 1)}
                    className="flex-1 inline-flex items-center justify-center gap-1 py-2 bg-gray-900 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer transition"
                  >
                    {wasJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAvailable ? 'Add' : 'Unavailable'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All 13 Local Placeholder Assets with Quick Search & Add */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Images className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-black text-gray-900">
              Placeholder Assets ({FOOD_PLACEHOLDER_FILES.length})
            </h2>
          </div>
          <span className="text-[11px] text-gray-400">
            Click a dish image to filter or quick-add
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FOOD_PLACEHOLDER_FILES.map((fileName, idx) => {
            const src = `/assets/food-placeholders/${fileName}`;
            const title = formatPlaceholderTitle(fileName);
            const isFood = fileName.startsWith('food-');

            return (
              <div
                key={fileName}
                className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50 flex flex-col justify-between"
              >
                <div>
                  <img
                    src={src}
                    alt={fileName}
                    onClick={() => setSearch(isFood ? title : '')}
                    className="w-full h-24 object-cover bg-gray-200 cursor-pointer hover:opacity-90"
                  />
                  <p
                    className="px-2 pt-1.5 text-[10px] font-bold text-gray-700 truncate"
                    title={fileName}
                  >
                    {fileName}
                  </p>
                </div>
                {isFood && (
                  <div className="p-2 pt-1">
                    <button
                      type="button"
                      onClick={() =>
                        triggerAdd(
                          {
                            id: `asset-${fileName}`,
                            name: title,
                            price: Number((10 + idx).toFixed(2)),
                            description: `Quick item from ${fileName}`,
                          },
                          src,
                          1
                        )
                      }
                      className="w-full py-1 bg-white hover:bg-emerald-50 border border-gray-200 text-gray-800 rounded-lg text-[10px] font-bold cursor-pointer"
                    >
                      + Add ${(10 + idx).toFixed(2)}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Item Details & Notes Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleModalAdd}
            className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-gray-100"
          >
            <div className="relative">
              <img
                src={activeItem.resolvedImage}
                alt={activeItem.name}
                className="w-full h-48 object-cover bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-gray-900 capitalize">
                    {activeItem.name}
                  </h3>
                  <p className="text-gray-500 mt-0.5">{activeItem.description || ''}</p>
                </div>
                <span className="text-base font-black text-emerald-600">
                  ${Number(activeItem.price || 0).toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Special Instructions (optional)
                </label>
                <input
                  type="text"
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  placeholder="e.g., Less spicy, no onions..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Qty:</span>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={modalQty}
                    onChange={(e) => setModalQty(Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-extrabold cursor-pointer transition"
                >
                  Add to Cart (${(Number(activeItem.price || 0) * modalQty).toFixed(2)})
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}