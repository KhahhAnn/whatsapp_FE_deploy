import { io } from 'socket.io-client'
const socketConnect = io('https://whatsapp-server-lemon.vercel.app/', {
  autoConnect: false,
  transports: ['websocket'], // Chỉ sử dụng websocket để tránh lỗi fallback
  secure: true
});

export default socketConnect