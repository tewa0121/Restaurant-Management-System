import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import settingsService from '../services/settingsService';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const DEFAULT_SETTINGS = { currency: 'ETB', taxRate: 15, deliveryFee: 0 };

const toNumber = (value, fallback = 0) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('resto_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      if (!Array.isArray(parsed)) return [];
      // keep only real menu items (numeric database ids); older builds could
      // have saved sample items with ids like "overview-1"
      return parsed.filter((i) => Number.isInteger(Number(i?.id)) && Number(i.id) >= 1);
    } catch (e) {
      return [];
    }
  });

  // Currency, tax rate and delivery fee come from the restaurant settings
  // (the same values the server uses to price an order).
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    let cancelled = false;
    settingsService
      .getPublicSettings()
      .then((data) => {
        if (cancelled || !data) return;
        setSettings({
          currency: data.currency || DEFAULT_SETTINGS.currency,
          taxRate: toNumber(data.taxRate, DEFAULT_SETTINGS.taxRate),
          deliveryFee: toNumber(data.deliveryFee, DEFAULT_SETTINGS.deliveryFee),
        });
      })
      .catch(() => {
        // keep defaults when the settings endpoint is unreachable
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('resto_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  const addToCart = (item) => {
    const qtyToAdd = Math.max(1, Number(item.quantity ?? item.qty ?? 1) || 1);
    const unitPrice = Number(item.price ?? 0) || 0;

    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => String(i.id) === String(item.id));
      if (existingItem) {
        return prevCart.map((i) =>
          String(i.id) === String(item.id)
            ? {
                ...i,
                price: unitPrice,
                qty: (Number(i.qty ?? i.quantity ?? 1) || 1) + qtyToAdd,
                quantity: (Number(i.qty ?? i.quantity ?? 1) || 1) + qtyToAdd,
              }
            : i
        );
      }
      return [
        ...prevCart,
        {
          ...item,
          price: unitPrice,
          qty: qtyToAdd,
          quantity: qtyToAdd,
        },
      ];
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => String(item.id) !== String(id)));
  };

  // newQty is the NEW absolute quantity (not a +1 / -1 change).
  const updateQuantity = (id, newQty) => {
    const numericQty = Number(newQty) || 0;
    if (numericQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        String(item.id) === String(id)
          ? { ...item, qty: numericQty, quantity: numericQty }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const currency = settings.currency;
  const formatMoney = useCallback(
    (amount) => `${currency} ${toNumber(amount).toFixed(2)}`,
    [currency]
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty ?? item.quantity ?? 1) || 1),
    0
  );
  const itemCount = cart.reduce(
    (sum, item) => sum + (Number(item.qty ?? item.quantity ?? 1) || 1),
    0
  );

  // The delivery fee depends on the order type, which is chosen at checkout,
  // so the cart only estimates subtotal + tax. Checkout asks the server for
  // the exact total.
  const taxRate = settings.taxRate;
  const tax = (subtotal * taxRate) / 100;
  const deliveryFee = 0;
  const configuredDeliveryFee = settings.deliveryFee;
  const totalAmount = subtotal + tax;

  const totals = { subtotal, tax, taxRate, deliveryFee, configuredDeliveryFee, total: totalAmount };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // alias used by Cart page and CartSidebar
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        deliveryFee,
        configuredDeliveryFee,
        tax,
        taxRate,
        totalAmount,
        totals,
        currency,
        formatMoney,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};