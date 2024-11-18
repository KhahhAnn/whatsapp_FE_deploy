import { defineStore } from 'pinia'
import { ref } from 'vue'
import MessageService from '../services/MessageService'

export const useMessageStore = defineStore('message', () => {
  const messages = ref([])
  const selectedMessage = ref(null)

  function selectMessage(message) {
    selectedMessage.value = message
  }

  // const fetchMessagesByUser = async (userId) => {
  //   try {
  //     const fetchedMessages = await MessageService.getMessagesByUser(userId)
  //     messages.value = fetchedMessages // Cập nhật danh sách tin nhắn
  //   } catch (error) {
  //     console.error('Error fetching messages:', error)
  //   }
  // }

  const fetchMessagesBetweenUsers = async (senderId, receiverId) => {
    try {
      const fetchedMessages = await MessageService.getMessagesBetweenUsers(senderId, receiverId)
      messages.value = fetchedMessages // Cập nhật danh sách tin nhắn
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const fetchMediaMessages = async (senderId, receiverId) => {
    try {
      const messages = await MessageService.getMessagesBetweenUsers(senderId, receiverId)
      return messages.filter(
        (msg) => msg.content.startsWith('data:image/') || msg.content.startsWith('data:video/')
      )
    } catch (error) {
      console.error('Error fetching media messages:', error)
    }
  }

  const handleDeleteMessage = async (messageId) => {
    try {
      await MessageService.handleDeleteMessage(messageId)
      messages.value = messages.value.filter((message) => message.messageId !== messageId)
      selectedMessage.value = null
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  function addMessage(message) {
    messages.value.push(message)
  }

  return {
    messages,
    selectedMessage,
    selectMessage,
    addMessage,
    fetchMessagesBetweenUsers, // Thêm phương thức này
    handleDeleteMessage,
    fetchMediaMessages
  }
})
