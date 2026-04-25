<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { TrashIcon, MinusIcon, PlusIcon, ArrowRightIcon } from '@heroicons/vue/24/outline'

const cartStore = useCartStore()
const router = useRouter()

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formattedTotal = computed(() => {
  return formatPrice(cartStore.totalPrice)
})
</script>

<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

    <div v-if="cartStore.items.length === 0" class="bg-white dark:bg-gray-800 rounded-3xl p-12 text-center shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
      <p class="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added anything to your cart yet.</p>
      <button 
        @click="router.push('/')" 
        class="bg-primary-600 hover:bg-primary-500 text-white font-medium py-3 px-8 rounded-xl transition-colors shadow-lg shadow-primary-600/20"
      >
        Start Shopping
      </button>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Cart Items -->
      <div class="lg:col-span-2 space-y-4">
        <div 
          v-for="item in cartStore.items" 
          :key="item.id"
          class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center"
        >
          <div class="w-24 h-24 bg-gray-50 dark:bg-gray-900 rounded-xl p-2 flex-shrink-0 flex items-center justify-center">
            <img :src="item.thumbnail" :alt="item.title" class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal" />
          </div>
          
          <div class="flex-grow text-center sm:text-left">
            <router-link :to="`/product/${item.id}`" class="text-lg font-semibold text-gray-900 dark:text-white hover:text-primary-500 transition-colors line-clamp-1">
              {{ item.title }}
            </router-link>
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ item.brand || item.category }}</div>
            <div class="text-primary-600 dark:text-primary-400 font-bold">{{ formatPrice(item.price) }}</div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                class="p-1 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <MinusIcon class="w-4 h-4" />
              </button>
              <span class="w-10 text-center font-medium text-gray-900 dark:text-white">{{ item.quantity }}</span>
              <button 
                @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                class="p-1 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 rounded-md transition-colors"
              >
                <PlusIcon class="w-4 h-4" />
              </button>
            </div>
            
            <button 
              @click="cartStore.removeFromCart(item.id)"
              class="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
              aria-label="Remove item"
            >
              <TrashIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>
          
          <div class="space-y-4 mb-6">
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Subtotal ({{ cartStore.totalItems }} items)</span>
              <span>{{ formattedTotal }}</span>
            </div>
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>Shipping</span>
              <span class="text-green-500">Free</span>
            </div>
            <div class="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <div class="flex justify-between items-center">
                <span class="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ formattedTotal }}</span>
              </div>
            </div>
          </div>

          <button class="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5">
            Checkout Now
            <ArrowRightIcon class="w-5 h-5" />
          </button>

          <button 
            @click="cartStore.clearCart"
            class="w-full mt-4 py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
