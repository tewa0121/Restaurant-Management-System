import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit, X } from 'lucide-react';
import inventoryService from '../../services/inventoryService';

export default function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    currentStock: '',
    minStockLevel: 5,
    costPerUnit: '',
  });

  const loadInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await inventoryService.getInventory({ limit: 200 });
      setInventory(data);
    } catch (err) {
      setError(err.message || 'Failed to load inventory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      unit: 'kg',
      currentStock: '',
      minStockLevel: 5,
      costPerUnit: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || item.item || '',
      unit: item.unit || 'kg',
      currentStock: item.currentStock ?? item.current_stock ?? '',
      minStockLevel: item.minStockLevel ?? item.min_stock_level ?? 5,
      costPerUnit: item.costPerUnit ?? item.cost_per_unit ?? '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: String(formData.name).trim(),
        unit: String(formData.unit || 'kg').trim(),
        currentStock: Number(formData.currentStock),
        minStockLevel: Number(formData.minStockLevel ?? 0),
        costPerUnit: Number(formData.costPerUnit ?? 0),
      };

      if (editingItem) {
        await inventoryService.updateIngredient(editingItem.id, payload);
      } else {
        await inventoryService.createIngredient(payload);
      }

      setIsModalOpen(false);
      setEditingItem(null);
      await loadInventory();
    } catch (err) {
      setError(err.message || 'Failed to save inventory item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from inventory?`)) return;
    setError('');
    try {
      await inventoryService.deleteIngredient(id);
      setInventory((prev) => prev.filter((inv) => inv.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete inventory item.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Inventory Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Track ingredient levels, low-stock alerts, and supply values.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stock Item</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
              <th className="p-4">Ingredient Name</th>
              <th className="p-4">Available Quantity</th>
              <th className="p-4">Unit Price</th>
              <th className="p-4">Stock Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  Loading inventory...
                </td>
              </tr>
            ) : inventory.length > 0 ? (
              inventory.map((inv) => {
                const stockVal = Number(inv.currentStock ?? inv.current_stock ?? 0);
                const minVal = Number(inv.minStockLevel ?? inv.min_stock_level ?? 0);
                const unitCost = Number(inv.costPerUnit ?? inv.cost_per_unit ?? 0);
                const isLow = Boolean(inv.isLow) || stockVal <= minVal;
                const statusText = inv.status || (stockVal <= 0 ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock');
                const itemName = inv.name || inv.item;

                return (
                  <tr key={inv.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                    <td className="p-4 font-bold flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center font-bold">
                        📦
                      </div>
                      <span>{itemName}</span>
                    </td>
                    <td className="p-4 font-extrabold">
                      {inv.quantity || `${stockVal} ${inv.unit || ''}`}
                    </td>
                    <td className="p-4 font-semibold text-emerald-600">
                      ${unitCost.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          isLow
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30'
                            : 'bg-emerald-50 text-emerald-600'
                        }`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(inv)}
                        className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(inv.id, itemName)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-400">
                  No inventory items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#122448] w-full max-w-md rounded-3xl p-6 space-y-4 text-xs text-gray-800 dark:text-white">
            <div className="flex justify-between items-center border-b pb-3 border-gray-100 dark:border-gray-700">
              <h3 className="font-extrabold uppercase">
                {editingItem ? 'Edit Ingredient' : 'Add Stock Item'}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="font-bold block mb-1">INGREDIENT NAME</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold block mb-1">STOCK QTY</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">UNIT</label>
                  <input
                    type="text"
                    required
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, L, pcs"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold block mb-1">COST / UNIT ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPerUnit}
                    onChange={(e) => setFormData({ ...formData, costPerUnit: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold block mb-1">MIN STOCK LEVEL</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.minStockLevel}
                  onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-emerald-600 disabled:opacity-60 text-white rounded-xl font-bold shadow-lg cursor-pointer"
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