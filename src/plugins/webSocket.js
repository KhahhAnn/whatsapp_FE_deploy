import { io } from 'socket.io-client'
const socketConnect = io('https://whatsapp-server-lemon.vercel.app/');

export default socketConnect