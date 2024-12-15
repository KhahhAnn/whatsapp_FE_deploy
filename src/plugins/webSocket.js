import { io } from 'socket.io-client'
const socketConnect = io('whatsapp-server-lemon.vercel.app', {
  autoConnect: false
})
export default socketConnect