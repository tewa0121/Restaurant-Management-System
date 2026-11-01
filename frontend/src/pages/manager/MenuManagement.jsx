// // src/pages/manager/MenuManagement.jsx
// import React, { useState } from 'react';
// import { UtensilsCrossed, Plus, Search, Edit3, Trash2, X, AlertTriangle } from 'lucide-react';
// import { mockDatabase } from '../../data/mockData';
// import { formatCurrency } from '../../utils/formatters';

// export default function MenuManagement() {
//   const [menuItems, setMenuItems] = useState(mockDatabase.menuItems || []);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCategory, setSelectedCategory] = useState('all');

//   // Modals state
//   const [isAddOpen, setIsAddOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
//   const [currentItem, setCurrentItem] = useState(null);

//   // Form states
//   const [name, setName] = useState('');
//   const [category, setCategory] = useState('Food');
//   const [price, setPrice] = useState('');
//   const [description, setDescription] = useState('');
//   const [isAvailable, setIsAvailable] = useState(true);

//   const categories = ['all', 'Food', 'Drinks', 'Desserts', 'Appetizers'];

//   const filteredItems = menuItems.filter(item => {
//     const matchesSearch = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
//     return matchesSearch && matchesCategory;
//   });

//   const handleOpenAdd = () => {
//     setName('');
//     setCategory('Food');
//     setPrice('');
//     setDescription('');
//     setIsAvailable(true);
//     setIsAddOpen(true);
//   };

//   const handleAddItem = (e) => {
//     e.preventDefault();
//     const newItem = {
//       id: Date.now(),
//       name,
//       category,
//       price: parseFloat(price) || 0,
//       description,
//       is_available: isAvailable
//     };
//     setMenuItems([newItem, ...menuItems]);
//     setIsAddOpen(false);
//   };

//   const handleOpenEdit = (item) => {
//     setCurrentItem(item);
//     setName(item.name || '');
//     setCategory(item.category || 'Food');
//     setPrice(item.price ? item.price.toString() : '');
//     setDescription(item.description || '');
//     setIsAvailable(item.is_available ?? true);
//     setIsEditOpen(true);
//   };

//   const handleEditItem = (e) => {
//     e.preventDefault();
//     if (!currentItem) return;
//     setMenuItems(menuItems.map(i => i.id === currentItem.id ? {
//       ...i,
//       name,
//       category,
//       price: parseFloat(price) || 0,
//       description,
//       is_available: isAvailable
//     } : i));
//     setIsEditOpen(false);
//     setCurrentItem(null);
//   };

//   const confirmDelete = () => {
//     if (!currentItem) return;
//     setMenuItems(menuItems.filter(i => i.id !== currentItem.id));
//     setIsDeleteOpen(false);
//     setCurrentItem(null);
//   };

//   return (
//     <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
//       {/* Top Header & Search/Filters */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
//             <UtensilsCrossed className="w-6 h-6 text-amber-500" /> Menu Management
//           </h1>
//           <p className="text-xs text-slate-500 dark:text-slate-400">
//             Create, edit, and organize restaurant dishes, pricing, and availability.
//           </p>
//         </div>
//         <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
//           <div className="relative flex-1 sm:w-60">
//             <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
//             <input
//               type="text"
//               placeholder="Search dish..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
//             />
//           </div>
//           <select
//             value={selectedCategory}
//             onChange={(e) => setSelectedCategory(e.target.value)}
//             className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
//           >
//             {categories.map(cat => (
//               <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>
//             ))}
//           </select>
//           <button
//             type="button"
//             onClick={handleOpenAdd}
//             className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-amber-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
//           >
//             <Plus className="w-4 h-4" /> Add Item
//           </button>
//         </div>
//       </div>

//       {/* Menu Grid Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//         {filteredItems.length === 0 ? (
//           <div className="col-span-full py-12 text-center text-slate-400 text-xs">
//             No menu items found. Click "Add Item" to create one.
//           </div>
//         ) : (
//           filteredItems.map((item) => (
//             <div
//               key={item.id}
//               className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow"
//             >
//               <div className="space-y-1.5">
//                 <div className="flex justify-between items-start">
//                   <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
//                     {item.category || 'Food'}
//                   </span>
//                   <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${item.is_available !== false ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
//                     {item.is_available !== false ? 'Available' : 'Unavailable'}
//                   </span>
//                 </div>
//                 <h3 className="font-extrabold text-slate-800 dark:text-white text-sm pt-1">{item.name}</h3>
//                 <p className="text-[11px] text-slate-400 line-clamp-2">{item.description || 'Delicious freshly prepared specialty dish.'}</p>
//               </div>

