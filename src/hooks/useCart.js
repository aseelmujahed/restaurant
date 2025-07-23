import { useState, useCallback } from 'react';

export function useCart() {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item, selectedIngredients = {}) => {
 
  }, []);

  const removeFromCart = useCallback((itemId, selectedIngredients) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === itemId && JSON.stringify(item.selectedIngredients) === JSON.stringify(selectedIngredients))
    ));
  }, []);

  const updateQuantity = useCallback((itemId, selectedIngredients, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId, selectedIngredients);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === itemId && JSON.stringify(item.selectedIngredients) === JSON.stringify(selectedIngredients)) {
        return { ...item, quantity };
      }
      return item;
    }));
  }, [removeFromCart]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const ingredientCost = Object.values(item.selectedIngredients).flat().reduce((sum, ingredient) => {
        return sum + (ingredient.extra_fee ? ingredient.extra_fee_cost : 0);
      }, 0);
      return total + (item.price + ingredientCost) * item.quantity;
    }, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return {
    cartItems,
    isOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
    toggleCart,
    setIsOpen
  };
}