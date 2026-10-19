import React, { createContext, useContext, useState } from 'react';

// Keep CartContext internal to prevent Vite Fast Refresh warnings
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, deltaOrQuantity) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id === productId) {
            const newQuantity =
              deltaOrQuantity === 1 || deltaOrQuantity === -1
                ? item.quantity + deltaOrQuantity
                : deltaOrQuantity;

            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cartItems.reduce(
    (total, item) =>
      total + Number(item.price || 0) * item.quantity,
    0
  );

  const totals = {
    subtotal: cartTotal,
    deliveryFee: cartTotal > 0 ? 5.00 : 0.00,
  };

  const value = {
    cartItems,
    items: cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    totals,
    totalItems: cartCount,
    totalPrice: cartTotal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside a CartProvider'
    );
  }

  return context;
}