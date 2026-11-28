import React from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { PATHS } from '../../utils/paths';

const FALLBACK_IMG = '/assets/food-placeholders/food-burger.png';

export default function CartSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Your Order Basket
            </h3>
            <button
              onClick={onClose}
              aria-label="Close cart"
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Your basket is currently empty.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl flex items-center justify-between gap-3 border border-slate-100 dark:border-slate-800"
                >
                  <img
                    src={item.image || FALLBACK_IMG}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">
                      {item.name}
                    </h4>
                    <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-slate-800 dark:text-slate-200">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name}`}
                      className="p-1 text-rose-500 hover:text-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
                <span className="text-slate-900 dark:text-white text-sm">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  navigate(PATHS.checkout);
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}