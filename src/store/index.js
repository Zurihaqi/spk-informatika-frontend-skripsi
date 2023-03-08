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
      const userdata = {
        name: `${LoginData.userData.name}`,
        email: `${LoginData.userData.email}`,
        role: `${
          LoginData.userData.role === 'ADMIN' ? 'Pengelola' : 'Mahasiswa'
        }`,
        student_id: `${
          LoginData.userData.student_id ? LoginData.userData.student_id : ''
        }`,
        profile_pic: `${
          LoginData.userData.profile_pic
            ? LoginData.userData.profile_pic
            : placeholder
        }`,
      }
      localStorage.setItem('userdata', JSON.stringify(userdata))
      window.$cookies.set('token', LoginData.token, '1h')
    },
    Logout() {
      window.$cookies.remove('token')
      localStorage.removeItem('userdata')
    },
  },
  actions: {},
  modules: {},
})
