<script setup lang="ts">

import { CheckCircleIcon, CodeBracketIcon, DevicePhoneMobileIcon, CloudArrowUpIcon, FingerPrintIcon, BoltIcon } from '@heroicons/vue/24/outline'

const services = [
  {
    name: 'Responsive Design',
    description: 'Our platform looks flawless on desktops, tablets, and smartphones, ensuring a consistent experience.',
    icon: DevicePhoneMobileIcon,
  },
  {
    name: 'Lightning Fast',
    description: 'Built with Vite and Vue 3, our SPA offers instantaneous page transitions and quick loading times.',
    icon: BoltIcon,
  },
  {
    name: 'Secure Authentication',
    description: 'We use industry-standard security protocols to keep your account and data safe.',
    icon: FingerPrintIcon,
  },
  {
    name: 'Cloud Infrastructure',
    description: 'Hosted on scalable cloud servers to guarantee 99.9% uptime and reliability during peak hours.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Modern Tech Stack',
    description: 'Leveraging TypeScript, Tailwind CSS, and Pinia for a robust and maintainable architecture.',
    icon: CodeBracketIcon,
  },
  {
    name: 'Quality Assurance',
    description: 'Every product goes through strict quality checks before being listed on our platform.',
    icon: CheckCircleIcon,
  },
]
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Our Services & Features</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Discover the powerful features and professional services that make ShopVue the premier choice for modern e-commerce.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="(service, index) in services" :key="service.name" 
           class="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all transform hover:-translate-y-1 animate-slide-up"
           :style="`animation-delay: ${0.1 * index}s;`">
        <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-6 shadow-md">
          <component :is="service.icon" class="w-6 h-6" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">{{ service.name }}</h3>
        <p class="text-gray-600 dark:text-gray-400 leading-relaxed">{{ service.description }}</p>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="mt-24 bg-primary-600 rounded-3xl p-10 text-white shadow-xl">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div>
          <div class="text-4xl font-bold mb-2">10k+</div>
          <div class="text-primary-100 font-medium">Active Users</div>
        </div>
        <div>
          <div class="text-4xl font-bold mb-2">50k+</div>
          <div class="text-primary-100 font-medium">Products Sold</div>
        </div>
        <div>
          <div class="text-4xl font-bold mb-2">99%</div>
          <div class="text-primary-100 font-medium">Uptime</div>
        </div>
        <div>
          <div class="text-4xl font-bold mb-2">24/7</div>
          <div class="text-primary-100 font-medium">Support</div>
        </div>
      </div>
    </div>
  </div>
</template>
