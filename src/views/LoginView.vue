<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { login } from '@/services/api';

const router = useRouter();
const authStore = useAuthStore();

const username = ref('emilys');
const password = ref('emilyspass');
const error = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password';
    return;
  }
  
  error.value = '';
  isLoading.value = true;
  
  try {
    const data = await login(username.value, password.value);
    authStore.setAuth(data, data.token);
    router.push('/');
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="max-w-md mx-auto mt-20 p-8 bg-white dark:bg-gray-800 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back</h1>
      <p class="text-gray-600 dark:text-gray-400">Sign in to your account</p>
    </div>
    
    <form @submit.prevent="handleLogin" class="space-y-6">
      <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
        {{ error }}
      </div>
      
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Username</label>
        <input 
          id="username"
          v-model="username" 
          type="text" 
          placeholder="e.g. emilys"
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
        />
      </div>
      
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
        <input 
          id="password"
          v-model="password" 
          type="password" 
          placeholder="••••••••"
          class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none dark:text-white transition-all"
        />
      </div>
      
      <button 
        type="submit" 
        :disabled="isLoading"
        class="w-full py-4 bg-primary-500 hover:bg-secondary-400 text-white hover:text-primary-900 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center"
      >
        <span v-if="isLoading" class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <span v-else>Sign In</span>
      </button>
    </form>
    
    <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
      <p class="mb-4">Don't have an account? <router-link to="/signup" class="text-primary-600 dark:text-primary-400 font-bold hover:underline">Sign Up</router-link></p>
      <p>Test credentials: <br/> Username: <strong class="text-gray-800 dark:text-gray-200">emilys</strong> <br/> Password: <strong class="text-gray-800 dark:text-gray-200">emilyspass</strong></p>
    </div>
  </div>
</template>
