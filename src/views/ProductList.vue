<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getProducts, getProductsByCategory, searchProducts } from '@/services/api'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import FilterBar from '@/components/FilterBar.vue'

const route = useRoute()
const products = ref<Product[]>([])
const isLoading = ref(true)
const selectedCategory = ref('')
const error = ref('')

const fetchProducts = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const searchQuery = route.query.q as string
    
    if (searchQuery) {
      const response = await searchProducts(searchQuery)
      products.value = response.products
      selectedCategory.value = ''
    } else if (selectedCategory.value) {
      const response = await getProductsByCategory(selectedCategory.value)
      products.value = response.products
    } else {
      const response = await getProducts(30)
      products.value = response.products
    }
  } catch (err) {
    error.value = 'Failed to load products. Please try again later.'
    console.error(err)
  } finally {
    isLoading.value = false
  }
}

watch([() => route.query.q, selectedCategory], () => {
  fetchProducts()
})

onMounted(() => {
  fetchProducts()
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <div class="mb-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 sm:p-12 shadow-lg">
      <div class="relative z-10 max-w-2xl">
        <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
          Discover Our Latest Collection
        </h1>
        <p class="text-lg text-primary-100 mb-8 max-w-xl">
          Experience premium quality and modern design. Shop our curated selection of top-rated products.
        </p>
      </div>
      <div class="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
    </div>

    <!-- Filters -->
    <FilterBar v-model="selectedCategory" />

    <!-- Status Messages -->
    <div v-if="error" class="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-center">
      {{ error }}
    </div>

    <!-- Product Grid -->
    <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div v-for="i in 8" :key="i" class="bg-white dark:bg-gray-800 rounded-2xl h-[380px] animate-pulse border border-gray-100 dark:border-gray-700">
        <div class="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl"></div>
        <div class="p-5">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-3"></div>
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
          <div class="flex justify-between items-center">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
            <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">No products found</h2>
      <p class="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard 
        v-for="product in products" 
        :key="product.id" 
        :product="product" 
      />
    </div>
  </div>
</template>
