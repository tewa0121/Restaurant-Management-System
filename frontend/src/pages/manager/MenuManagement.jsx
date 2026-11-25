import React, { useEffect, useState } from 'react';
import { UtensilsCrossed, Plus, Search, Trash2, X } from 'lucide-react';
import menuService from '../../services/menuService';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [conflictItem, setConflictItem] = useState(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    description: '',
  });

  const loadMenu = async () => {
    setLoading(true);
    setError('');
    setConflictItem(null);
    try {
      const [items, cats] = await Promise.all([
        menuService.getMenuItems({ limit: 200 }),
        menuService.getCategories().catch(() => []),
      ]);
      setMenuItems(items);
      setCategories(cats);
      if (cats.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: String(cats[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === '') return;
    setSaving(true);
    setError('');
    try {
      await menuService.createMenuItem({
        name: formData.name.trim(),
        price: Number(formData.price),
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        description: formData.description.trim() || undefined,
        isAvailable: true,
      });
      setIsAddOpen(false);
      setFormData({
        name: '',
        price: '',
        categoryId: categories[0] ? String(categories[0].id) : '',
        description: '',
      });
      await loadMenu();
    } catch (err) {
      setError(err.message || 'Failed to add menu item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.name}"?`)) return;
    setError('');
    setConflictItem(null);
    try {
      await menuService.deleteMenuItem(item.id);
      setMenuItems((prev) => prev.filter((it) => it.id !== item.id));
    } catch (err) {
      if (err?.status === 409) {
        setConflictItem(item);
        setError(
          err.message ||
            `"${item.name}" is used in existing orders and cannot be deleted. Mark it unavailable instead.`
        );
      } else {
        setError(err.message || 'Failed to delete menu item.');
      }
    }
  };

  const handleMarkUnavailable = async (item) => {
    setError('');
    try {
      await menuService.setAvailability(item.id, false);
      setMenuItems((prev) =>
        prev.map((it) =>
          it.id === item.id ? { ...it, isAvailable: false, available: false, is_available: false } : it
        )
      );
      setConflictItem(null);
    } catch (err) {
      setError(err.message || 'Failed to update availability.');
    }
  };

  const filtered = menuItems.filter((it) =>
    String(it.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-emerald-600" /> Menu Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Add, update, and manage restaurant menu dishes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search dish..."
              className="pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4" /> <span>Add Dish</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex flex-wrap items-center justify-between gap-2">
          <span>{error}</span>
          {conflictItem && (
            <button
              type="button"
              onClick={() => handleMarkUnavailable(conflictItem)}
              className="px-3 py-1 bg-rose-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
            >
              Mark Unavailable Instead
            </button>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Dish Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading menu items...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No dishes found.
                </td>
              </tr>
            ) : (
              filtered.map((it) => {
                const avail = Boolean(it.isAvailable ?? it.available ?? it.is_available ?? true);
                return (
                  <tr key={it.id} className="hover:bg-gray-50/70">
                    <td className="p-4 font-bold text-gray-900">{it.name}</td>
                    <td className="p-4 text-gray-600">{it.categoryName || it.category || '-'}</td>
                    <td className="p-4 font-extrabold text-emerald-600">
                      ${Number(it.price || 0).toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          avail ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {avail ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(it)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete dish"
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
              <h3 className="font-extrabold uppercase">Add Menu Item</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">DISH NAME</label>
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
                  <label className="font-bold block mb-1">PRICE ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">CATEGORY</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
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