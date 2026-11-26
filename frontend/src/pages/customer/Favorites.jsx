import React, { useEffect, useState } from 'react';
import { Heart, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import menuService from '../../services/menuService';

export default function Favorites() {
  const { addToCart, formatMoney } = useCart();
  const [favoriteList, setFavoriteList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await menuService.getFavorites();
      setFavoriteList(list);
    } catch (err) {
      setError(err.message || 'Failed to load favorites.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (id) => {
    setError('');
    try {
      await menuService.removeFavorite(id);
      setFavoriteList((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to remove favorite.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500" /> Favorite Dishes
        </h1>
        <p className="text-xs text-gray-500 mt-1">Your saved dishes from the menu.</p>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          Loading favorites...
        </div>
      ) : favoriteList.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-xs text-gray-400">
          No favorite items saved yet. Tap the heart on a dish in the menu to save it here.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {favoriteList.map((item) => {
            const isAvailable = item.isAvailable !== false && item.available !== false;
            return (
              <div
                key={item.id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-extrabold text-sm text-gray-900">{item.name}</p>
                  <p className="font-bold text-emerald-600 mt-1">{formatMoney(item.price)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={!isAvailable}
                    onClick={() => addToCart({ ...item, price: Number(item.price || 0) })}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 disabled:opacity-50 text-white rounded-xl font-bold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> <span>{isAvailable ? 'Cart' : 'Unavailable'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Remove favorite"
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}