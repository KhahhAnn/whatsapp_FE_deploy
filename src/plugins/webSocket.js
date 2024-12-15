import { io } from 'socket.io-client'
const socketConnect = io('https://whatsapp-server-7wow.onrender.com/');

export default socketConnect