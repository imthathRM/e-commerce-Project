<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ShoppingCartIcon, SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '@/stores/cart'

const router = useRouter()
const cartStore = useCartStore()

const isDark = ref(false)
const searchQuery = ref('')

onMounted(() => {
  isDark.value = document.documentElement.classList.contains('dark')
})

const toggleTheme = () => {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'products', query: { q: searchQuery.value } })
  } else {
    router.push({ name: 'products' })
  }
}

watch(() => router.currentRoute.value.query.q, (newQ) => {
  if (newQ !== undefined) {
    searchQuery.value = newQ as string
  } else {
    searchQuery.value = ''
  }
})
</script>

<template>
  <nav class="sticky top-0 z-50 glass">
    <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 group flex-shrink-0">
        <div class="bg-primary-600 text-white p-2 rounded-xl group-hover:bg-primary-500 transition-colors shadow-md">
          <ShoppingCartIcon class="w-6 h-6" />
        </div>
        <span class="font-extrabold text-2xl hidden md:block bg-gradient-to-r from-primary-600 to-blue-500 bg-clip-text text-transparent">
          ShopVue
        </span>
      </router-link>

      <!-- Navigation Links -->
      <div class="hidden lg:flex items-center gap-8 mx-4">
        <router-link to="/products" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" active-class="text-primary-600 dark:text-primary-400">Products</router-link>
        <router-link to="/about" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" active-class="text-primary-600 dark:text-primary-400">About</router-link>
        <router-link to="/services" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" active-class="text-primary-600 dark:text-primary-400">Services</router-link>
        <router-link to="/contact" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" active-class="text-primary-600 dark:text-primary-400">Contact</router-link>
      </div>

      <!-- Search Bar -->
      <form @submit.prevent="handleSearch" class="flex-grow max-w-md relative hidden md:block">
        <div class="relative flex items-center w-full">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search products..." 
            class="w-full bg-gray-100/80 dark:bg-gray-800/80 border border-transparent rounded-full py-2.5 pl-12 pr-4 text-sm focus:bg-white dark:focus:bg-gray-900 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all dark:text-white shadow-inner"
          />
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-400 absolute left-4" />
          <button type="submit" class="hidden"></button>
        </div>
      </form>

      <!-- Actions -->
      <div class="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        <!-- Mobile Search Toggle (Optional) -->
        <button class="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300">
          <MagnifyingGlassIcon class="w-6 h-6" />
        </button>

        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
          aria-label="Toggle Dark Mode"
        >
          <SunIcon v-if="isDark" class="w-6 h-6" />
          <MoonIcon v-else class="w-6 h-6" />
        </button>

        <router-link 
          to="/cart" 
          class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative text-gray-600 dark:text-gray-300 group"
        >
          <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <span 
            v-if="cartStore.totalItems > 0"
            class="absolute top-0 right-0 -mt-1 -mr-1 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md animate-fade-in"
          >
            {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>
