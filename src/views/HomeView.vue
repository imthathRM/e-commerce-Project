<script setup lang="ts">
import { ArrowRightIcon, ShieldCheckIcon, TruckIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/vue/24/outline'
import { useRouter } from 'vue-router'

const router = useRouter()

const features = [
  {
    name: 'Free Shipping',
    description: 'On all orders over $100. Delivered to your doorstep within 3-5 business days.',
    icon: TruckIcon,
  },
  {
    name: 'Secure Payments',
    description: 'State-of-the-art encryption ensures your payment information is 100% secure.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'Money Back Guarantee',
    description: 'Not satisfied? Return your purchase within 30 days for a full refund.',
    icon: CurrencyDollarIcon,
  },
]

const testimonials = [
  {
    content: "ShopVue has transformed the way I buy electronics. The interface is intuitive, and the shipping is incredibly fast. Highly recommended!",
    author: "Sarah Johnson",
    role: "Tech Enthusiast",
    rating: 5
  },
  {
    content: "I've been a loyal customer for over a year. The product quality and customer service are consistently outstanding.",
    author: "Michael Chen",
    role: "Verified Buyer",
    rating: 5
  },
  {
    content: "The best e-commerce platform I've used. Clean design, easy navigation, and great deals. What more could you ask for?",
    author: "Emily Davis",
    role: "Regular Shopper",
    rating: 5
  }
]
</script>

<template>
  <div class="flex flex-col gap-16 md:gap-24 animate-fade-in pb-16">
    <!-- Hero Section -->
    <section class="relative pt-10 pb-20 md:pt-20 md:pb-32 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 shadow-sm border border-gray-100 dark:border-gray-700 mt-4 px-6 sm:px-12">
      <!-- Decorative background elements -->
      <div class="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-primary-200 dark:bg-primary-900 rounded-full blur-3xl opacity-50 animate-pulse-slow"></div>
      <div class="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full blur-3xl opacity-50"></div>
      
      <div class="relative max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight animate-slide-up" style="animation-delay: 0.1s;">
          Discover the Future of <br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-blue-500">Online Shopping</span>
        </h1>
        <p class="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.2s;">
          Experience seamless navigation, secure transactions, and lightning-fast delivery. Upgrade your shopping experience today with our premium platform.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style="animation-delay: 0.3s;">
          <button @click="router.push('/products')" class="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center">
            Shop Now <ArrowRightIcon class="w-5 h-5" />
          </button>
          <button @click="router.push('/about')" class="px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-full font-semibold text-lg transition-all w-full sm:w-auto justify-center shadow-sm">
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Why Choose ShopVue?</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Everything you need for a perfect shopping experience.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        <div v-for="(feature, index) in features" :key="feature.name" class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow animate-slide-up" :style="`animation-delay: ${0.2 * index}s;`">
          <div class="w-14 h-14 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center mb-6">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ feature.name }}</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl py-16 px-6 sm:px-12 max-w-7xl mx-auto w-full border border-gray-100 dark:border-gray-700/50">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Loved by Our Customers</h2>
        <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">Don't just take our word for it.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="(testimonial, index) in testimonials" :key="index" class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 animate-slide-up" :style="`animation-delay: ${0.2 * index}s;`">
          <div class="flex gap-1 mb-4 text-yellow-400">
            <StarIcon v-for="i in testimonial.rating" :key="i" class="w-5 h-5 fill-current" />
          </div>
          <p class="text-gray-600 dark:text-gray-300 italic mb-6">"{{ testimonial.content }}"</p>
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-inner">
              {{ testimonial.author.charAt(0) }}
            </div>
            <div>
              <h4 class="font-bold text-gray-900 dark:text-white">{{ testimonial.author }}</h4>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ testimonial.role }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="max-w-4xl mx-auto text-center px-4">
      <div class="bg-primary-600 text-white rounded-3xl p-10 md:p-16 shadow-xl relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 opacity-90"></div>
        <!-- Decorative blob -->
        <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div class="relative z-10">
          <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to start shopping?</h2>
          <p class="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers and experience the difference today.</p>
          <button @click="router.push('/products')" class="px-8 py-4 bg-white text-primary-600 hover:bg-gray-50 rounded-full font-bold text-lg transition-transform transform hover:-translate-y-1 shadow-md w-full sm:w-auto">
            Browse All Products
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
