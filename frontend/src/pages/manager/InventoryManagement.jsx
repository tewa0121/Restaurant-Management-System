import React, { useEffect, useState } from 'react';
import { PackageCheck, Plus, Search, Trash2, X } from 'lucide-react';
import inventoryService from '../../services/inventoryService';

export default function InventoryManagement() {
  const [ingredients, setIngredients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    currentStock: '0',
    minStockLevel: '5',
    costPerUnit: '0',
  });

  const loadInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const list = await inventoryService.getInventory({ limit: 200 });
      setIngredients(list);
    } catch (err) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.unit.trim()) return;
    setSaving(true);
    setError('');
    try {
      await inventoryService.createIngredient({
        name: formData.name.trim(),
        unit: formData.unit.trim(),
        currentStock: Math.max(0, Number(formData.currentStock) || 0),
        minStockLevel: Math.max(0, Number(formData.minStockLevel) || 0),
        costPerUnit: Math.max(0, Number(formData.costPerUnit) || 0),
      });
      setIsAddOpen(false);
      setFormData({
        name: '',
        unit: 'kg',
        currentStock: '0',
        minStockLevel: '5',
        costPerUnit: '0',
      });
      await loadInventory();
    } catch (err) {
      setError(err.message || 'Failed to create ingredient.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ingredient?')) return;
    setError('');
    try {
      await inventoryService.deleteIngredient(id);
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete ingredient.');
    }
  };

  const filtered = ingredients.filter((ing) =>
    String(ing.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-emerald-600" /> Inventory Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track ingredients, stock levels, and minimum stock thresholds.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search ingredient..."
              className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> <span>Add Ingredient</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Ingredient</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Unit</th>
              <th className="p-4">Min Stock</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading inventory...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No ingredients found.
                </td>
              </tr>
            ) : (
              filtered.map((ing) => {
                const stock = Number(ing.currentStock ?? ing.current_stock ?? ing.quantity ?? 0);
                const minStock = Number(
                  ing.minStockLevel ?? ing.min_stock_level ?? ing.reorderLevel ?? ing.reorder_level ?? 0
                );
                return (
                  <tr key={ing.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-bold text-gray-900">{ing.name}</td>
                    <td
                      className={`p-4 font-extrabold ${
                        stock <= minStock ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {stock}
                    </td>
                    <td className="p-4 text-gray-600">{ing.unit || 'unit'}</td>
                    <td className="p-4 text-gray-600">{minStock}</td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(ing.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-extrabold uppercase">Add Ingredient</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">NAME</label>
                <input
                  type="text"
                  required
                  minLength={2}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">CURRENT STOCK</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">UNIT</label>
                  <input
                    type="text"
                    required
                    minLength={1}
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">MIN STOCK LEVEL</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">COST PER UNIT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold cursor-pointer"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}