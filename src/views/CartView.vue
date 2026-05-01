<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useToastStore } from '@/stores/toast'
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ArrowRightIcon,
  ShoppingBagIcon,
  TagIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/vue/24/outline'
import { CheckBadgeIcon } from '@heroicons/vue/24/solid'

const cartStore = useCartStore()
const toastStore = useToastStore()
const router = useRouter()

const promoCode = ref('')
const promoApplied = ref(false)
const promoError = ref('')
const PROMO_DISCOUNT = 0.10 // 10%

const applyPromo = () => {
  if (promoCode.value.trim().toUpperCase() === 'IZNEXUS10') {
    promoApplied.value = true
    promoError.value = ''
    toastStore.addToast('Promo code applied! 10% off', 'success', 'IZNEXUS10')
  } else {
    promoError.value = 'Invalid promo code'
    promoApplied.value = false
  }
}

const removePromo = () => {
  promoApplied.value = false
  promoCode.value = ''
  promoError.value = ''
}

const discountAmount = computed(() =>
  promoApplied.value ? cartStore.totalPrice * PROMO_DISCOUNT : 0
)

const finalTotal = computed(() => cartStore.totalPrice - discountAmount.value)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const handleRemove = (id: number, title: string) => {
  cartStore.removeFromCart(id)
  toastStore.addToast('Item removed', 'info', title)
}

