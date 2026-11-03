// src/pages/admin/MenuManagement.jsx
import React, { useState } from 'react';
import { Utensils, Plus, Trash2, Edit, X, Search } from 'lucide-react';

export default function MenuManagement() {
  const [menuItems, setMenuItems] = useState([
    { id: 1, name: 'Beef Burger with Fries', category: 'Food', price: '10.99', description: 'Juicy beef patty with crispy fries', available: true },
    { id: 2, name: 'Margherita Pizza', category: 'Food', price: '12.50', description: 'Classic cheese and tomato pizza', available: true },
    { id: 3, name: 'Iced Latte', category: 'Drinks', price: '4.50', description: 'Chilled espresso with fresh milk', available: false },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); // null = Create, object = Edit
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    price: '',
    description: '',
    available: true,
  });

  // Open modal for Adding New Item
  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Food', price: '', description: '', available: true });
    setIsModalOpen(true);
  };

  // Open modal for Editing Item
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      price: item.price,
      description: item.description,
      available: item.available,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create / Update)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    if (editingItem) {
      setMenuItems(menuItems.map(m => m.id === editingItem.id ? { ...m, ...formData } : m));
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
      };
      setMenuItems([newItem, ...menuItems]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Toggle availability directly from table
  const handleToggleAvailability = (id) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, available: !item.available } : item));
  };

  // Handle Delete with Confirmation
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from the menu?`)) {
      setMenuItems(menuItems.filter(m => m.id !== id));
    }
  };

  // Filter Items
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

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

        <div className="flex items-center space-x-2">
          {['All', 'Food', 'Drinks', 'Desserts', 'Offers'].map((cat) => (
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
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold text-gray-900 dark:text-white">{item.name}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400">{item.category}</td>
                    <td className="p-4 font-extrabold text-emerald-600 dark:text-emerald-400">${item.price}</td>
                    <td className="p-4 text-gray-500 dark:text-gray-400 max-w-xs truncate">{item.description}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition cursor-pointer ${
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
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
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
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                  >
                    <option value="Food">Food</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Desserts">Desserts</option>
                    <option value="Offers">Offers</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold block mb-1">PRICE ($)</label>
                  <input 
                    type="text" 
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg cursor-pointer"
                >
                  {editingItem ? 'Update Item' : 'Save Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}