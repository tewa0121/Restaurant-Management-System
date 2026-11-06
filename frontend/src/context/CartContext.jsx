// src/context/CartContext.jsx
// The single shopping cart for the whole app.
//
// Stored in localStorage as: [{ id, name, price, image, categoryId, quantity }]
// Exposed to pages with BOTH naming styles, so old and new pages keep working:
//   cartItems / cart      the list (each item has quantity AND qty)
//   totals                { subtotal, deliveryFee, tax, total, itemCount }
//   subtotal, deliveryFee, tax, totalAmount   (older names)
//
// IMPORTANT: these totals are only a PREVIEW for the customer.
// When Orders is built, the backend recalculates everything from the database prices.
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'resto_cart';
const MAX_QTY = 20; // per dish, stops absurd quantities
const TAX_RATE = 0.08; // placeholder: later this comes from the restaurant settings
const DELIVERY_FEE = 2.99; // placeholder: later only applied to delivery orders

export const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Money is calculated in whole cents, because decimals add up wrongly (0.1 + 0.2 = 0.30000000000000004)
const toCents = (amount) => Math.round(Number(amount) * 100);

// Reads the saved cart and throws away anything that is not a valid item.
// This removes the old fake dishes (ids like "menu-1"), which the backend would reject.
const readStoredCart = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((i) => ({
        id: Number(i.id),
        name: i.name,
        price: Number(i.price),
        image: i.image || i.image_url || '',
        categoryId: i.categoryId ?? null,
        quantity: Number(i.quantity ?? i.qty),
      }))
      .filter(
        (i) =>
          Number.isInteger(i.id) &&
          Number.isFinite(i.price) &&
          i.price >= 0 &&
          Number.isInteger(i.quantity) &&
          i.quantity > 0,
      )
      .map((i) => ({ ...i, quantity: Math.min(i.quantity, MAX_QTY) }));
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  // Save on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save the cart:', e);
    }
  }, [items]);

  // Add one of a dish. Returns false if the item is not valid.
  const addToCart = useCallback((item) => {
    const id = Number(item?.id);
    const price = Number(item?.price);
    if (!Number.isInteger(id) || !Number.isFinite(price) || price < 0) {
      console.warn('addToCart: invalid item', item);
      return false;
    }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, quantity: Math.min(i.quantity + 1, MAX_QTY) } : i,
        );
      }
      return [
        ...prev,
        {
          id,
          name: item.name,
          price,
          image: item.image || item.image_url || '',
          categoryId: item.categoryId ?? null,
          quantity: 1,
        },
      ];
    });
    return true;
  }, []);

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== Number(id)));
  }, []);

  // changeQuantity(id, +1) or changeQuantity(id, -1). Reaching 0 removes the dish.
  const changeQuantity = useCallback((id, delta) => {
    setItems((prev) =>
      prev.flatMap((i) => {
        if (i.id !== Number(id)) return [i];
        const next = i.quantity + Number(delta);
        if (next <= 0) return [];
        return [{ ...i, quantity: Math.min(next, MAX_QTY) }];
      }),
    );
  }, []);

  // setQuantity(id, 3) sets the exact quantity. updateQuantity keeps its original meaning.
  const setQuantity = useCallback((id, quantity) => {
    const q = Math.floor(Number(quantity));
    if (!Number.isFinite(q) || q <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === Number(id) ? { ...i, quantity: Math.min(q, MAX_QTY) } : i,
      ),
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setItems([]), []);

  // What pages receive: each item also carries the older names (qty, image_url)
  const cartItems = useMemo(
    () => items.map((i) => ({ ...i, qty: i.quantity, image_url: i.image })),
    [items],
  );

  const totals = useMemo(() => {
    const subtotalCents = items.reduce((sum, i) => sum + toCents(i.price) * i.quantity, 0);
    const deliveryCents = items.length > 0 ? toCents(DELIVERY_FEE) : 0;
    const taxCents = Math.round(subtotalCents * TAX_RATE);
    return {
      subtotal: subtotalCents / 100,
      deliveryFee: deliveryCents / 100,
      tax: taxCents / 100,
      total: (subtotalCents + deliveryCents + taxCents) / 100,
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    };
  }, [items]);

  const value = useMemo(
    () => ({
      cartItems,
      cart: cartItems, // older name
      addToCart,
      removeFromCart,
      changeQuantity,
      setQuantity,
      updateQuantity: setQuantity, // older name, same meaning as before (exact quantity)
      clearCart,
      totals,
      itemCount: totals.itemCount,
      subtotal: totals.subtotal, // older names
      deliveryFee: totals.deliveryFee,
      tax: totals.tax,
      totalAmount: totals.total,
    }),
    [cartItems, addToCart, removeFromCart, changeQuantity, setQuantity, clearCart, totals],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};