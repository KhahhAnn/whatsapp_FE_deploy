// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const selectedUser = ref(null)

  function selectUser(user) {
    selectedUser.value = user
  }

  return {
    selectedUser,
    selectUser
  }
})
