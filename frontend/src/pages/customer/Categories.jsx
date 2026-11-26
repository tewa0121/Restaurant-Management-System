import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import menuService from '../../services/menuService';

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const list = await menuService.getCategories();
        if (active) setCategories(list);
      } catch (err) {
        if (active) setError(err.message || 'Failed to load categories.');
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
    <div className="max-w-4xl mx-auto space-y-6 font-sans text-xs">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900">Menu Categories</h1>
        <p className="text-gray-500 mt-1">Browse dishes by category.</p>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">Loading categories...</div>
      ) : categories.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border text-center text-gray-400">No categories found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
          onClick={() => navigate('/customer/menu', { state: { categoryId: cat.id, categoryName: cat.name } })}
              className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm text-left hover:border-emerald-400 transition cursor-pointer"
            >
              <p className="font-extrabold text-sm text-gray-900">{cat.name}</p>
              <p className="text-gray-500 mt-1">{cat.description || 'Explore items in this category'}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}