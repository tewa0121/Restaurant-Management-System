import React, { useEffect, useState } from 'react';
import { Plus, Minus, Trash2, CheckCircle2, ShoppingCart } from 'lucide-react';
import menuService from '../../services/menuService';
import tableService from '../../services/tableService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';

export function NewBill() {
  const [menuCatalog, setMenuCatalog] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTableId, setSelectedTableId] = useState('');
  const [orderType, setOrderType] = useState('dine_in');
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const [items, tbls] = await Promise.all([
          menuService.getMenuItems({ limit: 200 }),
          tableService.getTables().catch(() => []),
        ]);
        if (!active) return;
        setMenuCatalog(items);
        setTables(tbls);
        if (tbls.length > 0) setSelectedTableId(String(tbls[0].id));
      } catch (err) {
        if (active) setError(err.message || 'Failed to load POS items.');
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const addItemToCart = (item) => {
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

  const removeItem = (menuItemId) => {
    setCart((prev) => prev.filter((c) => c.menuItemId !== menuItemId));
  };

  const subtotal = cart.reduce((sum, i) => sum + Number(i.price || 0) * Number(i.qty || 1), 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const handleCharge = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    setError('');
    setPaidSuccess('');
    try {
      const created = await orderService.createOrder({
        orderType,
        tableId: orderType === 'dine_in' && selectedTableId ? Number(selectedTableId) : undefined,
        items: cart.map((c) => ({ menuItemId: c.menuItemId, quantity: c.qty })),
      });
      const orderId = created?.id || created?.data?.id;
      const chargeAmount = Number(created?.totalAmount ?? created?.total_amount ?? total);

      if (orderId) {
        await paymentService.processPayment({
          orderId: Number(orderId),
          amount: chargeAmount > 0 ? chargeAmount : Number(total.toFixed(2)),
          method: paymentMethod,
        });
      }

      setCart([]);
      setPaidSuccess(`Bill settled via ${paymentMethod.replace(/_/g, ' ').toUpperCase()}.`);
      setTimeout(() => setPaidSuccess(''), 3500);
    } catch (err) {
      setError(err.message || 'Failed to process bill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#F8FAFC] min-h-screen text-slate-800 font-sans">
      <div className="lg:col-span-7 space-y-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-black text-slate-900">POS Point of Sale — New Bill</h1>
            <p className="text-xs text-slate-500">Select dishes and settle payment directly.</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <select
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
            >
              <option value="dine_in">Dine In</option>
              <option value="takeaway">Takeaway</option>
              <option value="delivery">Delivery</option>
            </select>
            {orderType === 'dine_in' && (
              <select
                value={selectedTableId}
                onChange={(e) => setSelectedTableId(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    Table {t.tableNumber || t.table_number || t.id}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-400">
            Loading menu...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {menuCatalog.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => addItemToCart(item)}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm text-left hover:border-emerald-400 transition cursor-pointer"
              >
                <p className="text-xs font-extrabold text-slate-900">{item.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{item.categoryName || item.category || 'Menu'}</p>
                <p className="text-xs font-black text-emerald-600 mt-2">
                  ${Number(item.price || 0).toFixed(2)}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <h2 className="text-base font-black text-slate-900 flex items-center gap-2 border-b pb-3">
            <ShoppingCart className="w-4 h-4 text-emerald-600" />
            <span>Current Ticket ({cart.length})</span>
          </h2>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {paidSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{paidSuccess}</span>
            </div>
          )}

          {cart.length === 0 ? (
            <p className="text-xs text-slate-400 py-8 text-center">No items in ticket.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs">
              {cart.map((c) => (
                <div key={c.menuItemId} className="py-2.5 flex items-center justify-between gap-2">
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
                    <button
                      type="button"
                      onClick={() => removeItem(c.menuItemId)}
                      className="p-1 text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t pt-4 space-y-3 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax (15%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-black text-slate-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div>
            <label className="font-bold block mb-1 text-slate-700">PAYMENT METHOD</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none"
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="mobile_money">Mobile Money</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>

          <button
            type="button"
            disabled={cart.length === 0 || submitting}
            onClick={handleCharge}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-black cursor-pointer"
          >
            {submitting ? 'Processing...' : `Charge $${total.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewBill;