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
import WebSocketPlugin from './plugins/webSocket';

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon)
app.use(WebSocketPlugin, { url: 'ws://localhost:8082' });
app.use(createPinia())
app.use(router)
app.use(ToastService)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})

// socket.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     // Xử lý tin nhắn nhận được từ server
//     console.log('Message received:', message);
//     // Cập nhật giao diện người dùng hoặc lưu trữ tin nhắn
// };

app.mount('#app')
