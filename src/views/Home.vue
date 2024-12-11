<template>
  <div>
    <!-- Header Section -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
      <p class="mt-2 text-sm text-gray-700">Overview statistik arsip surat</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Surat Masuk Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-inbox text-2xl text-blue-600"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Surat Masuk
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ suratMasukCount }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-blue-50 px-5 py-3">
          <router-link 
            to="/surat-masuk"
            class="text-sm font-medium text-blue-700 hover:text-blue-900 flex items-center"
          >
            Lihat detail
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>

      <!-- Surat Keluar Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-paper-plane text-2xl text-green-600"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Surat Keluar
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ suratKeluarCount }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-green-50 px-5 py-3">
          <router-link 
            to="/surat-keluar"
            class="text-sm font-medium text-green-700 hover:text-green-900 flex items-center"
          >
            Lihat detail
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>

      <!-- Disposisi Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-file-alt text-2xl text-purple-600"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Disposisi
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ disposisiCount }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-purple-50 px-5 py-3">
          <router-link 
            to="/disposisi"
            class="text-sm font-medium text-purple-700 hover:text-purple-900 flex items-center"
          >
            Lihat detail
            <i class="fas fa-arrow-right ml-2"></i>
          </router-link>
        </div>
      </div>

      <!-- Total Surat Card -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="p-5">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-envelope text-2xl text-orange-600"></i>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Total Surat
                </dt>
                <dd class="flex items-baseline">
                  <div class="text-2xl font-semibold text-gray-900">
                    {{ suratMasukCount + suratKeluarCount }}
                  </div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-orange-50 px-5 py-3">
          <div class="text-sm font-medium text-orange-700">
            Total keseluruhan surat
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="mt-8">
      <h2 class="text-lg font-medium text-gray-900 mb-4">Aktivitas Terbaru</h2>
      <div class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul role="list" class="divide-y divide-gray-200">
          <li v-for="(surat, index) in recentActivities" :key="index">
            <div class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div 
                    class="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center"
                    :class="getActivityColor(surat.type)"
                  >
                    <i :class="getActivityIcon(surat.type)" class="text-white"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-sm font-medium text-gray-900">
                      {{ surat.nomor }}
                    </p>
                    <p class="text-sm text-gray-500">
                      {{ surat.perihal }}
                    </p>
                  </div>
                </div>
                <div class="ml-2 flex-shrink-0">
                  <p class="text-sm text-gray-500">
                    {{ formatDate(surat.tanggal) }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { db } from '@/services/firebase'
import { ref as dbRef, onValue, query, limitToLast, orderByChild } from 'firebase/database'

const suratMasukCount = ref(0)
const suratKeluarCount = ref(0)
const disposisiCount = ref(0)
const recentActivities = ref<any[]>([])

onMounted(() => {
  loadCounts()
  loadRecentActivities()
})

const loadCounts = () => {
  const suratMasukRef = dbRef(db, 'surat-masuk')
  const suratKeluarRef = dbRef(db, 'surat-keluar')
  const disposisiRef = dbRef(db, 'disposisi')

  onValue(suratMasukRef, (snapshot) => {
    suratMasukCount.value = snapshot.size || 0
  })

  onValue(suratKeluarRef, (snapshot) => {
    suratKeluarCount.value = snapshot.size || 0
  })

  onValue(disposisiRef, (snapshot) => {
    disposisiCount.value = snapshot.size || 0
  })
}

const loadRecentActivities = () => {
  // Load 5 most recent surat masuk
  const recentSuratMasukQuery = query(
    dbRef(db, 'surat-masuk'),
    orderByChild('tanggal'),
    limitToLast(5)
  )

  onValue(recentSuratMasukQuery, (snapshot) => {
    const activities: any[] = []
    snapshot.forEach((child) => {
      activities.push({
        ...child.val(),
        id: child.key,
        type: 'surat-masuk'
      })
    })
    recentActivities.value = activities.reverse()
  })
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'surat-masuk':
      return 'bg-blue-600'
    case 'surat-keluar':
      return 'bg-green-600'
    case 'disposisi':
      return 'bg-purple-600'
    default:
      return 'bg-gray-600'
  }
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'surat-masuk':
      return 'fas fa-inbox'
    case 'surat-keluar':
      return 'fas fa-paper-plane'
    case 'disposisi':
      return 'fas fa-file-alt'
    default:
      return 'fas fa-envelope'
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 