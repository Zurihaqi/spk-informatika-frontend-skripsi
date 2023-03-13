const role = localStorage.getItem('role')
export default [
  {
    component: 'hr',
  },
  {
    component: 'CNavItem',
    name: (
      <p class="mt-2 text-center user-select-none h6">Masuk sebagai {role}</p>
    ),
  },
  {
    component: 'hr',
  },
  {
    component: 'CNavItem',
    name: 'Instruksi Penggunaan',
    to: '/',
    icon: 'cil-info',
  },
  {
    component: 'CNavGroup',
    name: 'SPK Peminatan',
    to: '/',
    icon: 'cil-education',
    items: [
      {
        component: 'CNavItem',
        name: 'Input Nilai',
        to: '/spk/grade',
      },
      {
        component:
          role === 'Pengelola' || role === 'Admin' ? 'CNavItem' : 'invisible',
        name: role === 'Pengelola' || role === 'Admin' ? 'Data Rule' : '',
        to:
          role === 'Pengelola' || role === 'Admin' ? '/spk/rule' : '/spk/rule',
      },
      {
        component: 'CNavItem',
        name: 'Hitung Peminatan',
        to: '/spk/calculate',
      },
    ],
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
        name: 'Data Relasi Peminatan',
        to: '/course/spec',
      },
    ],
  },
  {
    component: 'hr',
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
  {
    component: 'CNavGroup',
    name: 'Pengelola',
    to: '/',
    icon: 'cil-user',
    items: [
      {
        component: 'CNavItem',
        name: 'Daftarkan Pengelola',
        to: '/admin/register',
      },
      {
        component: 'CNavItem',
        name: 'Data Pengelola',
        to: '/admin/view',
      },
    ],
  },
]
