<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sidebar -->
    <aside 
      class="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300"
      :class="{ '-translate-x-full': !isOpen }"
    >
      <!-- Logo -->
      <div class="p-4 border-b">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center">
            <span class="text-white font-bold text-xl">MB</span>
          </div>
          <div>
            <h1 class="font-bold text-gray-900">SMAN Modal Bangsa</h1>
            <p class="text-sm text-gray-500">Sistem Arsip Surat</p>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2">
        <router-link 
          v-for="item in menuItems" 
          :key="item.title"
          :to="item.path"
          class="flex items-center px-4 py-2.5 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          :class="{ 'bg-primary-50 text-primary-700': $route.path === item.path }"
        >
          <i :class="item.icon" class="mr-3 text-lg"></i>
          {{ item.title }}
        </router-link>
      </nav>

      <!-- Logout Button -->
      <div class="absolute bottom-0 w-full p-4 border-t">
        <button 
          @click="handleLogout"
          class="w-full px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <i class="fas fa-sign-out-alt mr-2"></i>
          Logout
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="ml-64">
      <!-- Header -->
      <header class="bg-white shadow-sm">
        <div class="flex items-center justify-between px-6 py-4">
          <button 
            @click="isOpen = !isOpen"
            class="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <i class="fas fa-bars text-xl"></i>
          </button>
          <h1 class="text-xl font-semibold text-gray-800">
            Arsip Surat SMAN Modal Bangsa
          </h1>
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700">
              <i class="fas fa-bell text-xl"></i>
            </button>
            <div class="relative">
              <button 
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
              >
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <i class="fas fa-user text-gray-600"></i>
                </div>
                <span>Admin</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <!-- Dropdown -->
              <div 
                v-if="isProfileOpen"
                class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
              >
                <a href="#" class="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-user-cog mr-2"></i>
                  Pengaturan
                </a>
                <button 
                  @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase'
import { signOut } from 'firebase/auth'

const router = useRouter()
const isOpen = ref(true)
const isProfileOpen = ref(false)

const menuItems = [
  { 
    title: 'Dashboard', 
    path: '/', 
    icon: 'fas fa-tachometer-alt'
  },
  { 
    title: 'Surat Masuk', 
    path: '/surat-masuk', 
    icon: 'fas fa-inbox'
  },
  { 
    title: 'Surat Keluar', 
    path: '/surat-keluar', 
    icon: 'fas fa-paper-plane'
  },
  { 
    title: 'Disposisi', 
    path: '/disposisi', 
    icon: 'fas fa-file-alt'
  }
]

const handleLogout = async () => {
  try {
    await signOut(auth)
    router.push('/login')
  } catch (error) {
    console.error('Error logging out:', error)
  }
}
</script> 