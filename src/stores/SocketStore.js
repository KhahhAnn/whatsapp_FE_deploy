// src/stores/useSocketStore.js
import { ref } from 'vue'
import { defineStore } from 'pinia'
import socket from '../plugins/webSocket'
import { useMessageStore } from './MessageStore'
import { useAccountStore } from './AccountStore'

export const useSocketStore = defineStore('socket', () => {
  const isLoggedIn = ref(false)
  const messages = ref([]) // Danh sách tin nhắn
  const messageStore = useMessageStore()
  const accountStore = useAccountStore()
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

  // Lắng nghe sự kiện contactRequest
  socket.on('contactRequest', (data) => {
    alert(`User ${data.from} wants to add you as a contact!`);
    // Bạn có thể thêm logic để xử lý yêu cầu thêm liên hệ ở đây
    // socket.emit('contactRequestResponse', {
    //   from: data.from,
    //   response: 'accept'
    // })
  })

  const sendMessage = (message, from, to) => {
    socket.emit('privateMessage', {
      message,
      from,
      to
    })
    console.log('Send message: ', message, to)
  }

  const listenForMessages = () => {
    socket.on('privateMessageToReceiver', ({ message, from }) => {
      const currentContactId = accountStore.selectedAccount.contactUserId; // Lấy contactUserId hiện tại
      if (currentContactId === from) { // Kiểm tra xem tin nhắn có đến từ người đang trò chuyện không
        messages.value.push({ content: message, from }); // Thêm tin nhắn vào danh sách
        messageStore.addMessage({ content: message, from }); // Cập nhật vào MessageStore
        console.log('Received message: ', message, from);
      }
    });
  };

  // Gọi phương thức này khi khởi tạo store
  listenForMessages()

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