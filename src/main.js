import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import router from './router/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import ToastService from 'primevue/toastservice'
import { io } from 'socket.io-client';
const app = createApp(App)

const socket = io('http://localhost:8080');

// Cung cấp socket instance trên toàn ứng dụng
app.provide('socket', socket);

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

app.mount('#app')
