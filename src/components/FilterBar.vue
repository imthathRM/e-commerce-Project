<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories } from '@/services/api'
import { ChevronDownIcon, AdjustmentsHorizontalIcon } from '@heroicons/vue/24/outline'

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
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
      <!-- Category Scroll -->
      <div class="flex-grow overflow-x-auto pb-2 hide-scrollbar">
        <div class="flex gap-2 min-w-max">
          <button
            @click="selectCategory('')"
            :class="[
              'px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap',
              modelValue === '' 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
            ]"
          >
            All Products
          </button>
          
          <template v-if="!isLoading">
            <button
              v-for="category in categories"
              :key="category"
              @click="selectCategory(category)"
              :class="[
                'px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap capitalize',
                modelValue === category
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20' 
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-100 dark:border-gray-700'
              ]"
            >
              {{ category.replace(/-/g, ' ') }}
            </button>
          </template>
          <template v-else>
            <div v-for="i in 6" :key="i" class="h-10 w-28 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
          </template>
        </div>
      </div>

      <!-- Sorting Dropdown -->
      <div class="relative flex-shrink-0 self-end lg:self-auto">
        <button 
          @click="isSortOpen = !isSortOpen"
          class="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm"
        >
          <AdjustmentsHorizontalIcon class="w-5 h-5 text-gray-400" />
          <span>Sort By: {{ sortOptions.find(o => o.value === sortBy)?.label }}</span>
          <ChevronDownIcon :class="['w-4 h-4 transition-transform duration-200', isSortOpen ? 'rotate-180' : '']" />
        </button>

        <Transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-if="isSortOpen"
            class="absolute right-0 mt-2 w-56 origin-top-right bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-30"
          >
            <button
              v-for="option in sortOptions"
              :key="option.value"
              @click="selectSort(option.value)"
              :class="[
                'w-full text-left px-4 py-2 text-sm font-medium transition-colors',
                sortBy === option.value 
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20' 
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
        </Transition>
      </div>
    </div>
    
    <!-- Active Filters Summary (Optional) -->
    <div v-if="modelValue" class="flex items-center gap-2">
      <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Category:</span>
      <span class="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-lg capitalize border border-primary-100 dark:border-primary-800/50">
        {{ modelValue.replace(/-/g, ' ') }}
      </span>
      <button @click="selectCategory('')" class="text-gray-400 hover:text-red-500 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </button>
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
