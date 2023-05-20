import { createApp } from 'vue'
import App from './App.vue'
import VueCookies from 'vue-cookies'
import router from './router'
import store from './store'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { iconsSet as icons } from '@/assets/icons'
import VueHtmlToPaper from '@/plugins/VueHtmlToPaper'

const app = createApp(App)
app.use(VueCookies)
app.use(store)
app.use(router)
app.use(CoreuiVue)
app.use(VueHtmlToPaper)
app.provide('icons', icons)
app.component('CIcon', CIcon)

app.mount('#app')
