const role = localStorage.getItem('role')

export default [
  {
    component: 'hr',
  },
  {
    component: 'CNavItem',
    name: <p class="text-center user-select-none h6">Masuk sebagai {role}</p>,
  },
  {
    component: 'hr',
  },
  {
    component: 'CNavItem',
    name: 'Petunjuk Penggunaan',
    to: '/',
    icon: 'cil-info',
  },
  {
    component: 'CNavTitle',
    name: 'Mata Kuliah dan Peminatan',
  },
  {
    component: 'CNavGroup',
    name: 'Mata Kuliah',
    to: '/',
    icon: 'cil-book',
    items: [
      {
        component: 'CNavItem',
        name: 'Data Mata Kuliah',
        to: '/course/view',
      },
      {
        component: 'CNavItem',
        name: 'Relasi Peminatan',
        to: '/course/spec',
      },
    ],
  },
  {
    component: 'CNavGroup',
    name: 'Akun',
    to: '/',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Biodata',
        to: '/profile/view',
      },
      {
        component: 'CNavItem',
        name: 'Ubah Biodata',
        to: '/profile/edit',
      },
      {
        component: 'CNavItem',
        name: 'Ubah Kata Sandi',
        to: '/profile/password',
      },
    ],
  },
]
