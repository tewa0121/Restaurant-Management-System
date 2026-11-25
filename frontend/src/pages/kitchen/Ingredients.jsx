import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Search, RefreshCw } from 'lucide-react';
import inventoryService from '../../services/inventoryService';

export default function Ingredients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadIngredients = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await inventoryService.getInventory({ limit: 200 });
      setIngredients(list);
    } catch (err) {
      setError(err.message || 'Failed to load kitchen ingredients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
  }, []);

  const filtered = ingredients.filter((i) =>
    String(i.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4 border-slate-200">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600" /> Kitchen Ingredients
          </h1>
          <p className="text-slate-500">Live ingredient stock levels from inventory.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredient..."
              className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl outline-none"
            />
          </div>
          <button type="button" onClick={loadIngredients} className="p-2 bg-slate-900 text-white rounded-xl cursor-pointer">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-semibold">{error}</div>}

      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Ingredient</th>
              <th className="p-4">Available Stock</th>
              <th className="p-4">Unit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="3" className="p-8 text-center text-slate-400">Loading ingredients...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="3" className="p-8 text-center text-slate-400">No ingredients found.</td></tr>
            ) : (
              filtered.map((ing) => (
                <tr key={ing.id} className="hover:bg-slate-50/70">
                  <td className="p-4 font-bold text-slate-900">{ing.name}</td>
                  <td className="p-4 font-extrabold text-emerald-600">{ing.currentStock ?? ing.current_stock ?? ing.quantity ?? 0}</td>
                  <td className="p-4 text-slate-600">{ing.unit || 'unit'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}