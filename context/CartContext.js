// context/CartContext.js
import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [currentRestaurant, setCurrentRestaurant] = useState(null);

  const addToCart = (item) => {
    setCart(prevCart => {
      // Check if item already exists in cart
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // Update quantity if item exists
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: (cartItem.quantity || 1) + 1 }
            : cartItem
        );
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });

    // Set current restaurant if not set
    if (!currentRestaurant || currentRestaurant.id !== item.restaurantId) {
      setCurrentRestaurant({
        id: item.restaurantId,
        name: item.restaurantName
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    setCurrentRestaurant(null);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        clearCart, 
        currentRestaurant 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};