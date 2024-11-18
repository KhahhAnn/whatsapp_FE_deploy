import { ref } from 'vue'
import { defineStore } from 'pinia'
import ContactService from '../services/ContactService.js'

export const useContactStore = defineStore('contact', () => {
  const contacts = ref([])
  const selectedContact = ref(null)

  function selectContact(contact) {
    selectedContact.value = contact
  }

  const getContactByUser = async (userId) => {
    try {
      const contactData = await ContactService.handleGetContactByUser(userId)
      contacts.value = contactData
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
      contacts.value = [] // Reset to empty if fetch fails
    }
  }

  const addContact = async (userId, contactUserId, nickname, status) => {
    try {
      const response = await ContactService.handleCreateContact(userId, contactUserId, nickname, status);
      if (response && response.data) {
        contacts.value.push(response.data.account);
        return response.data;
      } else {
        console.error('No contact data received');
      }
    } catch (error) {
      console.error('Error adding contact in ContactStore:', error);
      throw error; // Ném lại lỗi để Component có thể xử lý
    }
  };

  const deleteContact = async (contactId) => {
    try {
      await ContactService.handleDeleteContact(contactId)
      contacts.value = contacts.value.filter(contact => contact.contactId !== contactId)
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  return {
    contacts,
    selectedContact,
    getContactByUser,
    selectContact,
    addContact,
    deleteContact
  }
})
