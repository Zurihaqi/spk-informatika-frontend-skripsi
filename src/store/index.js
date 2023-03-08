import { createStore } from 'vuex'
import placeholder from '@/assets/images/avatars/placeholder.png'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    backendUrl: process.env.VUE_APP_BACKEND_URL,
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    saveLogin(state, LoginData) {
      LoginData.userData.role === 'ADMIN'
        ? window.$cookies.set('role', 'Pengelola', '1h')
        : window.$cookies.set('role', 'Mahasiswa', '1h')
      window.$cookies.set('username', LoginData.userData.name, '1h')
      LoginData.userData.profile_pic
        ? window.$cookies.set(
            'profile_pic',
            LoginData.userData.profile_pic,
            '1h',
          )
        : window.$cookies.set('profile_pic', placeholder, '1h')
      window.$cookies.set('email', LoginData.userData.email, '1h')
      LoginData.userData.student_id
        ? window.$cookies.set('student_id', LoginData.userData.student_id, '1h')
        : window.$cookies.set('student_id', '', '1h')

      window.$cookies.set('token', LoginData.token, '1h')
    },
    Logout() {
      window.$cookies.remove('token')
    },
  },
  actions: {},
  modules: {},
})
