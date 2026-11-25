import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Plus } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import menuService from '../../services/menuService';

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
        const items = await menuService.getMenuItems({ limit: 6 });
        if (active) setFeatured(items);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load featured dishes.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans text-xs">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome to the Restaurant</h1>
          <p className="text-gray-500 mt-1">Order fresh dishes for delivery or pickup.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/customer/browse-menu')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
        >
          <span>Browse Full Menu</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">Loading menu highlights...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((item) => (
            <div key={item.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-3">
              <div>
                <p className="font-extrabold text-sm text-gray-900">{item.name}</p>
                <p className="text-gray-500 mt-1 line-clamp-2">{item.description || ''}</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="font-black text-emerald-600">${Number(item.price || 0).toFixed(2)}</span>
                <button
                  type="button"
                  onClick={() => addToCart({ ...item, price: Number(item.price || 0) })}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-900 text-white rounded-xl font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> <span>Add</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}