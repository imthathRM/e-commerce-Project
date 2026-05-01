<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrderStore } from '@/stores/orders'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  CreditCardIcon,
  BellIcon,
  ShieldCheckIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon, ClockIcon, TruckIcon } from '@heroicons/vue/24/solid'

const authStore = useAuthStore()
const orderStore = useOrderStore()
const { user } = storeToRefs(authStore)
const { orders } = storeToRefs(orderStore)

const activeTab = ref('profile')
const isEditingProfile = ref(false)
const editForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '+1 (555) 000-0000',
  location: 'New York, USA'
})

const startEditing = () => {
  if (user.value) {
    editForm.value = {
      firstName: user.value.firstName,
      lastName: user.value.lastName,
      email: user.value.email,
      phone: '+1 (555) 000-0000',
      location: 'New York, USA'
    }
    isEditingProfile.value = true
  }
}

const handleUpdateProfile = () => {
  authStore.updateUser({
    firstName: editForm.value.firstName,
    lastName: editForm.value.lastName,
    email: editForm.value.email
  })
  isEditingProfile.value = false
}

const tabs = [
  { id: 'profile', name: 'Profile Info', icon: UserIcon },
  { id: 'orders', name: 'Order History', icon: ShoppingBagIcon },
  { id: 'settings', name: 'Settings', icon: Cog6ToothIcon },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleLogout = () => {
  authStore.logout()
  window.location.href = '/'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Delivered': return 'text-green-600 bg-green-50 dark:bg-green-900/20'
    case 'Processing': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    case 'Shipped': return 'text-purple-600 bg-purple-50 dark:bg-purple-900/20'
    default: return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Delivered': return CheckCircleIcon
    case 'Processing': return ClockIcon
    case 'Shipped': return TruckIcon
    default: return ClockIcon
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900/50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
      
      <!-- Sidebar -->
      <aside class="w-full lg:w-72 flex-shrink-0">
        <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
          <!-- User Profile Brief -->
          <div class="p-6 text-center border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/10">
            <div class="relative inline-block mb-4">
              <img 
                :src="user?.image" 
                alt="Profile" 
                class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 shadow-md object-cover mx-auto"
              />
              <div class="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
            </div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}</h2>
            <p class="text-sm text-gray-500 dark:text-gray-400">@{{ user?.username }}</p>
          </div>

          <!-- Navigation Menu -->
          <nav class="p-4">
            <ul class="space-y-2">
              <li v-for="tab in tabs" :key="tab.id">
                <button 
                  @click="activeTab = tab.id"
                  :class="[
                    'w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200',
                    activeTab === tab.id 
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20 scale-[1.02]' 
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  ]"
                >
                  <component :is="tab.icon" class="w-5 h-5" />
                  {{ tab.name }}
                  <ChevronRightIcon v-if="activeTab !== tab.id" class="w-4 h-4 ml-auto text-gray-400" />
                </button>
              </li>
              <li class="pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                <button 
                  @click="handleLogout"
                  class="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <ArrowRightOnRectangleIcon class="w-5 h-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-grow">
        <Transition name="fade" mode="out-in">
          
          <!-- Profile Info Section -->
          <div v-if="activeTab === 'profile'" key="profile" class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
              <div class="flex items-center justify-between mb-8">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
                <button 
                  v-if="!isEditingProfile"
                  @click="startEditing"
                  class="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-primary-600 dark:text-primary-400 text-sm font-bold rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                >
                  Edit Profile
                </button>
              </div>

              <!-- View Mode -->
              <div v-if="!isEditingProfile" class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                      <UserIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Full Name</p>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ user?.firstName }} {{ user?.lastName }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                      <EnvelopeIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">{{ user?.email }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                      <PhoneIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">+1 (555) 000-0000</p>
                    </div>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                      <CalendarIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Gender</p>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white capitalize">{{ user?.gender }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-2xl text-primary-600 dark:text-primary-400">
                      <MapPinIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">Location</p>
                      <p class="text-lg font-semibold text-gray-900 dark:text-white">New York, USA</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Edit Mode -->
              <form v-else @submit.prevent="handleUpdateProfile" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">First Name</label>
                    <input v-model="editForm.firstName" type="text" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Name</label>
                    <input v-model="editForm.lastName" type="text" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">Email</label>
                    <input v-model="editForm.email" type="email" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" required />
                  </div>
                  <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</label>
                    <input v-model="editForm.phone" type="text" class="w-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" />
                  </div>
                </div>
                <div class="flex items-center gap-4 justify-end pt-4">
                  <button type="button" @click="isEditingProfile = false" class="px-6 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                    Cancel
                  </button>
                  <button type="submit" class="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary-600/20">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div v-for="stat in [
                { label: 'Total Orders', value: orders.length, icon: ShoppingBagIcon, color: 'bg-blue-500' },
                { label: 'Saved Items', value: '12', icon: ClockIcon, color: 'bg-rose-500' },
                { label: 'Reward Points', value: '2,450', icon: CreditCardIcon, color: 'bg-amber-500' }
              ]" :key="stat.label" class="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div class="flex items-center gap-4">
                  <div :class="['p-3 rounded-2xl text-white', stat.color]">
                    <component :is="stat.icon" class="w-6 h-6" />
                  </div>
                  <div>
                    <p class="text-xs font-bold text-gray-400 uppercase tracking-widest">{{ stat.label }}</p>
                    <p class="text-2xl font-extrabold text-gray-900 dark:text-white">{{ stat.value }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Order History Section -->
          <div v-else-if="activeTab === 'orders'" key="orders" class="space-y-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white px-2">Order History</h3>
              <span class="bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {{ orders.length }} Orders
              </span>
            </div>

            <div v-if="orders.length === 0" class="bg-white dark:bg-gray-800 rounded-3xl p-16 text-center shadow-sm border border-gray-100 dark:border-gray-700">
              <div class="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                <ShoppingBagIcon class="w-10 h-10" />
              </div>
              <h4 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders yet</h4>
              <p class="text-gray-500 dark:text-gray-400 mb-8">When you buy something, it will appear here.</p>
              <router-link to="/products" class="bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-primary-600/20">
                Go to Shop
              </router-link>
            </div>

            <div v-else class="space-y-4">
              <div 
                v-for="order in orders" 
                :key="order.id" 
                class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div class="p-6 border-b border-gray-50 dark:border-gray-700/50 flex flex-wrap items-center justify-between gap-4">
                  <div class="flex items-center gap-4">
                    <div class="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <ShoppingBagIcon class="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900 dark:text-white">{{ order.id }}</p>
                      <p class="text-xs text-gray-500">{{ formatDate(order.date) }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div :class="['px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2', getStatusColor(order.status)]">
                      <component :is="getStatusIcon(order.status)" class="w-4 h-4" />
                      {{ order.status }}
                    </div>
                    <div class="text-right">
                      <p class="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Amount</p>
                      <p class="text-lg font-extrabold text-primary-600 dark:text-primary-400">{{ formatPrice(order.total) }}</p>
                    </div>
                  </div>
                </div>
                
                <div class="p-6 bg-gray-50/30 dark:bg-gray-900/20">
                  <div class="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                    <div v-for="item in order.items" :key="item.id" class="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-1">
                      <img :src="item.thumbnail" :alt="item.title" class="w-full h-full object-contain" />
                    </div>
                    <div v-if="order.items.length > 5" class="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">
                      +{{ order.items.length - 5 }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Settings Section -->
          <div v-else-if="activeTab === 'settings'" key="settings" class="space-y-6">
            <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div class="p-8 border-b border-gray-100 dark:border-gray-700">
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Account Settings</h3>
                <p class="text-sm text-gray-500 mt-1">Manage your account preferences and security.</p>
              </div>
              
              <div class="p-8 space-y-8">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl text-blue-600">
                      <BellIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-base font-bold text-gray-900 dark:text-white">Email Notifications</p>
                      <p class="text-sm text-gray-500">Receive updates about your orders and promos.</p>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked class="sr-only peer">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600">
                      <ShieldCheckIcon class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-base font-bold text-gray-900 dark:text-white">Two-Factor Authentication</p>
                      <p class="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                    </div>
                  </div>
                  <button class="px-4 py-2 border-2 border-gray-100 dark:border-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>

            <div class="bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 p-8 flex items-center justify-between">
              <div>
                <p class="text-lg font-bold text-red-600 dark:text-red-400">Delete Account</p>
                <p class="text-sm text-red-500/70">Once you delete your account, there is no going back. Please be certain.</p>
              </div>
              <button class="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20">
                Delete Account
              </button>
            </div>
          </div>

        </Transition>
      </main>

    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
