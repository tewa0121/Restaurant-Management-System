// src/pages/manager/MenuManagement.jsx
import React, { useState } from 'react';
import { UtensilsCrossed, Plus, Search, Edit3, Trash2, X, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import useMenuManagement from '../../hooks/useMenuManagement';

const EMPTY_FORM = { name: '', categoryId: '', price: '', description: '', available: true };

export default function MenuManagement() {
  // All data and all server calls come from the hook (src/hooks/useMenuManagement.js)
  const {
    items: menuItems,
    categories,
    loading,
    loadError,
    saving,
    notice,
    clearNotice,
    reload,
    createItem,
    updateItem,
    deleteItem,
  } = useMenuManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // One form object (name, categoryId, price, description, available)
  const [form, setForm] = useState(EMPTY_FORM);
  const setField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const categoryTabs = ['all', ...categories.map((c) => c.name)];

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    clearNotice();
    // the first real category is pre-selected
    setForm({ ...EMPTY_FORM, categoryId: categories[0] ? categories[0].id : '' });
    setIsAddOpen(true);
  };

  // The popup closes ONLY if the server accepted the dish
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || form.price === '' || !form.categoryId) return;
    const ok = await createItem(form);
    if (ok) setIsAddOpen(false);
  };

  const handleOpenEdit = (item) => {
    clearNotice();
    setCurrentItem(item);
    setForm({
      name: item.name || '',
      categoryId: item.categoryId ?? '',
      price: String(item.price),
      description: item.description || '',
      available: item.available,
    });
    setIsEditOpen(true);
  };

  const handleEditItem = async (e) => {
    e.preventDefault();
    if (!currentItem) return;
    const ok = await updateItem(currentItem.id, form);
    if (ok) {
      setIsEditOpen(false);
      setCurrentItem(null);
    }
  };

  const confirmDelete = async () => {
    if (!currentItem) return;
    const ok = await deleteItem(currentItem.id);
    if (ok) {
      setIsDeleteOpen(false);
      setCurrentItem(null);
    }
  };

  const anyModalOpen = isAddOpen || isEditOpen || isDeleteOpen;

  // The server's reason when a save is refused (duplicate name, bad price...), shown inside the popup
  const ErrorInModal = () =>
    notice && notice.type === 'error' ? (
      <div role="alert" className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold">
        {notice.text}
      </div>
    ) : null;

  const inputClass =
    'w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none';

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Header & Search/Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <UtensilsCrossed className="w-6 h-6 text-amber-500" /> Menu Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Create, edit, and organize restaurant dishes, pricing, and availability.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search dish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            {categoryTabs.map((cat) => (
              <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleOpenAdd}
            disabled={loading || categories.length === 0}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Success / error message from the server (errors inside a popup are shown there instead) */}
      {notice && !anyModalOpen && (
        <div
          role="alert"
          className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold border ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-rose-50 text-rose-700 border-rose-100'
          }`}
        >
          <span>{notice.text}</span>
          <button type="button" onClick={clearNotice} className="ml-3 cursor-pointer" aria-label="Close message">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Could not load */}
      {loadError && (
        <div role="alert" className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100">
          <span>{loadError}</span>
          <button type="button" onClick={reload} className="px-3 py-1 bg-rose-600 text-white rounded-lg cursor-pointer">Retry</button>
        </div>
      )}

      {!loading && !loadError && categories.length === 0 && (
        <div className="p-3 rounded-xl text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-100">
          There are no categories yet, so dishes cannot be added. Create a category first.
        </div>
      )}

      {/* Menu Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">Loading menu...</div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 text-xs">
            No menu items found. Click "Add Item" to create one.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                    {item.category || 'Uncategorized'}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.available ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {item.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-sm pt-1">{item.name}</h3>
                <p className="text-[11px] text-slate-400 line-clamp-2">{item.description || 'Delicious freshly prepared specialty dish.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <span className="text-sm font-black text-emerald-600">{formatCurrency(item.price)}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Edit Item"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { clearNotice(); setCurrentItem(item); setIsDeleteOpen(true); }}
                    className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && currentItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete "{currentItem.name}"?</h3>
            </div>
            <p className="text-slate-500">
              Are you sure you want to remove this menu item? A dish that was ordered before is hidden instead, so old bills stay correct.
            </p>
            <ErrorInModal />
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500 cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={saving}
                className="px-4 py-1.5 bg-rose-600 disabled:opacity-60 text-white rounded-xl font-semibold cursor-pointer"
              >
                {saving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Menu Item</h3>
              <button type="button" onClick={() => setIsAddOpen(false)} aria-label="Close"><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <ErrorInModal />
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Item Name</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} required placeholder="e.g. Grilled Salmon" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Category</label>
                  <select required value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className={inputClass}>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Price ($)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} required placeholder="18.50" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows="3" placeholder="Short description of ingredients or preparation..." className={`${inputClass} resize-none`} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="add-available" checked={form.available} onChange={(e) => setField('available', e.target.checked)} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                <label htmlFor="add-available" className="text-slate-700 dark:text-slate-300 font-medium">Item is currently available</label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 rounded-xl text-slate-500 cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-600 disabled:opacity-60 text-white rounded-xl font-semibold cursor-pointer">
                  {saving ? 'Saving...' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {isEditOpen && currentItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Edit Menu Item</h3>
              <button type="button" onClick={() => setIsEditOpen(false)} aria-label="Close"><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <ErrorInModal />
            <form onSubmit={handleEditItem} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Item Name</label>
                <input type="text" value={form.name} onChange={(e) => setField('name', e.target.value)} required className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Category</label>
                  <select required value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className={inputClass}>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Price ($)</label>
                  <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setField('price', e.target.value)} required className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} rows="3" className={`${inputClass} resize-none`} />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <input type="checkbox" id="edit-available" checked={form.available} onChange={(e) => setField('available', e.target.checked)} className="rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                <label htmlFor="edit-available" className="text-slate-700 dark:text-slate-300 font-medium">Item is currently available</label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl text-slate-500 cursor-pointer">Cancel</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-600 disabled:opacity-60 text-white rounded-xl font-semibold cursor-pointer">
                  {saving ? 'Saving...' : 'Update Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}