<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { ShoppingCartIcon, SunIcon, MoonIcon, MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { UserIcon, ArrowRightOnRectangleIcon } from '@heroicons/vue/24/outline'

const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()

// ✅ storeToRefs keeps computed refs (like isAuthenticated) fully reactive
const { isAuthenticated: isLoggedIn, user } = storeToRefs(authStore)

const isDark = ref(false)
const searchQuery = ref('')
const isProfileDropdownOpen = ref(false)

const handleLogout = () => {
  authStore.logout()
  isProfileDropdownOpen.value = false
  router.push('/login')
}

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
        <div class="bg-primary-500 text-white p-2 rounded-xl group-hover:bg-secondary-400 group-hover:text-primary-900 transition-all duration-300 shadow-md group-hover:shadow-lg">
          <ShoppingCartIcon class="w-6 h-6" />
        </div>
        <span class="font-extrabold text-2xl hidden md:block bg-gradient-to-r from-primary-500 to-secondary-400 bg-clip-text text-transparent transition-all duration-300">
          IZ Nexus
        </span>
      </router-link>

      <!-- Navigation Links -->
      <div class="hidden lg:flex items-center gap-8 mx-4">
        <router-link to="/products" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-300" active-class="text-primary-600 dark:text-secondary-400">Products</router-link>
        <router-link to="/about" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-300" active-class="text-primary-600 dark:text-secondary-400">About</router-link>
        <router-link to="/services" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-300" active-class="text-primary-600 dark:text-secondary-400">Services</router-link>
        <router-link to="/contact" class="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-secondary-500 dark:hover:text-secondary-400 transition-colors duration-300" active-class="text-primary-600 dark:text-secondary-400">Contact</router-link>
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
          aria-label="Shopping cart"
        >
          <ShoppingCartIcon class="w-6 h-6 group-hover:scale-110 transition-transform" />
          <Transition name="badge-bounce">
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-rose-600 text-white text-[10px] font-extrabold min-w-[20px] h-5 flex items-center justify-center rounded-full shadow-lg px-1 select-none"
            >
              {{ cartStore.totalItems > 99 ? '99+' : cartStore.totalItems }}
              <span class="absolute inset-0 rounded-full bg-red-400 opacity-75 animate-ping" />
            </span>
          </Transition>
        </router-link>
        
        <template v-if="isLoggedIn">
          <div class="relative flex items-center gap-2">
            <!-- User Profile / Dropdown Toggle -->
            <button 
              @click="isProfileDropdownOpen = !isProfileDropdownOpen"
              class="flex items-center gap-2 focus:outline-none"
            >
              <img :src="user?.image" alt="User" class="w-9 h-9 rounded-full border-2 border-primary-500 hover:border-secondary-400 transition-colors shadow-sm" />
              <span class="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-200">
                Hi, {{ user?.firstName }}
              </span>
            </button>

            <!-- Dropdown Menu -->
            <div 
              v-if="isProfileDropdownOpen"
              class="absolute right-0 top-full mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden animate-fade-in z-50"
            >
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p class="text-sm text-gray-900 dark:text-white font-semibold">{{ user?.firstName }} {{ user?.lastName }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 truncate">@{{ user?.username }}</p>
              </div>
              <ul class="py-1">
                <li>
                  <a href="#" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Profile</a>
                </li>
                <li class="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                  <button 
                    @click="handleLogout"
                    class="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                  >
                    <ArrowRightOnRectangleIcon class="w-4 h-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="flex items-center gap-2">
            <router-link 
              to="/login"
              class="hidden sm:inline-block px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              Log In
            </router-link>
            <router-link 
              to="/signup"
              class="px-4 py-2 rounded-full bg-primary-500 hover:bg-secondary-400 text-white hover:text-primary-900 text-sm font-bold transition-all shadow-sm hover:shadow-md flex items-center gap-1"
            >
              <UserIcon class="w-5 h-5" /> <span>Sign In</span>
            </router-link>
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.badge-bounce-enter-active {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-bounce-leave-active {
  transition: all 0.2s ease-in;
}
.badge-bounce-enter-from,
.badge-bounce-leave-to {
  opacity: 0;
  transform: scale(0);
}
</style>
