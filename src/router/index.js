import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout'
import store from '../store'

const routes = [
  {
    path: '/',
    name: 'Halaman Utama',
    component: DefaultLayout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Instruksi Penggunaan',
        component: () => import('@/views/Dashboard.vue'),
      },
    ],
  },
  {
    path: '/profile',
    name: 'Akun',
    component: DefaultLayout,
    redirect: '/profile/view',
    children: [
      {
        path: '/profile/view',
        name: 'Biodata',
        component: () => import('@/views/pages/profile/ViewProfile.vue'),
      },
      {
        path: '/profile/edit',
        name: 'Ubah Biodata',
        component: () => import('@/views/pages/profile/EditProfile.vue'),
      },
      {
        path: '/profile/password',
        name: 'Ubah Kata Sandi',
        component: () => import('@/views/pages/profile/ChangePassword.vue'),
      },
    ],
  },
  {
    path: '/course',
    name: 'Mata Kuliah',
    component: DefaultLayout,
    redirect: '/course/view',
    children: [
      {
        path: '/course/view',
        name: 'Data Mata Kuliah',
        component: () => import('@/views/pages/course/ViewCourse.vue'),
      },
      {
        path: '/course/spec',
        name: 'Relasi Peminatan',
        component: () => import('@/views/pages/course/CourseSpec.vue'),
      },
    ],
  },
  {
    path: '/spk',
    name: 'SPK',
    component: DefaultLayout,
    redirect: '/spk/calculate',
    children: [
      {
        path: '/spk/grade',
        name: 'Input Nilai',
        component: () => import('@/views/pages/spk/GradeInput.vue'),
      },
      {
        path: '/spk/rule',
        name: 'Daftar Rule',
        meta: {
          pengelola: true,
        },
        component: () => import('@/views/pages/spk/RuleSets.vue'),
      },
      {
        path: '/spk/calculate',
        name: 'Hitung Peminatan',
        component: () => import('@/views/pages/spk/CalculateFis.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      public: true,
    },
    component: () => import('@/views/pages/auth/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    meta: {
      public: true,
    },
    component: () => import('@/views/pages/auth/Register.vue'),
  },
  {
    path: '/form',
    name: 'SpecForm',
    component: () => import('@/views/pages/specForm/SpecForm.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      public: true,
    },
    component: () => import('@/views/pages/Page404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  const token = window.$cookies.get('token')
  const role = store.state.role
  if (!to.meta.public) {
    if (token) next()
    else next('/login')
  } else {
    if (token ? (to.path === '/login' ? next('/') : true) : true) next()
  }
  if (to.meta.admin) {
    if (role !== 'Admin') router.push({ name: '404' })
  } else {
    next()
  }
  if (to.meta.pengelola) {
    const allowedRoles = ['Pengelola', 'Admin']
    if (!allowedRoles.includes(role)) router.push({ name: '404' })
  } else {
    next()
  }
})

export default router
