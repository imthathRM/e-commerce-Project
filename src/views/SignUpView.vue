<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const firstName = ref('');
const lastName = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const error = ref('');
const isLoading = ref(false);

const handleSignUp = async () => {
  if (!firstName.value || !lastName.value || !username.value || !email.value || !password.value) {
    error.value = 'Please fill in all fields';
    return;
  }
  
  error.value = '';
  isLoading.value = true;
  
  try {
    // Mocking a successful signup since DummyJSON doesn't have a real registration endpoint
    // In a real app, you'd call an API here
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = {
      id: Math.floor(Math.random() * 1000),
      username: username.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
      gender: 'other',
      image: `https://ui-avatars.com/api/?name=${firstName.value}+${lastName.value}&background=0A192F&color=64FFDA`
    };
    
    authStore.setAuth(mockUser, 'mock-jwt-token-' + Date.now());
    router.push('/');
  } catch (e: any) {
    error.value = 'Sign up failed. Please try again.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-10 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in mb-20">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h1>
      <p class="text-gray-600 dark:text-gray-400">Join IZ Nexus today</p>
    </div>
    
    <form @submit.prevent="handleSignUp" class="space-y-4">
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
        {{ error }}
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
          <input 
            v-model="firstName" 
            type="text" 
            placeholder="John"
            class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
          <input 
            v-model="lastName" 
            type="text" 
            placeholder="Doe"
            class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
          />
        </div>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
        <input 
          v-model="username" 
          type="text" 
          placeholder="johndoe"
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
        <input 
          v-model="email" 
          type="email" 
          placeholder="john@example.com"
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
        <input 
          v-model="password" 
          type="password" 
          placeholder="••••••••"
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
        />
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full py-3.5 bg-primary-500 hover:bg-secondary-400 text-white hover:text-primary-900 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center mt-6"
      >
        <span v-if="isLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span v-else>Create Account</span>
      </button>
    </form>
    
    <div class="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
      Already have an account? 
      <router-link to="/login" class="text-primary-600 dark:text-primary-400 font-bold hover:underline">Log In</router-link>
    </div>
  </div>
</template>
