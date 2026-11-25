import React, { useEffect, useState } from 'react';
import { Plus, Edit, X } from 'lucide-react';
import orderService from '../../services/orderService';
import menuService from '../../services/menuService';
import tableService from '../../services/tableService';

const STATUS_LABELS = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const ALLOWED_TRANSITIONS = {
  pending: ['pending', 'preparing', 'cancelled'],
  preparing: ['preparing', 'ready', 'cancelled'],
  ready: ['ready', 'served', 'completed', 'preparing', 'cancelled'],
  served: ['served', 'completed'],
  completed: ['completed'],
  cancelled: ['cancelled'],
};

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    orderType: 'dine_in',
    tableId: '',
    menuItemId: '',
    quantity: 1,
    status: 'pending',
    notes: '',
  });

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersData, menuData, tablesData] = await Promise.all([
        orderService.getOrders({ limit: 100 }),
        menuService.getMenuItems({ limit: 200 }),
        tableService.getTables(),
      ]);
      setOrders(ordersData);
      setMenuItems(menuData);
      setTables(tablesData);
      if (menuData.length > 0 && !formData.menuItemId) {
        setFormData((prev) => ({ ...prev, menuItemId: String(menuData[0].id) }));
      }
      if (tablesData.length > 0 && !formData.tableId) {
        setFormData((prev) => ({ ...prev, tableId: String(tablesData[0].id) }));
      }
    } catch (err) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleOpenAdd = () => {
    setEditingOrder(null);
    setFormData({
      customerName: '',
      orderType: 'dine_in',
      tableId: tables[0] ? String(tables[0].id) : '',
      menuItemId: menuItems[0] ? String(menuItems[0].id) : '',
      quantity: 1,
      status: 'pending',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ord) => {
    const currentStatus = String(ord.status || 'pending').toLowerCase();
    setEditingOrder(ord);
    setFormData({
      customerName: ord.customerName || ord.customer_name || '',
      orderType: ord.orderType || ord.order_type || 'dine_in',
      tableId: ord.tableId || ord.table_id ? String(ord.tableId || ord.table_id) : '',
      menuItemId: '',
      quantity: 1,
      status: currentStatus,
      notes: ord.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingOrder) {
        await orderService.updateOrderStatus(editingOrder.id, formData.status);
      } else {
        const selectedMenuId = Number(formData.menuItemId);
        if (!selectedMenuId) {
          throw new Error('Please select a menu item.');
        }

        const payload = {
          orderType: formData.orderType,
          customerName: formData.customerName.trim() || undefined,
          tableId: formData.orderType === 'dine_in' && formData.tableId ? Number(formData.tableId) : undefined,
          notes: formData.notes.trim() || undefined,
          items: [
            {
              menuItemId: selectedMenuId,
              quantity: Math.max(1, Number(formData.quantity) || 1),
            },
          ],
        };

        await orderService.createOrder(payload);
      }

      setIsModalOpen(false);
      setEditingOrder(null);
      await loadOrders();
    } catch (err) {
      setError(err.message || 'Failed to save order.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    const key = String(status || '').toLowerCase();
    if (key === 'completed' || key === 'served') {
      return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400';
    }
    if (key === 'preparing' || key === 'ready') {
      return 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400';
    }
    if (key === 'cancelled') {
      return 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400';
    }
    return 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400';
  };

  const editingCurrentStatus = String(editingOrder?.status || 'pending').toLowerCase();
  const allowedStatusOptions = (ALLOWED_TRANSITIONS[editingCurrentStatus] || [editingCurrentStatus]).map(
    (value) => ({ value, label: STATUS_LABELS[value] || value })
  );
  const isFinalStatus = ['completed', 'cancelled'].includes(editingCurrentStatus);

  return (
    <div className="space-y-6 font-sans">
      <div className="bg-white dark:bg-[#122448] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex justify-between items-center transition-colors">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order Management</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Monitor real-time transactions, kitchen preparation status, and billing.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Order</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-[#122448] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/40 text-gray-400 uppercase font-extrabold text-[10px]">
                <th className="p-4">Order #</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Type / Table</th>
                <th className="p-4">Items</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-gray-700 dark:text-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => {
                  const orderCode = ord.orderNumber || ord.order_number || `#${ord.id}`;
                  const customer = ord.customerName || ord.customer_name || 'Walk-in Guest';
                  const tableInfo =
                    ord.tableNumber || ord.table_number
                      ? `Table ${ord.tableNumber || ord.table_number}`
                      : ord.orderType || ord.order_type || '-';
                  const itemsCount = Array.isArray(ord.items)
                    ? `${ord.items.length} item(s)`
                    : ord.itemCount || ord.items || '-';
                  const totalVal = Number(ord.totalAmount ?? ord.total_amount ?? ord.total ?? 0);
                  const statusText = ord.statusLabel || ord.status || 'Pending';

                  return (
                    <tr key={ord.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition">
                      <td className="p-4 font-bold text-emerald-600">{orderCode}</td>
                      <td className="p-4 font-semibold">{customer}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{tableInfo}</td>
                      <td className="p-4 text-gray-500 dark:text-gray-400">{itemsCount}</td>
                      <td className="p-4 font-extrabold text-gray-900 dark:text-white">
                        ${totalVal.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusBadge(ord.status)}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(ord)}
                          className="p-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 hover:bg-blue-100 rounded-lg cursor-pointer transition"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-400">
                    No orders found.
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
                {editingOrder ? 'Update Order Status' : 'Create New Order'}
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
              {editingOrder ? (
                <div>
                  <label className="font-bold block mb-1">ORDER STATUS</label>
                  <select
                    disabled={isFinalStatus}
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white disabled:opacity-60"
                  >
                    {allowedStatusOptions.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                  {isFinalStatus && (
                    <p className="text-[11px] text-amber-600 mt-1 font-semibold">
                      Completed or cancelled orders cannot change status.
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div>
                    <label className="font-bold block mb-1">CUSTOMER NAME</label>
                    <input
                      type="text"
                      placeholder="e.g. Samuel Abebe"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold block mb-1">ORDER TYPE</label>
                      <select
                        value={formData.orderType}
                        onChange={(e) => setFormData({ ...formData, orderType: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                      >
                        <option value="dine_in">Dine In</option>
                        <option value="takeaway">Takeaway</option>
                        <option value="delivery">Delivery</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">TABLE</label>
                      <select
                        disabled={formData.orderType !== 'dine_in'}
                        value={formData.tableId}
                        onChange={(e) => setFormData({ ...formData, tableId: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white disabled:opacity-50"
                      >
                        <option value="">Select Table</option>
                        {tables.map((t) => (
                          <option key={t.id} value={t.id}>
                            Table {t.tableNumber || t.table_number || t.id}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="font-bold block mb-1">MENU ITEM</label>
                      <select
                        required
                        value={formData.menuItemId}
                        onChange={(e) => setFormData({ ...formData, menuItemId: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                      >
                        <option value="">Select Item</option>
                        {menuItems.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} (${Number(m.price || 0).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="font-bold block mb-1">QTY</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold block mb-1">NOTES</label>
                    <input
                      type="text"
                      placeholder="Optional kitchen/order notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0b1d3a] border border-gray-200 dark:border-gray-700 rounded-xl outline-none font-semibold text-gray-800 dark:text-white"
                    />
                  </div>
                </>
              )}

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
                  disabled={saving || (editingOrder && isFinalStatus)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl font-bold shadow-lg cursor-pointer"
                >
                  {saving ? 'Saving...' : editingOrder ? 'Update Status' : 'Save Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}