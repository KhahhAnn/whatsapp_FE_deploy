import { defineStore } from 'pinia';
import { ref } from 'vue';
import MessageService from '../services/MessageService';

export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);
  const messageDetails = ref(null);

//   const getMessagesByUser = async (userId) => {
//     try {
//       const messages = await MessageService.handleGetMessageByUser(userId)
//       messages.value = messages
//       console.log('thành công')
//     } catch (error) {
//       console.error('Error fetching messages:', error);
//     }
//   };

const getMessageDetails = async (messageId) => {
    try {
      const message = await MessageService.getMessageDetails(messageId)
      messageDetails.value = message
      console.log('Dữ liệu chi tiết tin nhắn:', messageDetails.value); // Thêm log ở đây
    } catch (error) {
      console.error('Error fetching message details:', error);
    }
  };

  return {
    messages,
    messageDetails,
    // getMessagesByUser,
    getMessageDetails,
  };
});