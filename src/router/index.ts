import type { RouteRecordRaw, NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/services/firebase'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/Home.vue')
      },
      {
        path: 'surat-masuk',
        name: 'surat-masuk',
        component: () => import('@/views/SuratMasuk.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'surat-keluar',
        name: 'surat-keluar',
        component: () => import('@/views/SuratKeluar.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'disposisi',
        name: 'disposisi',
        component: () => import('@/views/Disposisi.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Tambahkan fungsi untuk menunggu autentikasi
function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

// Modifikasi navigation guard
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  
  if (requiresAuth) {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 