<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getCategories } from '@/services/api'
import { ChevronDownIcon, AdjustmentsHorizontalIcon, SparklesIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  modelValue: string
  sortBy: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:sortBy', value: string): void
}>()

const categories = ref<string[]>([])
const isLoading = ref(true)
const isSortOpen = ref(false)
const scrollContainer = ref<HTMLElement | null>(null)
const isScrolledRight = ref(false)

const sortOptions = [
  { label: 'Featured', value: 'default' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Best Rating', value: 'rating-desc' },
]

onMounted(async () => {
  try {
    categories.value = await getCategories()
  } catch (error) {
    console.error('Failed to load categories', error)
  } finally {
    isLoading.value = false
  }
})

const handleScroll = () => {
  if (scrollContainer.value) {
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value
    isScrolledRight.value = scrollLeft + clientWidth < scrollWidth - 10
  }
}

const selectCategory = (category: string) => {
  emit('update:modelValue', category)
}

const selectSort = (option: string) => {
  emit('update:sortBy', option)
  isSortOpen.value = false
}
</script>

<template>
  <div class="mb-10 flex flex-col gap-6">
    <!-- Filters Row -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <!-- Category Scroll -->
      <div class="relative flex-grow group">
        <div 
          ref="scrollContainer"
          @scroll="handleScroll"
          class="flex-grow overflow-x-auto pb-4 hide-scrollbar snap-x"
        >
          <div class="flex gap-3 min-w-max px-1">
            <button
              @click="selectCategory('')"
              :class="[
                'px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap snap-start flex items-center gap-2',
                modelValue === '' 
                  ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 scale-105' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-gray-700 hover:border-primary-200'
              ]"
            >
              <SparklesIcon v-if="modelValue === ''" class="w-4 h-4" />
              All Products
            </button>
            
            <template v-if="!isLoading">
              <button
                v-for="category in categories"
                :key="category"
                @click="selectCategory(category)"
                :class="[
                  'px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap capitalize snap-start',
                  modelValue === category
                    ? 'bg-primary-600 text-white shadow-xl shadow-primary-600/30 scale-105' 
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-gray-700 hover:border-primary-200'
                ]"
              >
                {{ category.replace(/-/g, ' ') }}
              </button>
            </template>
            <template v-else>
              <div v-for="i in 8" :key="i" class="h-12 w-32 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
            </template>
          </div>
        </div>
        
        <!-- Gradient Overlay for scroll indicator -->
        <div class="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-gray-50/50 dark:from-gray-900/50 to-transparent pointer-events-none rounded-r-2xl lg:hidden"></div>
      </div>

      <!-- Sorting Dropdown -->
      <div class="relative flex-shrink-0">
        <button 
          @click="isSortOpen = !isSortOpen"
          class="w-full lg:w-auto flex items-center justify-between gap-4 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm group"
        >
          <div class="flex items-center gap-2">
            <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
            <span>Sort: {{ sortOptions.find(o => o.value === sortBy)?.label }}</span>
          </div>
          <ChevronDownIcon :class="['w-4 h-4 transition-transform duration-300', isSortOpen ? 'rotate-180' : '']" />
        </button>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div 
            v-if="isSortOpen"
            class="absolute right-0 mt-3 w-64 origin-top-right bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 z-30 ring-1 ring-black ring-opacity-5"
          >
            <div class="px-4 py-2 border-b border-gray-50 dark:border-gray-700 mb-2">
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort Products By</span>
            </div>
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option.value)"
              :class="[
                'w-full text-left px-4 py-2.5 text-sm font-bold transition-all flex items-center justify-between',
                sortBy === option.value 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ option.label }}
              <div v-if="sortBy === option.value" class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
            </button>
          </div>
        </Transition>
      </div>
    </div>
    
    <!-- Active Filters Summary -->
    <Transition name="fade">
      <div v-if="modelValue" class="flex items-center gap-3 animate-fade-in">
        <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Selected Filter:</span>
        <div class="flex items-center gap-1.5 px-4 py-1.5 bg-primary-600 text-white text-xs font-black rounded-full shadow-lg shadow-primary-600/20">
          <span class="capitalize">{{ modelValue.replace(/-/g, ' ') }}</span>
          <button @click="selectCategory('')" class="hover:text-secondary-400 transition-colors ml-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </Transition>
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

.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style>
