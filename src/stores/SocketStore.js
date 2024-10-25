// src/stores/useSocketStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import socket from '../plugins/webSocket'

export const useSocketStore = defineStore('socket', () => {
  const isLoggedIn = ref(false)

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

  socket.on('privateMessageToReceiver', ({ message, from }) => {
    console.log('Received message: ', message, from)
    // server -> socketio -> privateMessageToReceiver -> store -> component render
    // load -> api -> store -> component
    // messageStore.addMessage(message,from)
  })

  socket.on('disconnect', () => {
    isLoggedIn.value = false
    console.log('Socket disconnected')
  })

  return {
    isLoggedIn,
    connect,
    disconnect: () => socket.disconnect()
  }
})