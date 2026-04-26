<script setup lang="ts">
import { GlobeAltIcon, UserGroupIcon, LightBulbIcon } from '@heroicons/vue/24/outline'

const values = [
  {
    name: 'Global Reach',
    description: 'We connect buyers and sellers from all corners of the globe, breaking down geographical barriers.',
    icon: GlobeAltIcon,
  },
  {
    name: 'Customer Centric',
    description: 'Our users are at the heart of everything we do. We prioritize your needs and shopping experience.',
    icon: UserGroupIcon,
  },
  {
    name: 'Innovation',
    description: 'We continuously evolve our platform with the latest technology to bring you the best features.',
    icon: LightBulbIcon,
  },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
    <!-- Header -->
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">About ShopVue</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        We are on a mission to revolutionize the e-commerce landscape by providing a seamless, secure, and modern shopping experience for everyone.
      </p>
    </div>

    <!-- Story Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
      <div class="relative rounded-2xl overflow-hidden shadow-xl">
        <div class="aspect-w-16 aspect-h-9 bg-gray-200 dark:bg-gray-700 h-64 md:h-96 w-full object-cover rounded-2xl flex items-center justify-center">
            <!-- Placeholder for image -->
             <div class="text-gray-400 dark:text-gray-500 flex flex-col items-center">
               <GlobeAltIcon class="w-16 h-16 mb-2 opacity-50" />
               <span>Company Image Placeholder</span>
             </div>
        </div>
      </div>
      <div>
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
          Founded in 2026, ShopVue started with a simple idea: online shopping should be intuitive, fast, and beautiful. What began as a small project has now grown into a full-fledged platform serving thousands of customers worldwide.
        </p>
        <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
          We believe in the power of technology to connect people with the products they love. Our team is dedicated to building robust infrastructure and a delightful user interface that makes finding and purchasing items effortless.
        </p>
      </div>
    </div>

    <!-- Values Section -->
    <div class="bg-gray-50 dark:bg-gray-800/50 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-700/50">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">Our Core Values</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="value in values" :key="value.name" class="text-center">
          <div class="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
            <component :is="value.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ value.name }}</h3>
          <p class="text-gray-600 dark:text-gray-400">{{ value.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
