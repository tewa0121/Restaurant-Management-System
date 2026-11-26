import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Check,
  ShoppingBag,
  X,
  ArrowUpDown,
  Clock,
  RotateCcw,
  Heart,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import menuService from '../../services/menuService';
import { getStoredUser } from '../../services/api';
import { PLACEHOLDER_IMAGES, resolveImageSrc, categoryOf } from '../../utils/menuImages';

export default function BrowseMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart = [], addToCart, formatMoney } = useCart();

  const isCustomer = String(getStoredUser()?.role || '').toLowerCase() === 'customer';

  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [selectedCategory, setSelectedCategory] = useState(location.state?.categoryName || 'All');
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
        const [menuRes, catRes, favRes] = await Promise.all([
          menuService.getMenuItems({ limit: 100 }),
          menuService.getCategories().catch(() => []),
          menuService.getFavorites().catch(() => []),
        ]);
        if (!active) return;
        setItems(Array.isArray(menuRes) ? menuRes : []);
        setCategories(Array.isArray(catRes) ? catRes : []);
        setFavoriteIds(new Set((Array.isArray(favRes) ? favRes : []).map((f) => String(f.id))));
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

  const categoryNames = useMemo(() => {
    const names = new Set(['All']);
    categories.forEach((c) => {
      const label = typeof c === 'string' ? c : c?.name;
      if (label) names.add(label);
    });
    items.forEach((m) => {
      const label = categoryOf(m);
      if (label) names.add(label);
    });
    return Array.from(names);
  }, [categories, items]);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter((item) => {
      const cat = categoryOf(item);
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
  }, [items, selectedCategory, search, sortBy]);

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
    addToCart({
      ...item,
      price: Number(item.price || 0),
      quantity,
      specialInstructions: notes || undefined,
      image: imgSrc,
    });
    setJustAddedId(item.id);
    setTimeout(() => {
      setJustAddedId((prev) => (prev === item.id ? null : prev));
    }, 1200);
  };

  const toggleFavorite = async (item) => {
    const key = String(item.id);
    const wasFavorite = favoriteIds.has(key);
    // optimistic update, roll back if the server refuses
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (wasFavorite) next.delete(key);
      else next.add(key);
      return next;
    });
    try {
      if (wasFavorite) await menuService.removeFavorite(item.id);
      else await menuService.addFavorite(item.id);
    } catch (err) {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (wasFavorite) next.add(key);
        else next.delete(key);
        return next;
      });
      setError(err.message || 'Could not update favorites.');
    }
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
              onClick={() => navigate('/customer/cart')}
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
      ) : items.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-500 font-semibold">
          The menu is empty right now. Please check back soon.
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
            const imgSrc = resolveImageSrc(item, idx);
            const fallbackSrc = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
            const inCartQty = getItemCartQty(item.id);
            const wasJustAdded = justAddedId === item.id;
            const isAvailable = item.isAvailable !== false && item.available !== false;
            const isFavorite = favoriteIds.has(String(item.id));
            const prep = item.preparationTime || item.preparation_time_minutes;

            return (
              <div
                key={item.id}
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
                    {isCustomer && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(item);
                        }}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        className="absolute top-2.5 left-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white shadow cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 ${isFavorite ? 'text-rose-500 fill-rose-500' : 'text-gray-500'}`}
                        />
                      </button>
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
                        {formatMoney(item.price)}
                      </span>
                    </div>

                    <p className="text-gray-500 line-clamp-2">{item.description || ''}</p>

                    {prep ? (
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-1">
                        <Clock className="w-3 h-3" />
                        <span>~{prep} min</span>
                      </div>
                    ) : null}
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
                  {formatMoney(activeItem.price)}
                </span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">
                  Special Instructions (optional)
                </label>
                <input
                  type="text"
                  maxLength={500}
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
                    onChange={(e) => setModalQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
                    className="w-16 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-center font-bold outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={activeItem.isAvailable === false || activeItem.available === false}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-extrabold cursor-pointer transition"
                >
                  Add to Cart ({formatMoney((Number(activeItem.price) || 0) * modalQty)})
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}