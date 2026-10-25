// src/pages/manager/InventoryManagement.jsx
import React, { useState } from 'react';
import { PackageCheck, Plus, Search, AlertTriangle, Edit3, Trash2, X } from 'lucide-react';
import { mockDatabase } from '../../data/mockData';

export default function InventoryManagement() {
  const [ingredients, setIngredients] = useState(mockDatabase.ingredients || []);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentIng, setCurrentIng] = useState(null);

  // Form fields
  const [name, setName] = useState('');
  const [currentStock, setCurrentStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [unit, setUnit] = useState('kg');

  const filteredIngredients = ingredients.filter(i => 
    (i.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const newIng = {
      id: Date.now(),
      name,
      current_stock: parseFloat(currentStock) || 0,
      min_stock_level: parseFloat(minStock) || 0,
      unit
    };
    setIngredients([newIng, ...ingredients]);
    setIsAddOpen(false);
    setName('');
    setCurrentStock('');
    setMinStock('');
  };

  const handleOpenEdit = (ing) => {
    setCurrentIng(ing);
    setName(ing.name || '');
    setCurrentStock(ing.current_stock?.toString() || '');
    setMinStock(ing.min_stock_level?.toString() || '');
    setUnit(ing.unit || 'kg');
    setIsEditOpen(true);
  };

  const handleEditIngredient = (e) => {
    e.preventDefault();
    if (!currentIng) return;
    setIngredients(ingredients.map(i => i.id === currentIng.id ? {
      ...i,
      name,
      current_stock: parseFloat(currentStock) || 0,
      min_stock_level: parseFloat(minStock) || 0,
      unit
    } : i));
    setIsEditOpen(false);
    setCurrentIng(null);
  };

  const confirmDelete = () => {
    if (!currentIng) return;
    setIngredients(ingredients.filter(i => i.id !== currentIng.id));
    setIsDeleteOpen(false);
    setCurrentIng(null);
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900 min-h-screen">
      {/* Top Banner & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-indigo-500" /> Inventory Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track ingredients stock levels, minimum thresholds, and supplies.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search ingredient..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 dark:text-slate-200 focus:outline-none"
            />
          </div>
          <button 
            type="button"
            onClick={() => { setName(''); setCurrentStock(''); setMinStock(''); setIsAddOpen(true); }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Inventory Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/50 text-slate-400 border-b border-slate-200 dark:border-slate-700 text-[10px]">
                <th className="p-4 font-semibold">Ingredient Name</th>
                <th className="p-4 font-semibold">Current Stock</th>
                <th className="p-4 font-semibold">Minimum Threshold</th>
                <th className="p-4 font-semibold">Stock Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filteredIngredients.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">No inventory items found.</td>
                </tr>
              ) : (
                filteredIngredients.map((item) => {
                  const isLow = item.current_stock <= item.min_stock_level;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="p-4 font-bold text-slate-800 dark:text-white">{item.name}</td>
                      <td className="p-4 font-extrabold text-slate-700 dark:text-slate-200">{item.current_stock} {item.unit || 'kg'}</td>
                      <td className="p-4 text-slate-500">{item.min_stock_level} {item.unit || 'kg'}</td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 flex items-center gap-1 w-fit">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                            Sufficient
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right flex justify-end gap-2">
                        <button 
                          type="button"
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit Stock"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          type="button"
                          onClick={() => { setCurrentIng(item); setIsDeleteOpen(true); }}
                          className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors cursor-pointer"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteOpen && currentIng && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl text-xs">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-sm text-slate-800 dark:text-white">Delete "{currentIng.name}"?</h3>
            </div>
            <p className="text-slate-500">Are you sure you want to remove this ingredient from inventory? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-1.5 bg-rose-600 text-white rounded-xl font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Add New Inventory Item</h3>
              <button type="button" onClick={() => setIsAddOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddIngredient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Ingredient Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="e.g. Olive Oil"
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Current Stock</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={currentStock} 
                    onChange={(e) => setCurrentStock(e.target.value)} 
                    required 
                    placeholder="10"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Min Threshold</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={minStock} 
                    onChange={(e) => setMinStock(e.target.value)} 
                    required 
                    placeholder="2"
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Unit</label>
                <select 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="pcs">pcs</option>
                  <option value="packets">packets</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-semibold">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Inventory Item Modal */}
      {isEditOpen && currentIng && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 max-w-sm w-full space-y-4 shadow-xl">
            <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">Edit Stock Level</h3>
              <button type="button" onClick={() => setIsEditOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleEditIngredient} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-500 mb-1">Ingredient Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-500 mb-1">Current Stock</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={currentStock} 
                    onChange={(e) => setCurrentStock(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Min Threshold</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={minStock} 
                    onChange={(e) => setMinStock(e.target.value)} 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Unit</label>
                <select 
                  value={unit} 
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="pcs">pcs</option>
                  <option value="packets">packets</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-3 py-1.5 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-semibold">Update Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}