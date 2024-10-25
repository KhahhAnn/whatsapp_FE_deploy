// src/stores/useSocketStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import socket from '../plugins/webSocket'

export const useSocketStore = defineStore('socket', () => {
  const isLoggedIn = ref(false)
  const messages = ref([]); // Danh sách tin nhắn

  const connect = () => {
    if (!isLoggedIn.value && !socket.connected) {
      //Truyền userid từ localstorage vào socket để xác thực
      socket.auth = {
        userId: localStorage.getItem('userId')
      }
      console.log('Connect socket: ', socket.auth)
      socket.connect()
    }
  }

  //Lắng nghe sự kiện kết nối socket
  socket.on('connect', () => {
    isLoggedIn.value = true
  })

  socket.on('getUsersOnline', (usersData) => {
    console.log('Users online: ', usersData)
  })

  socket.on('userJustConnected', (userData) => {
    console.log('User just connected: ', userData)
  })

  const sendMessage = (message, from, to) => {
    socket.emit('privateMessage', {
      message,
      from,
      to
    });
    console.log('Send message: ', message, to);
  }

  const listenForMessages = () => {
    socket.on('privateMessageToReceiver', ({ message, from }) => {
      messages.value.push({ content: message, from }); // Thêm tin nhắn vào danh sách
      console.log('Received message: ', message, from);
      // server -> socketio -> privateMessageToReceiver -> store -> component render
      // load -> api -> store -> component
      // messageStore.addMessage(message,from)
    });
  };

  // Gọi phương thức này khi khởi tạo store
  listenForMessages();

  socket.on('disconnect', () => {
    isLoggedIn.value = false
    console.log('Socket disconnected')
  })

  return {
    isLoggedIn,
    connect,
    sendMessage,
    disconnect: () => socket.disconnect(),
    messages // Thêm danh sách tin nhắn vào return
  }
})
