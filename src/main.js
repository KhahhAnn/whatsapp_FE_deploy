import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router/router'

// Nhập thành phần FontAwesomeIcon
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Nhập cài đặt FontAwesome
import './plugins/fontawesome'

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.mount('#app')
