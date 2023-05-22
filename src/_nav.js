import store from './store'

const role = store.state.role

export default [
  {
    component: 'CNavItem',
    name: <hr />,
  },
  {
    component: 'CNavItem',
    name: (
      <p class="text-center user-select-none">
        Masuk sebagai <b>{role}</b>
        <hr />
      </p>
    ),
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
        to: '/spk/rule',
      },
      {
        component: 'CNavItem',
        name: 'Hitung Peminatan',
        to: '/spk/calculate',
      },
      {
        component: 'CNavItem',
        name: 'Riwayat Rekomendasi',
        to: '/spk/history',
      },
      {
        component:
          role === 'Pengelola' || role === 'Admin' ? 'CNavItem' : 'invisible',
        name: role === 'Pengelola' || role === 'Admin' ? 'Laporan SPK' : '',
        to: '/spk/report',
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
    component: 'CNavItem',
    name: <hr />,
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
    component:
      role === 'Pengelola' || role === 'Admin' ? 'CNavItem' : 'invisible',
    name: role === 'Pengelola' || role === 'Admin' ? 'Riwayat Audit' : '',
    to: '/audit',
    icon: role === 'Pengelola' || role === 'Admin' ? 'cil-description' : '',
  },
  {
    component: role === 'Admin' ? 'CNavGroup' : 'invisible',
    name: role === 'Admin' ? 'Admin' : '',
    to: '/admin/register',
    icon: role === 'Admin' ? 'cil-warning' : '',
    items:
      role === 'Admin'
        ? [
            {
              component: 'CNavItem',
              name: 'Daftar Pengguna',
              to: '/admin/register',
            },
            {
              component: 'CNavItem',
              name: 'Setujui Pengelola Baru',
              to: '/admin/approve',
            },
          ]
        : '',
  },
]
