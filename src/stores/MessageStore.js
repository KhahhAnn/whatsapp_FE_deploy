import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMessageStore = defineStore('message', () => {
  const messages = ref([]);

  function addMessage(message) {
    messages.value.push(message);
  }

  return {
    messages,
    addMessage,
  };
});