//               <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
//                 <span className="text-sm font-black text-emerald-600">{formatCurrency(item.price)}</span>
//                 <div className="flex items-center gap-1">
//                   <button
//                     type="button"
//                     onClick={() => handleOpenEdit(item)}
//                     className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
//                     title="Edit Item"
//                   >
//                     <Edit3 className="w-3.5 h-3.5" />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => { setCurrentItem(item); setIsDeleteOpen(true); }}
//                     className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
//                     title="Delete Item"
//                   >
//                     <Trash2 className="w-3.5 h-3.5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {isDeleteOpen && currentItem && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
//             <div className="flex items-center gap-3 text-rose-600">
//               <AlertTriangle className="w-6 h-6 shrink-0" />
//               <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete "{currentItem.name}"?</h3>
//             </div>
//             <p className="text-slate-500">Are you sure you want to remove this menu item? This action cannot be undone.</p>
//             <div className="flex justify-end gap-2 pt-2">
//               <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
//               <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Item Modal */}
//       {isAddOpen && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
//             <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
//               <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Menu Item</h3>
//               <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
//             </div>
//             <form onSubmit={handleAddItem} className="space-y-3 text-xs">
//               <div>
//                 <label className="block text-slate-500 mb-1">Item Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   placeholder="e.g. Grilled Salmon"
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-slate-500 mb-1">Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                   >
//                     <option value="Food">Food</option>
//                     <option value="Drinks">Drinks</option>
//                     <option value="Desserts">Desserts</option>
//                     <option value="Appetizers">Appetizers</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-slate-500 mb-1">Price ($)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     required
//                     placeholder="18.50"
//                     className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-slate-500 mb-1">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows="3"
//                   placeholder="Short description of ingredients or preparation..."
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none resize-none"
//                 />
//               </div>
//               <div className="flex items-center gap-2 pt-1">
//                 <input
//                   type="checkbox"
//                   id="add-available"
//                   checked={isAvailable}
//                   onChange={(e) => setIsAvailable(e.target.checked)}
//                   className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
//                 />
//                 <label htmlFor="add-available" className="text-slate-700 dark:text-slate-300 font-medium">Item is currently available</label>
//               </div>
//               <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
//                 <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
//                 <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold">Save Item</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Edit Item Modal */}
//       {isEditOpen && currentItem && (
//         <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//           <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-md w-full space-y-4 shadow-xl">
//             <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
//               <h3 className="font-bold text-slate-800 dark:text-white text-sm">Edit Menu Item</h3>
//               <button type="button" onClick={() => setIsEditOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
//             </div>
//             <form onSubmit={handleEditItem} className="space-y-3 text-xs">
//               <div>
//                 <label className="block text-slate-500 mb-1">Item Name</label>
//                 <input
//                   type="text"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   required
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <label className="block text-slate-500 mb-1">Category</label>
//                   <select
//                     value={category}
//                     onChange={(e) => setCategory(e.target.value)}
//                     className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                   >
//                     <option value="Food">Food</option>
//                     <option value="Drinks">Drinks</option>
//                     <option value="Desserts">Desserts</option>
//                     <option value="Appetizers">Appetizers</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-slate-500 mb-1">Price ($)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={price}
//                     onChange={(e) => setPrice(e.target.value)}
//                     required
//                     className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-slate-500 mb-1">Description</label>
//                 <textarea
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   rows="3"
//                   className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none resize-none"
//                 />
//               </div>
//               <div className="flex items-center gap-2 pt-1">
//                 <input
//                   type="checkbox"
//                   id="edit-available"
//                   checked={isAvailable}
//                   onChange={(e) => setIsAvailable(e.target.checked)}
//                   className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
//                 />
//                 <label htmlFor="edit-available" className="text-slate-700 dark:text-slate-300 font-medium">Item is currently available</label>
//               </div>
//               <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
//                 <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-2 rounded-xl text-slate-500">Cancel</button>
//                 <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold">Update Item</button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// src/pages/admin/MenuManagement.jsx
import React, { useState } from 'react';
import { Plus, Trash2, Edit, X, Search } from 'lucide-react';
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
    toggleAvailability,
    deleteItem,
  } = useMenuManagement();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = Create, object = Edit

  const [formData, setFormData] = useState(EMPTY_FORM);

  // Open modal for Adding New Item
  const handleOpenAdd = () => {
    clearNotice();
    setEditingItem(null);
    // the first real category is pre-selected
    setFormData({ ...EMPTY_FORM, categoryId: categories[0] ? categories[0].id : '' });
    setIsModalOpen(true);
  };

  // Open modal for Editing Item
  const handleOpenEdit = (item) => {
    clearNotice();
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId ?? '',
      price: String(item.price),
      description: item.description,
      available: item.available,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create / Update): the popup closes ONLY if the server accepted it
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || formData.price === '' || !formData.categoryId) return;

    const ok = editingItem ? await updateItem(editingItem.id, formData) : await createItem(formData);
    if (ok) {
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  // Handle Delete with Confirmation
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      deleteItem(id);
    }
  };

  // Filter Items
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filterTabs = ['All', ...categories.map((c) => c.name)];

  return (
    <div className="space-y-6 font-sans">

      {/* Header Section */}
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Menu Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage food items, pricing, availability, and categories.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          disabled={loading || categories.length === 0}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      {/* Success / error message from the server (errors inside the popup are shown there instead) */}
      {notice && !isModalOpen && (
        <div
          role="alert"
          className={`flex items-center justify-between p-3 rounded-xl text-xs font-semibold border ${
            notice.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
              : 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
          }`}
        >
          <span>{notice.text}</span>
          <button onClick={clearNotice} className="ml-3 cursor-pointer" aria-label="Close message"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Could not load */}
      {loadError && (
        <div role="alert" className="flex items-center justify-between p-3 rounded-xl text-xs font-semibold border bg-rose-50 text-rose-700 border-rose-100">
          <span>{loadError}</span>
          <button onClick={reload} className="px-3 py-1 bg-rose-600 text-white rounded-lg cursor-pointer">Retry</button>
        </div>
      )}

      {!loading && !loadError && categories.length === 0 && (
        <div className="p-3 rounded-xl text-xs font-semibold border bg-amber-50 text-amber-700 border-amber-100">
          There are no categories yet, so dishes cannot be added. Create a category first.
        </div>
      )}

      {/* Search & Filter Toolbar */}
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

        <div className="flex flex-wrap items-center gap-2">
          {filterTabs.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-gray-900 dark:bg-brand text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Table */}
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
                  <td colSpan="6" className="p-8 text-center text-gray-400">Loading menu...</td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{item.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{item.category}</td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">${item.price.toFixed(2)}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.description}</td>
                    <td className="p-4">
                      <button
                        onClick={() => toggleAvailability(item)}
                        disabled={saving}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer disabled:opacity-50 ${
                          item.available
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30'
                            : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/30'
                        }`}
                        title="Click to toggle availability"
                      >
                        {item.available ? '✓ Available' : '✕ Unavailable'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.name)}
                        disabled={saving}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition disabled:opacity-50"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-400">No menu items found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl shadow-2xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">{editingItem ? 'Edit Menu Item' : 'Add New Item'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* The server's reason when a save is refused (duplicate name, bad price...) */}
            {notice && notice.type === 'error' && (
              <div role="alert" className="p-2.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 font-semibold">
                {notice.text}
              </div>
            )}

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
                  <select
                    required
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
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

              {/* AVAILABILITY TOGGLE OPTION */}
              <div>
                <label className="block font-bold text-gray-700 dark:text-gray-300 mb-1">AVAILABILITY</label>
                <div className="flex items-center space-x-3 bg-gray-50 dark:bg-[#0b1d3a] p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                  <input
                    type="checkbox"
                    id="availableToggle"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="availableToggle" className="font-semibold text-gray-800 dark:text-white cursor-pointer select-none">
                    {formData.available ? 'Available for Ordering' : 'Currently Unavailable'}
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