import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { CartItem } from '@/types';

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);

  // Load from localStorage
  const storedOrders = localStorage.getItem('orders');
  if (storedOrders) {
    try {
      orders.value = JSON.parse(storedOrders);
    } catch (e) {
      console.error('Failed to parse orders', e);
    }
  }

  // Persist to localStorage
  watch(orders, (newOrders) => {
    localStorage.setItem('orders', JSON.stringify(newOrders));
  }, { deep: true });

  const addOrder = (items: CartItem[], total: number) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...items],
      total,
      status: 'Processing'
    };
    orders.value.unshift(newOrder); // Add to beginning
  };

  return { orders, addOrder };
});
