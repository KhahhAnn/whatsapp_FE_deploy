// src/stores/userStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUserStore = defineStore('user', () => {
  const selectedUser = ref(null)
  const users = ref([])

  function selectUser(user) {
    selectedUser.value = user
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/users')
      users.value = response.data
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  return {
    selectedUser,
    users,
    selectUser,
    fetchUsers
  }
})