const handleClearCart = () => {
  cartStore.clearCart()
  toastStore.addToast('Cart cleared', 'info', 'All items have been removed')
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Shopping Cart
        </h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1 text-sm">
          {{ cartStore.totalItems === 0 ? 'Your cart is empty' : `${cartStore.totalItems} item${cartStore.totalItems > 1 ? 's' : ''} in your cart` }}
        </p>
      </div>
      <button
        v-if="cartStore.items.length > 0"
        @click="router.push('/products')"
        class="hidden sm:flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
      >
        <ArrowUturnLeftIcon class="w-4 h-4" />
        Continue Shopping
      </button>
    </div>

    <!-- Empty State -->
    <Transition name="fade" mode="out-in">
      <div v-if="cartStore.items.length === 0" key="empty" class="flex flex-col items-center justify-center py-24 text-center">
        <div class="w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingBagIcon class="w-14 h-14 text-gray-400 dark:text-gray-500" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">Your cart is empty</h2>
        <p class="text-gray-500 dark:text-gray-400 mb-8 max-w-xs">
          Looks like you haven't added anything yet. Browse our products and find something you'll love!
        </p>
        <button
          @click="router.push('/products')"
          class="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 px-8 rounded-2xl transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5"
        >
          Start Shopping
          <ArrowRightIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Cart Content -->
      <div v-else key="cart" class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- Cart Items -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <TransitionGroup name="cart-item" tag="div" class="flex flex-col gap-4">
            <div
              v-for="item in cartStore.items"
              :key="item.id"
              class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col sm:flex-row items-center gap-4 p-4 group hover:shadow-md transition-shadow duration-300"
            >
              <!-- Thumbnail -->
              <router-link
                :to="`/product/${item.id}`"
                class="w-24 h-24 flex-shrink-0 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center p-2 overflow-hidden"
              >
                <img
                  :src="item.thumbnail"
                  :alt="item.title"
                  class="object-contain w-full h-full mix-blend-multiply dark:mix-blend-normal hover:scale-110 transition-transform duration-300"
                />
              </router-link>

              <!-- Info -->
              <div class="flex-grow text-center sm:text-left min-w-0">
                <router-link
                  :to="`/product/${item.id}`"
                  class="text-base font-semibold text-gray-900 dark:text-white hover:text-primary-500 dark:hover:text-primary-400 transition-colors line-clamp-1"
                >
                  {{ item.title }}
                </router-link>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">
                  {{ item.brand || item.category }}
                </div>
                <div class="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                  <span class="text-lg font-bold text-primary-600 dark:text-primary-400">
                    {{ formatPrice(item.price) }}
                  </span>
                  <span v-if="item.discountPercentage > 0" class="text-xs bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 font-semibold px-1.5 py-0.5 rounded-full">
                    -{{ Math.round(item.discountPercentage) }}%
                  </span>
                </div>
                <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Subtotal: <span class="font-semibold text-gray-700 dark:text-gray-200">{{ formatPrice(item.price * item.quantity) }}</span>
                </div>
              </div>

              <!-- Quantity + Remove -->
              <div class="flex items-center gap-3 flex-shrink-0">
                <div class="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-inner">
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity - 1)"
                    class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    :aria-label="`Decrease quantity of ${item.title}`"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                  <span class="w-10 text-center text-sm font-bold text-gray-900 dark:text-white select-none">
                    {{ item.quantity }}
                  </span>
                  <button
                    @click="cartStore.updateQuantity(item.id, item.quantity + 1)"
                    class="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                    :aria-label="`Increase quantity of ${item.title}`"
                  >
                    <PlusIcon class="w-4 h-4" />
                  </button>
                </div>

                <button
                  @click="handleRemove(item.id, item.title)"
                  class="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                  :aria-label="`Remove ${item.title}`"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </TransitionGroup>

          <!-- Clear Cart -->
          <div class="flex justify-end mt-2">
            <button
              @click="handleClearCart"
              class="text-sm text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <TrashIcon class="w-4 h-4" />
              Clear all items
            </button>
          </div>

          <!-- Trust Badges -->
          <div class="grid grid-cols-3 gap-3 mt-4">
            <div
              v-for="badge in [
                { icon: TruckIcon, label: 'Free Shipping', sub: 'On all orders' },
                { icon: ShieldCheckIcon, label: 'Secure Checkout', sub: '256-bit SSL' },
                { icon: ArrowUturnLeftIcon, label: 'Easy Returns', sub: '30-day policy' },
              ]"
              :key="badge.label"
              class="flex flex-col items-center text-center bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-2xl p-3 gap-1"
            >
              <component :is="badge.icon" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
              <span class="text-xs font-bold text-gray-800 dark:text-gray-100">{{ badge.label }}</span>
              <span class="text-[10px] text-gray-400">{{ badge.sub }}</span>
            </div>
          </div>
        </div>

        <!-- Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm sticky top-24 overflow-hidden">
            <!-- Header -->
            <div class="px-6 py-5 border-b border-gray-100 dark:border-gray-700">
              <h2 class="text-xl font-extrabold text-gray-900 dark:text-white">Order Summary</h2>
            </div>

            <div class="px-6 py-5 space-y-4">
              <!-- Line Items -->
              <div class="space-y-3">
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal ({{ cartStore.totalItems }} items)</span>
                  <span class="font-semibold text-gray-900 dark:text-white">{{ formatPrice(cartStore.totalPrice) }}</span>
                </div>

                <!-- Savings from discounts -->
                <div v-if="cartStore.totalSavings > 0" class="flex justify-between text-sm text-emerald-600 dark:text-emerald-400">
                  <span>Product savings</span>
                  <span class="font-semibold">-{{ formatPrice(cartStore.totalSavings) }}</span>
                </div>

                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center gap-1">
                    <TruckIcon class="w-4 h-4 text-emerald-500" />
                    Shipping
                  </span>
                  <span class="font-semibold text-emerald-500">Free</span>
                </div>

                <!-- Promo discount line -->
                <div v-if="promoApplied" class="flex justify-between text-sm text-primary-600 dark:text-primary-400">
                  <span class="flex items-center gap-1">
                    <TagIcon class="w-4 h-4" />
                    Promo (10%)
                  </span>
                  <span class="font-semibold">-{{ formatPrice(discountAmount) }}</span>
                </div>
              </div>

              <!-- Promo Code Input -->
              <div class="pt-3 border-t border-gray-100 dark:border-gray-700">
                <label class="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  Promo Code
                </label>
                <div v-if="!promoApplied" class="flex gap-2">
                  <input
                    v-model="promoCode"
                    @keyup.enter="applyPromo"
                    type="text"
                    placeholder="IZNEXUS10"
                    class="flex-grow text-sm border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition"
                  />
                  <button
                    @click="applyPromo"
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all"
                  >
                    Apply
                  </button>
                </div>
                <div v-else class="flex items-center justify-between bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl px-3 py-2">
                  <div class="flex items-center gap-2 text-primary-700 dark:text-primary-300 text-sm font-semibold">
                    <CheckBadgeIcon class="w-5 h-5 text-primary-500" />
                    IZNEXUS10 applied
                  </div>
                  <button @click="removePromo" class="text-xs text-gray-400 hover:text-red-500 transition-colors">Remove</button>
                </div>
                <p v-if="promoError" class="text-xs text-red-500 mt-1.5">{{ promoError }}</p>
                <p v-if="!promoApplied && !promoError" class="text-[11px] text-gray-400 mt-1.5">Try code: <code class="font-mono font-bold">IZNEXUS10</code></p>
              </div>

              <!-- Total -->
              <div class="border-t border-gray-100 dark:border-gray-700 pt-4">
                <div class="flex justify-between items-center">
                  <span class="text-base font-bold text-gray-900 dark:text-white">Total</span>
                  <span class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ formatPrice(finalTotal) }}</span>
                </div>
                <p class="text-xs text-gray-400 mt-1 text-right">Taxes calculated at checkout</p>
              </div>
            </div>

            <!-- CTA -->
            <div class="px-6 pb-6">
              <button class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-extrabold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary-600/30 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-600/30 text-base">
                Proceed to Checkout
                <ArrowRightIcon class="w-5 h-5" />
              </button>
              <p class="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                <ShieldCheckIcon class="w-3.5 h-3.5" />
                Secured by SSL encryption
              </p>
            </div>
          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>

<style scoped>
.cart-item-enter-active {
  transition: all 0.35s ease;
}
.cart-item-leave-active {
  transition: all 0.3s ease;
}
.cart-item-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.cart-item-leave-to {
  opacity: 0;
  transform: translateX(20px) scale(0.95);
  max-height: 0;
}
.cart-item-move {
  transition: transform 0.3s ease;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
