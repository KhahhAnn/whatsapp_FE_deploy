import { io } from 'socket.io-client'
const socketConnect = io('http://localhost:8080', {
  autoConnect: false
})
export default socketConnect

// 
// https://whatsapp-server-7wow.onrender.com