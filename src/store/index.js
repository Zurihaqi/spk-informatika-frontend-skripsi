import { createStore } from 'vuex'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    token: '',
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
    initialiseStore(state) {
      if (localStorage.getItem('token')) {
        state.token = localStorage.getItem('token')
      }
      if (state.token == '') {
        return false
      }
      return true
    },
    saveLogin(state, LoginData) {
      state.token = LoginData.token

      localStorage.setItem('token', LoginData.token)
    },

    Logout(state) {
      state.token = ''

      localStorage.removeItem('token')
    },
  },
  actions: {},
  modules: {},
})
