import React, { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('resto_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

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

  const subtotal = cart.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.qty ?? item.quantity ?? 1) || 1),
    0
  );
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + deliveryFee + tax;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        deliveryFee,
        tax,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};