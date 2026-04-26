<script setup lang="ts">
import { ref } from 'vue'
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/vue/24/outline'

const form = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = ref({
  name: '',
  email: '',
  message: ''
})

const isSubmitting = ref(false)
const submitSuccess = ref(false)

const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '', message: '' }

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!form.value.message.trim()) {
    errors.value.message = 'Message is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isSubmitting.value = false
  submitSuccess.value = true
  
  // Reset form
  form.value = { name: '', email: '', subject: '', message: '' }
  
  setTimeout(() => {
    submitSuccess.value = false
  }, 5000)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
    <div class="text-center max-w-3xl mx-auto mb-16">
      <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Get in Touch</h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        Have a question or want to work together? Fill out the form below and our team will get back to you as soon as possible.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Contact Information -->
      <div class="lg:col-span-1 space-y-8">
        <div class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Contact Information</h3>
          
          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                <EnvelopeIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Email</p>
                <a href="mailto:support@shopvue.com" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">support@shopvue.com</a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                <PhoneIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Phone</p>
                <a href="tel:+1234567890" class="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">+1 (234) 567-890</a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="w-10 h-10 bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPinIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="font-medium text-gray-900 dark:text-white">Office</p>
                <p class="text-gray-600 dark:text-gray-400">123 Commerce Blvd,<br/>Suite 400<br/>San Francisco, CA 94105</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact Form -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.name" 
                  type="text" 
                  id="name" 
                  class="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  :class="errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'"
                  placeholder="John Doe"
                />
                <p v-if="errors.name" class="mt-1 text-sm text-red-500">{{ errors.name }}</p>
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address <span class="text-red-500">*</span></label>
                <input 
                  v-model="form.email" 
                  type="email" 
                  id="email" 
                  class="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  :class="errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'"
                  placeholder="john@example.com"
                />
                <p v-if="errors.email" class="mt-1 text-sm text-red-500">{{ errors.email }}</p>
              </div>
            </div>

            <div>
              <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject (Optional)</label>
              <input 
                v-model="form.subject" 
                type="text" 
                id="subject" 
                class="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message <span class="text-red-500">*</span></label>
              <textarea 
                v-model="form.message" 
                id="message" 
                rows="5"
                class="w-full px-4 py-3 rounded-lg border bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                :class="errors.message ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'"
                placeholder="Your message here..."
              ></textarea>
              <p v-if="errors.message" class="mt-1 text-sm text-red-500">{{ errors.message }}</p>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting"
              class="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
              :class="{'opacity-75 cursor-not-allowed': isSubmitting}"
            >
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
            </button>

            <!-- Success Message -->
            <div v-if="submitSuccess" class="mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              Your message has been sent successfully. We will get back to you shortly!
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
