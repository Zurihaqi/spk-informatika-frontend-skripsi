import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

import DefaultLayout from '@/layouts/DefaultLayout'

const routes = [
  {
    path: '/',
    name: 'Halaman Utama',
    component: DefaultLayout,
    redirect: '/',
    children: [
      {
        path: '/',
        name: 'Petunjuk Penggunaan',
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
    // always scroll to top
    return { top: 0 }
  },
})

router.beforeEach((to, from, next) => {
  let token = store.state.token
  if (!to.meta.public) {
    if (token) next()
    else next('/login')
  } else {
    if (token ? (to.path === '/login' ? next('/') : true) : true) next()
  }
})

export default router
