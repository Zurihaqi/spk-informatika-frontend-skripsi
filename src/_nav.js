const role = localStorage.getItem('role')
const shownRole = role === 'ADMIN' ? 'Pengelola' : 'Mahasiswa'

export default [
  {
    component: 'hr',
  },
  {
    component: 'CNavItem',
    name: (
      <p class="mt-2 text-center user-select-none h6">
        Masuk sebagai {shownRole}
      </p>
    ),
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
        component: 'CNavItem',
        name: 'Daftar Rule',
        to: '/spk/rule',
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
        name: 'Relasi Peminatan',
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
]
