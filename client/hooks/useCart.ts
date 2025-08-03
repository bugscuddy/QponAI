import { useState, useEffect } from 'react';
import { CartItem } from '../types/cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // In a real app, you would fetch the cart items from your API
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        // This would be an API call in a real app
        // const response = await fetch('/api/cart');
        // const data = await response.json();
        // setCartItems(data);
        
        // Mock data for now
        const mockCartItems: CartItem[] = [
          { id: '1', name: 'Milk', price: 3.99, quantity: 2, userId: 'user-123' },
          { id: '2', name: 'Bread', price: 2.50, quantity: 1, userId: 'user-123' },
          { id: '3', name: 'Eggs', price: 4.99, quantity: 12, userId: 'user-123' },
        ];
        
        setCartItems(mockCartItems);
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const addToCart = async (item: Omit<CartItem, 'id' | 'userId'>) => {
    try {
      // In a real app, you would make an API call here
      // const response = await fetch('/api/cart', {
      //   method: 'POST',
      //   body: JSON.stringify(item),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const newItem = await response.json();
      
      // Mock implementation
      const newItem: CartItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9),
        userId: 'user-123',
      };
      
      setCartItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      throw err;
    }
  };

  const updateCartItem = async (itemId: string, updates: Partial<CartItem>) => {
    try {
      // In a real app, you would make an API call here
      // const response = await fetch(`/api/cart/${itemId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify(updates),
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const updatedItem = await response.json();
      
      // Mock implementation
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === itemId ? { ...item, ...updates } : item
        )
      );
      
      return { ...updates, id: itemId } as CartItem;
    } catch (err) {
      console.error('Failed to update cart item:', err);
      throw err;
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      // In a real app, you would make an API call here
      // await fetch(`/api/cart/${itemId}`, { method: 'DELETE' });
      
      // Mock implementation
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      // In a real app, you would make an API call here
      // await fetch('/api/cart', { method: 'DELETE' });
      
      // Mock implementation
      setCartItems([]);
    } catch (err) {
      console.error('Failed to clear cart:', err);
      throw err;
    }
  };

  const getCartTotal = () => {
    // In a real app, you would calculate this based on actual prices
    return cartItems.reduce((total, item) => {
      // Mock prices based on item names for demonstration
      const prices: Record<string, number> = {
        'Organic Bananas': 0.59,
        'Almond Milk': 3.99,
        'Whole Wheat Bread': 2.99,
        // Add more mock prices as needed
      };
      
      const price = prices[item.name] || 0;
      return total + price * item.quantity;
    }, 0);
  };

  return {
    cartItems,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
  };
};
