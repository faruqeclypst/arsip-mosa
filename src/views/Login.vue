<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo dan Header -->
      <div class="text-center">
        <div class="w-20 h-20 rounded-full bg-primary-600 mx-auto flex items-center justify-center mb-4">
          <span class="text-white font-bold text-2xl">MB</span>
        </div>
        <h2 class="text-3xl font-bold text-gray-900">
          SMAN Modal Bangsa
        </h2>
        <p class="mt-2 text-sm text-gray-600">
          Sistem Informasi Arsip Surat
        </p>
      </div>

      <!-- Form Login -->
      <div class="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div class="mt-1">
              <input
                v-model="email"
                id="email"
                type="email"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div class="mt-1 relative">
              <input
                v-model="password"
                id="password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i 
                  :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"
                  class="text-gray-400 hover:text-gray-500"
                ></i>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <i class="fas fa-exclamation-circle text-red-400 mt-0.5"></i>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ error }}
                </h3>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              :disabled="loading"
              class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i v-if="loading" class="fas fa-circle-notch fa-spin mr-2"></i>
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

// Initial admin setup
const createInitialAdmin = async () => {
  try {
    const adminEmail = 'admin@mosa.com'
    const adminPassword = 'admin123'
    
    await createUserWithEmailAndPassword(auth, adminEmail, adminPassword)
    console.log('Admin account created successfully')
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('Admin account already exists')
    } else {
      console.error('Error creating admin:', err)
    }
  }
}

// Uncomment this to create initial admin
createInitialAdmin()

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/')
  } catch (err: any) {
    switch (err.code) {
      case 'auth/invalid-email':
        error.value = 'Email tidak valid'
        break
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        error.value = 'Email atau password salah'
        break
      default:
        error.value = 'Terjadi kesalahan saat login'
        console.error('Login error:', err)
    }
  } finally {
    loading.value = false
  }
}
</script> 