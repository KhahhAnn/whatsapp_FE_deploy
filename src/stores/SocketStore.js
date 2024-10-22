// src/stores/useSocketStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import socket from '../plugins/webSocket' // Giả sử bạn đã có socket client
import { useAccountStore } from './AccountStore'

export const useSocketStore = defineStore('socket', () => {
  const isConnected = ref(false)
  const accountStore = useAccountStore()

  const connect = () => {
    if (!isConnected.value && !socket.connected) {
      //truyen userid tu localstorage vao socket
      socket.auth = {
        userId: localStorage.getItem('userId')
      }
      console.log('socket.auth', socket.auth)
      socket.connect()
    }
  }

  socket.on('connect', () => {
    isConnected.value = true
    console.log('Socket connected')
  })

  const sendMessageStore = (message) => {
    console.log(accountStore.selectedAccount.contactId)

    socket.emit('sendPrivateMessage', {
      message: message,
      to: accountStore.selectedAccount.contactId
    })

    console.log('message client', message)
  }

  socket.on('disconnect', () => {
    isConnected.value = false
    console.log('Socket disconnected')
  })

  return { isConnected, connect, sendMessageStore, disconnect: () => socket.disconnect() }
})
