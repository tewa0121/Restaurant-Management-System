import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus, Images } from 'lucide-react';
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

export default function Home() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const items = await menuService.getMenuItems({ limit: 12 });
        if (active) setFeatured(items);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu items.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const displayItems = featured.length > 0
    ? featured
    : PLACEHOLDER_IMAGES.map((src, idx) => ({
        id: `placeholder-${idx}`,
        name: FOOD_PLACEHOLDER_FILES[idx].replace(/\.(png|jpg|jpeg|webp)$/i, '').replace(/-/g, ' '),
        description: 'Signature dish from our kitchen.',
        price: 12.0 + idx,
        image: src,
      }));

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-xs pb-10">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome to the Restaurant</h1>
          <p className="text-gray-500 mt-1">Fresh dishes prepared daily.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/menu')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
        >
          <span>Browse Full Menu</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">
          Loading menu items...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((item, idx) => {
            const imgSrc = resolveImageSrc(item, idx);
            const fallbackSrc = PLACEHOLDER_IMAGES[idx % PLACEHOLDER_IMAGES.length];

            return (
              <div
                key={item.id || idx}
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
                  <div className="p-4">
                    <p className="font-extrabold text-sm text-gray-900 capitalize">{item.name}</p>
                    <p className="text-gray-500 mt-1 line-clamp-2">{item.description || ''}</p>
                  </div>
                </div>

                <div className="px-4 pb-4 flex items-center justify-between pt-2">
                  <span className="font-black text-emerald-600 text-sm">
                    ${Number(item.price || 0).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      addToCart({
                        ...item,
                        price: Number(item.price || 0),
                        image: imgSrc,
                      })
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-xl font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>Add</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* All 13 Local Placeholder Assets */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-black text-gray-900">
            Local Food Placeholders ({FOOD_PLACEHOLDER_FILES.length})
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {FOOD_PLACEHOLDER_FILES.map((fileName) => {
            const src = `/assets/food-placeholders/${fileName}`;
            return (
              <div
                key={fileName}
                className="border border-gray-100 rounded-xl overflow-hidden bg-gray-50"
              >
                <img
                  src={src}
                  alt={fileName}
                  className="w-full h-24 object-cover bg-gray-200"
                />
                <p className="p-2 text-[10px] font-semibold text-gray-700 truncate" title={fileName}>
                  {fileName}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}