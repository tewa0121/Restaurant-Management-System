import { useContext } from "react";
import { CartContext } from "../context/CartContext";

// Named Export
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

// Default Export (Prevents syntax errors regardless of import style)
export default useCart;
