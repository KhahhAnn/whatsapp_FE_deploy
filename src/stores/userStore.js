// src/stores/userStore.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    selectedUser: null
  }),
  actions: {
    selectUser(user) {
      this.selectedUser = user
    }
  }
})
