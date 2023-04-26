import { createStore } from 'vuex'
import jwtDecode from 'jwt-decode'
import placeholder from '@/assets/images/placeholder.png'
import CryptoJS from 'crypto-js'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    token: '',
    role: localStorage.getItem('role')
      ? CryptoJS.AES.decrypt(
          localStorage.getItem('role'),
          process.env.VUE_APP_AES_SECRET,
        ).toString(CryptoJS.enc.Utf8)
      : '',
    email: localStorage.getItem('email')
      ? CryptoJS.AES.decrypt(
          localStorage.getItem('email'),
          process.env.VUE_APP_AES_SECRET,
        ).toString(CryptoJS.enc.Utf8)
      : '',
    name: localStorage.getItem('name')
      ? CryptoJS.AES.decrypt(
          localStorage.getItem('name'),
          process.env.VUE_APP_AES_SECRET,
        ).toString(CryptoJS.enc.Utf8)
      : '',
    student_id: localStorage.getItem('student_id')
      ? CryptoJS.AES.decrypt(
          localStorage.getItem('student_id'),
          process.env.VUE_APP_AES_SECRET,
        ).toString(CryptoJS.enc.Utf8)
      : '',
    backendUrl: process.env.VUE_APP_BACKEND_URL,
    siteKey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
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
    initialiseStore(state) {
      if (window.$cookies.get('token')) {
        state.token = window.$cookies.get('token')
      }
      if (state.token === '') {
        return false
      }
      return true
    },
    saveLogin(state, LoginData) {
      const decoded = jwtDecode(LoginData.token)
      if (decoded) {
        localStorage.setItem('role', decoded.role)
        localStorage.setItem('name', decoded.name)
        localStorage.setItem('email', decoded.email)
        localStorage.setItem(
          'student_id',
          decoded.student_id ? decoded.student_id : '',
        )
        localStorage.setItem(
          'profile_pic',
          decoded.profile_pic ? decoded.profile_pic : placeholder,
        )
      }
      window.$cookies.set('token', LoginData.token, '1h')
    },
    Logout() {
      window.$cookies.remove('token')
      localStorage.clear()
    },
  },
  actions: {},
  modules: {},
})
