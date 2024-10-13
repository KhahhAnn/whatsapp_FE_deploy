// ContactStore.js
import { ref } from 'vue'
// ContactStore.js
import { defineStore } from 'pinia'
import ContactService from '../services/ContactService.js'

export const useContactStore = defineStore('contact', () => {
  const contacts = ref([])
  const selectedUser = ref(null)

  const getContactByUser = async (userId) => {
    try {
      const response = await ContactService.handleGetContactByUser(userId)
      contacts.value = response.data || []
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      contacts.value = [] // Reset to empty if fetch fails
    }
  }

  return {
    contacts,
    getContactByUser,
    selectedUser
  }
})
