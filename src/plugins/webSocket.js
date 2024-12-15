import { io } from 'socket.io-client'
const socketConnect = io('https://your-new-socket-server-url', {
  autoConnect: false,
  transports: ['websocket'], // Chỉ sử dụng websocket để tránh lỗi fallback
  secure: true
});

export default socketConnect