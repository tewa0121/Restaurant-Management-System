import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, X, Search } from 'lucide-react';
import menuService from '../../services/menuService';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    category: '',
    price: '',
    description: '',
    preparationTime: 15,
    imageUrl: '',
    isAvailable: true,
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [itemsData, catsData] = await Promise.all([
        menuService.getMenuItems({ limit: 200 }),
        menuService.getCategories({ includeInactive: true }),
      ]);
      setMenuItems(itemsData);
      setCategories(catsData);
      if (catsData.length > 0 && !formData.categoryId) {
        setFormData((prev) => ({
          ...prev,
          categoryId: catsData[0].id,
          category: catsData[0].name,
        }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load menu items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    const defaultCat = categories[0];
    setEditingItem(null);
    setFormData({
      name: '',
      categoryId: defaultCat ? defaultCat.id : '',
      category: defaultCat ? defaultCat.name : '',
      price: '',
      description: '',
      preparationTime: 15,
      imageUrl: '',
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      categoryId: item.categoryId ?? item.category_id ?? '',
      category: item.category || item.category_name || '',
      price: item.price ?? '',
      description: item.description || '',
      preparationTime: item.preparationTime ?? item.preparation_time_minutes ?? 15,
      imageUrl: item.imageUrl || item.image_url || '',
      isAvailable: Boolean(item.isAvailable ?? item.available ?? item.is_available),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.price === '') return;

    setSaving(true);
    setError('');
    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId ? Number(formData.categoryId) : undefined,
        category: formData.category ? formData.category.trim() : undefined,
        price: Number(formData.price),
        description: formData.description.trim(),
        preparationTime: Number(formData.preparationTime) || 0,
        ...(formData.imageUrl.trim() ? { imageUrl: formData.imageUrl.trim() } : {}),
        isAvailable: Boolean(formData.isAvailable),
      };

      if (editingItem) {
        await menuService.updateMenuItem(editingItem.id, payload);
      } else {
        await menuService.createMenuItem(payload);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch (err) {
      setError(err.message || 'Failed to save menu item.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailability = async (item) => {
    const currentAvail = Boolean(item.isAvailable ?? item.available ?? item.is_available);
    setError('');
    try {
      await menuService.setAvailability(item.id, !currentAvail);
      setMenuItems((prev) =>
        prev.map((m) =>
          m.id === item.id
            ? {
                ...m,
                isAvailable: !currentAvail,
                available: !currentAvail,
                is_available: !currentAvail,
              }
            : m
        )
      );
    } catch (err) {
      setError(err.message || 'Failed to update availability.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) return;
    setError('');
    try {
      await menuService.deleteMenuItem(id);
      setMenuItems((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete menu item.');
    }
  };

  const categoryFilterOptions = ['All', ...categories.map((c) => c.name)];

  const filteredItems = menuItems.filter((item) => {
    const itemName = String(item.name || '').toLowerCase();
    const itemDesc = String(item.description || '').toLowerCase();
    const itemCat = item.category || item.category_name || '';
    const matchesSearch =
      itemName.includes(searchTerm.toLowerCase()) ||
      itemDesc.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || itemCat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage food items, pricing, availability, and categories.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl text-xs outline-none text-gray-800 dark:text-gray-100"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {categoryFilterOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gray-900 dark:bg-emerald-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Description</th>
                <th className="p-4">Availability</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    Loading menu items...
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isAvail = Boolean(item.isAvailable ?? item.available ?? item.is_available);
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition"
                    >
                      <td className="p-4 font-bold text-gray-900 dark:text-white">{item.name}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">
                        {item.category || item.category_name || '-'}
                      </td>
                      <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                        ${Number(item.price || 0).toFixed(2)}
                      </td>
                      <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">
                        {item.description || '-'}
                      </td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleToggleAvailability(item)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
                            isAvail
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
                              : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
                          }`}
                          title="Click to toggle availability"
                        >
                          {isAvail ? '✓ Available' : '✕ Unavailable'}
                        </button>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                          title="Edit Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                          title="Delete Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">
                    No menu items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">
                {editingItem ? 'Edit Menu Item' : 'Add New Item'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">ITEM NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beef Burger with Fries"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold block mb-1">CATEGORY</label>
                  {categories.length > 0 ? (
                    <select
                      value={formData.categoryId}
                      onChange={(e) => {
                        const catId = e.target.value;
                        const found = categories.find((c) => String(c.id) === String(catId));
                        setFormData({
                          ...formData,
                          categoryId: catId,
                          category: found ? found.name : formData.category,
                        });
                      }}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Food"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                    />
                  )}
                </div>

                <div>
                  <label className="font-bold block mb-1">PRICE ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="10.99"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">DESCRIPTION</label>
                <textarea
                  rows="2"
                  placeholder="Brief description of ingredients..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">
                  AVAILABILITY
                </label>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-[#0b1d3a] p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    id="availableToggle"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label
                    htmlFor="availableToggle"
                    className="font-semibold text-gray-800 dark:text-white cursor-pointer select-none"
                  >
                    {formData.isAvailable ? 'Available for Ordering' : 'Currently Unavailable'}
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer text-gray-600 dark:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-bold shadow-lg cursor-pointer"
                >
                  {saving ? 'Saving...' : editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}