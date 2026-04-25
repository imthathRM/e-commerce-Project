<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProductById } from '@/services/api'
import { useCartStore } from '@/stores/cart'
import type { Product } from '@/types'
import { StarIcon, ArrowLeftIcon, ShoppingCartIcon, CheckIcon } from '@heroicons/vue/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/vue/20/solid'

const route = useRoute()
const router = useRouter()
const cartStore = useCartStore()

const product = ref<Product | null>(null)
const isLoading = ref(true)
const activeImage = ref(0)
const addedToCart = ref(false)

onMounted(async () => {
  const id = route.params.id as string
  try {
    product.value = await getProductById(id)
  } catch (error) {
    console.error('Failed to fetch product', error)
  } finally {
    isLoading.value = false
  }
})

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.value.price)
})

const originalPrice = computed(() => {
  if (!product.value) return ''
  const orig = product.value.price / (1 - product.value.discountPercentage / 100)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(orig)
})

const handleAddToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value)
    addedToCart.value = true
    setTimeout(() => {
      addedToCart.value = false
    }, 2000)
  }
}
</script>

<template>
  <div class="max-w-6xl mx-auto py-6">
    <button 
      @click="router.back()" 
      class="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-8 group"
    >
      <ArrowLeftIcon class="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
      Back to shopping
    </button>

    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="product" class="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
        <!-- Image Gallery -->
        <div class="p-8 bg-gray-50 dark:bg-gray-900/50 flex flex-col items-center justify-center">
          <div class="w-full max-w-md aspect-square relative mb-6 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex items-center justify-center overflow-hidden">
            <img 
              :src="product.images[activeImage]" 
              :alt="product.title" 
              class="object-contain w-full h-full"
            />
            <div v-if="product.discountPercentage > 0" class="absolute top-4 left-4 bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-sm">
              -{{ Math.round(product.discountPercentage) }}%
            </div>
          </div>
          
          <div class="flex gap-4 overflow-x-auto pb-2 w-full max-w-md hide-scrollbar">
            <button 
              v-for="(img, index) in product.images" 
              :key="index"
              @click="activeImage = index"
              :class="[
                'flex-shrink-0 w-20 h-20 rounded-xl bg-white dark:bg-gray-800 p-2 border-2 transition-all',
                activeImage === index ? 'border-primary-500 shadow-md scale-105' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              ]"
            >
              <img :src="img" :alt="`${product.title} - ${index + 1}`" class="object-contain w-full h-full" />
            </button>
          </div>
        </div>

        <!-- Product Details -->
        <div class="p-8 md:p-12 flex flex-col">
          <div class="text-sm text-primary-600 dark:text-primary-400 font-semibold mb-2 uppercase tracking-widest">
            {{ product.brand || product.category }}
          </div>
          
          <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {{ product.title }}
          </h1>
          
          <div class="flex items-center gap-4 mb-6">
            <div class="flex items-center gap-1">
              <StarIconSolid class="w-5 h-5 text-yellow-400" />
              <span class="font-medium text-gray-700 dark:text-gray-300">{{ product.rating.toFixed(1) }}</span>
            </div>
            <div class="w-1 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            <span class="text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">
              {{ product.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </span>
          </div>

          <div class="flex items-end gap-3 mb-8">
            <span class="text-4xl font-extrabold text-gray-900 dark:text-white">{{ formattedPrice }}</span>
            <span v-if="product.discountPercentage > 0" class="text-xl text-gray-400 line-through mb-1">{{ originalPrice }}</span>
          </div>

          <p class="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
            {{ product.description }}
          </p>

          <div class="mt-auto pt-8 border-t border-gray-200 dark:border-gray-700">
            <button 
              @click="handleAddToCart"
              :disabled="product.stock === 0"
              :class="[
                'w-full py-4 px-8 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold transition-all duration-300',
                product.stock === 0 ? 'bg-gray-300 cursor-not-allowed' : 
                addedToCart ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-primary-600 hover:bg-primary-500 text-white shadow-lg shadow-primary-600/30 hover:-translate-y-1'
              ]"
            >
              <template v-if="addedToCart">
                <CheckIcon class="w-6 h-6" />
                Added to Cart
              </template>
              <template v-else>
                <ShoppingCartIcon class="w-6 h-6" />
                Add to Cart
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
