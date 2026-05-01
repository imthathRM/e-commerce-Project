import { defineStore } from 'pinia';
import { ref } from 'vue';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  icon?: string;
  subtext?: string;
}

let nextId = 0;

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([]);

  const addToast = (message: string, type: ToastType = 'success', subtext?: string, icon?: string) => {
    const id = ++nextId;
    toasts.value.push({ id, message, type, subtext, icon });
    setTimeout(() => removeToast(id), 3000);
    return id;
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.value.splice(index, 1);
    }
  };

  return { toasts, addToast, removeToast };
});
