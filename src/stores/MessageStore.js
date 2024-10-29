import { defineStore } from 'pinia';
import { ref } from 'vue';
import MessageService from '../services/MessageService';

export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);

  const fetchMessagesByUser = async (userId) => {
    try {
      const fetchedMessages = await MessageService.getMessagesByUser(userId);
      messages.value = fetchedMessages; // Cập nhật danh sách tin nhắn
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchMessagesBetweenUsers = async (senderId, receiverId) => {
    try {
      const fetchedMessages = await MessageService.getMessagesBetweenUsers(senderId, receiverId);
      messages.value = fetchedMessages; // Cập nhật danh sách tin nhắn
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };
  

  function addMessage(message) {
    messages.value.push(message);
  }

  return {
    messages,
    addMessage,
    fetchMessagesByUser, // Thêm phương thức này
    fetchMessagesBetweenUsers, // Thêm phương thức này
  };
});