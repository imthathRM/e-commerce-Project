import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import type { Product, CartItem } from '@/types';

export const useCartStore = defineStore('cart', () => {
  // State
  const items = ref<CartItem[]>([]);

  // Initialize from localStorage
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      items.value = JSON.parse(savedCart);
    } catch (e) {
      console.error('Failed to parse cart from local storage', e);
    }
  }

  // Watch for changes and save to localStorage
  watch(items, (newItems) => {
    localStorage.setItem('cart', JSON.stringify(newItems));
  }, { deep: true });

  // Getters
  const totalItems = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const totalPrice = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Actions
  const addToCart = (product: Product) => {
    const existingItem = items.value.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({ ...product, quantity: 1 });
    }
  };

  const removeFromCart = (productId: number) => {
    const index = items.value.findIndex(item => item.id === productId);
    if (index !== -1) {
      items.value.splice(index, 1);
    }
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = items.value.find(item => item.id === productId);
    if (item) {
      item.quantity = quantity;
    }
  };

  const clearCart = () => {
    items.value = [];
  };

  return {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
});
