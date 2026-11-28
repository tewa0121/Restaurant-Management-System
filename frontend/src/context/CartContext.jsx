import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';

export const CartContext = createContext(null);

// TEMPORARY: these will come from GET /settings/public and POST /orders/preview
// in Step 2. The server must be the one that computes real totals.
export const TAX_RATE = 0.08;
export const DELIVERY_FEE = 2.99;

const STORAGE_KEY = 'resto_cart';
const MAX_QTY = 99;

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;
const clampQty = (n) => Math.min(MAX_QTY, Math.max(1, parseInt(n, 10) || 1));

// Read + sanitize whatever is in localStorage (old versions stored
// items without ids or with `quantity` / `image_url`).
const loadCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((i) => i && i.id != null && Number.isFinite(Number(i.price)))
      .map((i) => ({
        id: String(i.id),
        name: i.name || 'Item',
        price: Number(i.price),
        image: i.image || i.image_url || '',
        qty: clampQty(i.qty ?? i.quantity ?? 1),
      }));
  } catch (e) {
    return [];
  }
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // item: { id, name, price, image }   (id is required)
  const addToCart = useCallback((item, qty = 1) => {
    if (!item || item.id == null) {
      console.warn('addToCart ignored: item.id is required', item);
      return;
    }
    const id = String(item.id);
    const amount = clampQty(qty);

    setCart((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(MAX_QTY, i.qty + amount) } : i
        );
      }
      return [
        ...prev,
        {
          id,
          name: item.name || 'Item',
          price: Number(item.price) || 0,
          image: item.image || item.image_url || '',
          qty: amount,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== String(id)));
  }, []);

  // ABSOLUTE quantity (not +1/-1). 0 or less removes the item.
  const updateQuantity = useCallback((id, newQty) => {
    const key = String(id);
    if (newQty <= 0) {
      setCart((prev) => prev.filter((i) => i.id !== key));
      return;
    }
    setCart((prev) =>
      prev.map((i) => (i.id === key ? { ...i, qty: clampQty(newQty) } : i))
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const totals = useMemo(() => {
    const subtotal = round2(cart.reduce((sum, i) => sum + i.price * i.qty, 0));
    const itemCount = cart.reduce((sum, i) => sum + i.qty, 0);
    const deliveryFee = cart.length > 0 ? DELIVERY_FEE : 0;
    const tax = round2(subtotal * TAX_RATE);
    const totalAmount = round2(subtotal + deliveryFee + tax);
    return { subtotal, itemCount, deliveryFee, tax, totalAmount };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      ...totals,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};