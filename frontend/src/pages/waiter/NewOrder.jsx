import React, { useEffect, useState } from 'react';
import { Plus, Minus, Send, CheckCircle2, ShoppingBag } from 'lucide-react';
import menuService from '../../services/menuService';
import tableService from '../../services/tableService';
import orderService from '../../services/orderService';

export default function WaiterNewOrder() {
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [items, cats, tbls] = await Promise.all([
          menuService.getMenuItems({ limit: 200 }),
          menuService.getCategories().catch(() => []),
          tableService.getTables().catch(() => []),
        ]);
        if (!active) return;
        setMenuItems(items);
        const catNames = cats
          .map((c) => (typeof c === 'string' ? c : c.name || c.title || ''))
          .filter(Boolean);
        setCategories(['All', ...new Set(catNames)]);
        setTables(tbls);
        if (tbls.length > 0) setSelectedTableId(String(tbls[0].id));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load menu and tables.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const visibleItems = menuItems.filter((it) => {
    if (category === 'All') return true;
    const cat = it.categoryName || it.category || '';
    return String(cat).toLowerCase() === category.toLowerCase();
  });

  const addItem = (item) => {
    const price = Number(item.price || 0);
    setCart((prev) => {
      const idx = prev.findIndex((c) => c.menuItemId === item.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + 1 };
        return copy;
      }
      return [...prev, { menuItemId: item.id, name: item.name, price, qty: 1 }];
    });
  };

  const updateQty = (menuItemId, delta) => {
    setCart((prev) =>
      prev
        .map((c) => (c.menuItemId === menuItemId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1), 0);

  const handleSendOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setError('');
    setSubmitted(false);
    try {
      await orderService.createOrder({
        orderType: 'dine_in',
        tableId: selectedTableId ? Number(selectedTableId) : undefined,
        items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.qty })),
      });
      setCart([]);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit order to kitchen.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="lg:col-span-8 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900">Take New Table Order</h1>
            <p className="text-xs text-slate-500">Choose a table and add dishes to send to kitchen.</p>
          </div>
          <select
            value={selectedTableId}
            onChange={(e) => setSelectedTableId(e.target.value)}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
          >
            {tables.map((t) => (
              <option key={t.id} value={t.id}>
                Table {t.tableNumber || t.table_number || t.id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                category === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            Loading menu items...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addItem(item)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-emerald-400 transition cursor-pointer"
              >
                <p className="text-xs font-extrabold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.categoryName || item.category || 'Dish'}
                </p>
                <p className="text-xs font-black text-emerald-600 mt-2">
                  ${Number(item.price || 0).toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b pb-3">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Order Ticket ({cart.length})</span>
          </h2>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {submitted && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Order sent to kitchen!</span>
            </div>
          )}

          {cart.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No items selected yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {cart.map((c) => (
                <div key={c.menuItemId} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">{c.name}</p>
                    <p className="text-[11px] text-slate-400">${c.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateQty(c.menuItemId, -1)}
                      className="p-1 bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-bold px-1.5">{c.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(c.menuItemId, 1)}
                      className="p-1 bg-slate-100 rounded-lg cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-3 text-xs">
          <div className="flex justify-between font-black text-sm text-slate-900">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <button
            type="button"
            disabled={cart.length === 0 || submitting}
            onClick={handleSendOrder}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Sending...' : 'Send to Kitchen'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}