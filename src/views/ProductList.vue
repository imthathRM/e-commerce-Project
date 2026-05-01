<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getProducts, getProductsByCategory, searchProducts } from '@/services/api'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import FilterBar from '@/components/FilterBar.vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(true)
const selectedCategory = ref('')
const sortBy = ref('default')
const error = ref('')

const fetchProducts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const searchQuery = route.query.q as string
    
    let fetchedProducts: Product[] = []
    
    if (searchQuery) {
      const response = await searchProducts(searchQuery)
      fetchedProducts = response.products
      // If a category is also selected, filter locally for best UX
      if (selectedCategory.value) {
        fetchedProducts = fetchedProducts.filter(p => p.category === selectedCategory.value)
      }
    } else if (selectedCategory.value) {
      const response = await getProductsByCategory(selectedCategory.value)
      fetchedProducts = response.products
    } else {
      const response = await getProducts(100) // Fetch more to make filtering/sorting better
      fetchedProducts = response.products
    }
    
    products.value = fetchedProducts
  } catch (err) {
    error.value = 'Failed to load products. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

const sortedProducts = computed(() => {
  const result = [...products.value]
  
  switch (sortBy.value) {
    case 'price-asc':
      return result.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return result.sort((a, b) => b.price - a.price)
    case 'rating-desc':
      return result.sort((a, b) => b.rating - a.rating)
    default:
      return result
  }
})

watch([() => route.query.q, selectedCategory], () => {
  fetchProducts()
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
    <!-- Header Section -->
    <div class="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-primary-600 to-blue-600 text-white p-8 sm:p-12 shadow-lg">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          {{ route.query.q ? `Results for "${route.query.q}"` : selectedCategory ? selectedCategory.replace(/-/g, ' ') : 'All Products' }}
        </h1>
        <p class="text-lg text-primary-100 max-w-xl capitalize">
          {{ selectedCategory ? `Exploring the best in ${selectedCategory.replace(/-/g, ' ')}.` : 'Browse our entire collection and find exactly what you\'re looking for.' }}
        </p>
      </div>
      <div class="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
    </div>

    <!-- Filters -->
    <FilterBar v-model="selectedCategory" v-model:sortBy="sortBy" />

    <!-- Status Messages -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center mb-8">
      {{ error }}
    </div>

    <!-- Product Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-3xl h-[420px] animate-pulse border border-gray-100 dark:border-gray-700">
        <div class="h-56 bg-gray-100 dark:bg-gray-700/50 rounded-t-3xl"></div>
        <div class="p-6">
          <div class="h-4 bg-gray-100 dark:bg-gray-700/50 rounded w-1/4 mb-4"></div>
          <div class="h-6 bg-gray-100 dark:bg-gray-700/50 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-100 dark:bg-gray-700/50 rounded w-1/2 mb-8"></div>
          <div class="flex justify-between items-center">
            <div class="h-8 bg-gray-100 dark:bg-gray-700/50 rounded w-1/3"></div>
            <div class="h-10 w-10 bg-gray-100 dark:bg-gray-700/50 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="sortedProducts.length === 0" class="text-center py-24 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div class="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h2>
      <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
      <button 
        @click="selectedCategory = ''; $router.push({ name: 'products' })"
        class="mt-6 text-primary-600 font-bold hover:underline"
      >
        Clear all filters
      </button>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in sortedProducts" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>
