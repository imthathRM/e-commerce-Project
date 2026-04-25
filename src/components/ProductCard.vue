<script setup lang="ts">
import { computed } from 'vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { ShoppingCartIcon } from '@heroicons/vue/24/outline'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(props.product.price)
})

const handleAddToCart = (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  cartStore.addToCart(props.product)
}
</script>

<template>
  <router-link 
    :to="`/product/${product.id}`"
    class="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
  >
    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
      <img 
        :src="product.thumbnail" 
        :alt="product.title"
        class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div v-if="product.discountPercentage > 0" class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <div class="p-5 flex flex-col flex-grow">
      <div class="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1 uppercase tracking-wider">
        {{ product.category }}
      </div>
      <h3 class="font-semibold text-lg text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-primary-500 transition-colors">
        {{ product.title }}
      </h3>
      
      <div class="flex items-center gap-1 mb-auto">
        <StarIcon class="w-4 h-4 text-yellow-400" />
        <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ product.rating.toFixed(1) }}</span>
      </div>

      <div class="mt-4 flex items-center justify-between">
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ formattedPrice }}
        </div>
        <button 
          @click="handleAddToCart"
          class="bg-gray-100 hover:bg-primary-500 text-gray-900 hover:text-white dark:bg-gray-700 dark:text-white dark:hover:bg-primary-500 p-2.5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Add to cart"
        >
          <ShoppingCartIcon class="w-5 h-5" />
        </button>
      </div>
    </div>
  </router-link>
</template>
