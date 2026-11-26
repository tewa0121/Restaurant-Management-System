import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Utensils, Clock, Eye, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import menuService from '../../services/menuService';
import { PLACEHOLDER_IMAGES, resolveImageSrc, categoryOf } from '../../utils/menuImages';

export default function Home() {
  const navigate = useNavigate();
  const { formatMoney } = useCart();

  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [activeGroup, setActiveGroup] = useState('All');
  const [previewItem, setPreviewItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const items = await menuService.getMenuItems({ limit: 12 });
        if (active) setFeatured(Array.isArray(items) ? items : []);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu overview.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(() => {
    const set = new Set(['All']);
    featured.forEach((item) => {
      const cat = categoryOf(item);
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [featured]);

  const visibleItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    return featured.filter((item) => {
      const cat = categoryOf(item);
      const matchesGroup = activeGroup === 'All' || cat.toLowerCase() === activeGroup.toLowerCase();
      const matchesQuery =
        !q ||
        String(item?.name || '').toLowerCase().includes(q) ||
        String(item?.description || '').toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q);
      return matchesGroup && matchesQuery;
    });
  }, [featured, activeGroup, search]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans text-xs pb-12">
      {/* Overview Hero Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
            <Utensils className="w-3.5 h-3.5" />
            <span>Restaurant Menu Overview</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">Welcome to the Restaurant</h1>
          <p className="text-gray-500">Browse our featured dishes before ordering.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="button"
            onClick={() => navigate('/customer/menu')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer transition"
          >
            <span>Full Menu</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {groups.map((grp) => {
            const active = activeGroup === grp;
            return (
              <button
                key={grp}
                type="button"
                onClick={() => setActiveGroup(grp)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition ${
                  active
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {grp}
              </button>
            );
          })}
        </div>
        <span className="text-gray-400 font-semibold">
          Showing {visibleItems.length} dish{visibleItems.length === 1 ? '' : 'es'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {/* Overview Dishes Grid */}
      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">
          Loading menu overview...
        </div>
      ) : featured.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-500 font-semibold">
          The menu is empty right now. Please check back soon.
        </div>
      ) : visibleItems.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">
          No dishes match your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleItems.map((item, idx) => {
            const imgSrc = resolveImageSrc(item, idx);
            const fallbackSrc = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];
            const isAvailable = item.isAvailable !== false && item.available !== false;
            const prep = item.preparationTime || item.preparation_time_minutes;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <img
                    src={imgSrc}
                    alt={item.name || 'Menu dish'}
                    onError={(e) => {
                      if (e.currentTarget.src !== window.location.origin + fallbackSrc) {
                        e.currentTarget.src = fallbackSrc;
                      }
                    }}
                    className="w-full h-44 object-cover bg-gray-100"
                  />
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                        {categoryOf(item) || 'Dish'}
                      </span>
                      <span
                        className={`text-[10px] font-bold ${
                          isAvailable ? 'text-emerald-600' : 'text-rose-500'
                        }`}
                      >
                        {isAvailable ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    <p className="font-extrabold text-sm text-gray-900 capitalize">{item.name}</p>
                    <p className="text-gray-500 line-clamp-2">{item.description || ''}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 pt-2 flex items-center justify-between border-t border-gray-50">
                  <div>
                    <span className="font-black text-emerald-600 text-sm">{formatMoney(item.price)}</span>
                    {prep ? (
                      <span className="ml-2 inline-flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {prep}m
                      </span>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPreviewItem({ ...item, previewImage: imgSrc })}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Read-Only Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-xl border border-gray-100">
            <div className="relative">
              <img
                src={previewItem.previewImage}
                alt={previewItem.name}
                className="w-full h-52 object-cover bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="absolute top-3 right-3 p-1.5 bg-white/90 hover:bg-white rounded-full text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-black text-gray-900 capitalize">{previewItem.name}</h3>
                  <p className="text-gray-500 mt-1">{previewItem.description || ''}</p>
                </div>
                <span className="text-base font-black text-emerald-600">{formatMoney(previewItem.price)}</span>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewItem(null)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPreviewItem(null);
                    navigate('/customer/menu');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  Go to Full Menu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
