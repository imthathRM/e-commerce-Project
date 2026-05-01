<script setup lang="ts">
import { computed } from 'vue'
import { useToastStore } from '@/stores/toast'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/vue/24/solid'

const toastStore = useToastStore()

const iconMap = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  info: InformationCircleIcon,
  warning: InformationCircleIcon,
}

const colorMap = {
  success: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-emerald-500',
    bar: 'bg-emerald-500',
    border: 'border-emerald-200 dark:border-emerald-800/50',
  },
  error: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-red-500',
    bar: 'bg-red-500',
    border: 'border-red-200 dark:border-red-800/50',
  },
  info: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-blue-500',
    bar: 'bg-blue-500',
    border: 'border-blue-200 dark:border-blue-800/50',
  },
  warning: {
    bg: 'bg-white dark:bg-gray-900',
    icon: 'text-amber-500',
    bar: 'bg-amber-500',
    border: 'border-amber-200 dark:border-amber-800/50',
  },
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
    >
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-3">
        <div
          v-for="toast in toastStore.toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto w-80 rounded-2xl shadow-2xl border overflow-hidden',
            colorMap[toast.type].bg,
            colorMap[toast.type].border,
          ]"
        >
          <!-- Progress bar -->
          <div
            :class="['h-1 w-full animate-shrink', colorMap[toast.type].bar]"
          />
          
          <div class="flex items-start gap-3 p-4">
            <!-- Icon -->
            <component
              :is="iconMap[toast.type]"
              :class="['w-6 h-6 flex-shrink-0 mt-0.5', colorMap[toast.type].icon]"
            />
            
            <!-- Content -->
            <div class="flex-grow min-w-0">
              <p class="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{{ toast.message }}</p>
              <p v-if="toast.subtext" class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{{ toast.subtext }}</p>
            </div>
            
            <!-- Close -->
            <button
              @click="toastStore.removeToast(toast.id)"
              class="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <XMarkIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.25s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.9);
}

@keyframes shrink {
  from { width: 100%; }
  to { width: 0%; }
}
.animate-shrink {
  animation: shrink 3s linear forwards;
}
</style>
