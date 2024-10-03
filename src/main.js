import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './plugins/fontawesome'

const app = createApp(App)

// Kết nối WebSocket
const socket = new WebSocket('ws://localhost:8081') // Địa chỉ WebSocket server

socket.onopen = () => {
  console.log('Connected to WebSocket server')
}

// socket.onmessage = (event) => {
//     const message = JSON.parse(event.data);
//     // Xử lý tin nhắn nhận được từ server
//     console.log('Message received:', message);
//     // Cập nhật giao diện người dùng hoặc lưu trữ tin nhắn
// };

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

app.mount('#app')
