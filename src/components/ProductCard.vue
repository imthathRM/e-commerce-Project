<script setup lang="ts">
import { ref, computed } from 'vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { ShoppingCartIcon, CheckIcon, PlusIcon } from '@heroicons/vue/24/outline'
import type { Product } from '@/types'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const toastStore = useToastStore()

const justAdded = ref(false)

const inCart = computed(() => cartStore.isInCart(props.product.id))
const cartQty = computed(() => cartStore.getQuantity(props.product.id))

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
  toastStore.addToast(
    `Added to cart!`,
    'success',
    props.product.title,
  )
  justAdded.value = true
  setTimeout(() => { justAdded.value = false }, 1500)
}
</script>

<template>
  <router-link
    :to="`/product/${product.id}`"
    class="group flex flex-col bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative"
  >
    <!-- In-Cart Badge -->
    <Transition name="badge-pop">
      <div
        v-if="inCart"
        class="absolute top-3 right-3 z-10 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-md"
      >
        <CheckIcon class="w-3 h-3" />
        {{ cartQty > 1 ? `×${cartQty}` : 'In Cart' }}
      </div>
    </Transition>

    <!-- Product Image -->
    <div class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-900 p-4 flex items-center justify-center">
      <img
        :src="product.thumbnail"
        :alt="product.title"
        class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div
        v-if="product.discountPercentage > 0"
        class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md"
      >
        -{{ Math.round(product.discountPercentage) }}%
      </div>
    </div>

    <!-- Product Info -->
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
        <span class="text-xs text-gray-400 ml-1">({{ product.stock }} in stock)</span>
      </div>

      <div class="mt-4 flex items-center justify-between gap-2">
        <div class="text-xl font-bold text-gray-900 dark:text-white">
          {{ formattedPrice }}
        </div>

        <button
          @click="handleAddToCart"
          :class="[
            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 flex-shrink-0',
            justAdded
              ? 'bg-emerald-500 text-white focus:ring-emerald-400 scale-95'
              : inCart
              ? 'bg-secondary-400 text-primary-900 hover:bg-secondary-300 focus:ring-secondary-400'
              : 'bg-gray-100 hover:bg-secondary-400 text-gray-900 hover:text-primary-900 dark:bg-gray-700 dark:text-white dark:hover:bg-secondary-400 dark:hover:text-primary-900 focus:ring-secondary-400'
          ]"
          :aria-label="inCart ? 'Add another to cart' : 'Add to cart'"
        >
          <Transition name="icon-swap" mode="out-in">
            <CheckIcon v-if="justAdded" class="w-4 h-4" />
            <PlusIcon v-else-if="inCart" class="w-4 h-4" />
            <ShoppingCartIcon v-else class="w-4 h-4" />
          </Transition>
          <span class="hidden sm:inline">
            {{ justAdded ? 'Added!' : inCart ? 'Add More' : 'Add to Cart' }}
          </span>
        </button>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.badge-pop-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.badge-pop-leave-active {
  transition: all 0.2s ease-in;
}
.badge-pop-enter-from,
.badge-pop-leave-to {
  opacity: 0;
  transform: scale(0.5);
}

.icon-swap-enter-active,
.icon-swap-leave-active {
  transition: all 0.15s ease;
}
.icon-swap-enter-from,
.icon-swap-leave-to {
  opacity: 0;
  transform: scale(0.5) rotate(-90deg);
}
</style>
