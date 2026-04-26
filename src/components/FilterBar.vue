<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCategories } from '@/services/api'

defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const categories = ref<string[]>([])
const isLoading = ref(true)

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
</script>

<template>
  <div class="mb-8 overflow-x-auto pb-4 hide-scrollbar">
    <div class="flex gap-2 min-w-max">
      <button
        @click="selectCategory('')"
        :class="[
          'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
          modelValue === '' 
            ? 'bg-primary-500 text-white shadow-md' 
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
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
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap capitalize',
            modelValue === category
              ? 'bg-primary-500 text-white shadow-md' 
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
          ]"
        >
          {{ category.replace(/-/g, ' ') }}
        </button>
      </template>
      <template v-else>
        <div v-for="i in 5" :key="i" class="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      </template>
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
