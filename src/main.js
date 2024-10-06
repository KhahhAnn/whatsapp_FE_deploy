import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './assets/main.css'
import router from './router/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';

const app = createApp(App)

// Kết nối WebSocket
const socket = new WebSocket('ws://localhost:8081') // Địa chỉ WebSocket server

socket.onopen = () => {
  console.log('Connected to WebSocket server')
}

socket.onclose = () => {
  console.log('Disconnected from WebSocket server')
  // Có thể thêm logic để tự động kết nối lại
}

socket.onerror = (error) => {
  console.error('WebSocket error:', error)
}

app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)
app.use(ToastService);
app.use(PrimeVue, {
  theme: {
      preset: Aura
  }
});

// socket.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     // Xử lý tin nhắn nhận được từ server
//     console.log('Message received:', message);
//     // Cập nhật giao diện người dùng hoặc lưu trữ tin nhắn
// };

app.mount('#app')
