import { useState, useEffect } from "react";
import type { Cart, CartItem, Product } from "@/types";

const STORAGE_KEY = "ecommerce-cart";

export const useCart = () => {
  const [cart, setCart] = useState<Cart>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          items: parsed.items || [],
          total: parsed.total || 0,
          count: parsed.count || 0,
        };
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
    }
    return { items: [], total: 0, count: 0 };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage:", error);
    }
  }, [cart]);

  const calculateTotals = (items: CartItem[]) => {
    const total = items.reduce((sum, item) => {
      const price = parseFloat(item.product.price);
      return sum + (price * item.quantity);
    }, 0);
    const count = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, count };
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.items.find(item => item.product.id === product.id);
      
      let newItems: CartItem[];
      if (existingItem) {
        newItems = prevCart.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...prevCart.items, { product, quantity }];
      }

      const { total, count } = calculateTotals(newItems);
      return { items: newItems, total, count };
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const newItems = prevCart.items.filter(item => item.product.id !== productId);
      const { total, count } = calculateTotals(newItems);
      return { items: newItems, total, count };
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart => {
      const newItems = prevCart.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
      const { total, count } = calculateTotals(newItems);
      return { items: newItems, total, count };
    });
  };

  const clearCart = () => {
    setCart({ items: [], total: 0, count: 0 });
  };

  const getCartItem = (productId: number): CartItem | undefined => {
    return cart.items.find(item => item.product.id === productId);
  };

  const getTotalPrice = (): number => {
    return cart.total;
  };

  const getTotalItems = (): number => {
    return cart.count;
  };

  return {
    cart,
    items: cart.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartItem,
    getTotalPrice,
    getTotalItems,
  };
};
