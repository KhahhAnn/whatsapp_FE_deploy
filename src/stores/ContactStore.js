import { ref } from 'vue'
import { defineStore } from 'pinia'
import ContactService from '../services/ContactService.js'
import socket from '../plugins/webSocket.js'


export const useContactStore = defineStore('contact', () => {
  const contacts = ref([])
  const selectedContact = ref(null)
  const pendingContacts = ref([])

  function selectContact(contact) {
    selectedContact.value = contact
  }

  const getContactByUser = async (userId) => {
    try {
      const contactData = await ContactService.handleGetContactByUser(userId)
      contacts.value = contactData
    } catch (error) {
      console.error(error)
      contacts.value = [] // Reset to empty if fetch fails
    }
  }

  const getPendingContacts = async (contactUserId) => {
    try {
      pendingContacts.value = await ContactService.handleGetPendingContacts(contactUserId)
      return pendingContacts.value.length
    } catch (error) {
      console.error(error)
      pendingContacts.value = [] // Reset nếu fetch fails
    }
  }

  const addContact = async (
    userId,
    contactUserId,
    nickname,
    senderNickname,
    avatar,
    senderAvatar,
    status
  ) => {
    try {
      const response = await ContactService.handleCreateContact(
        userId,
        contactUserId,
        nickname,
        senderNickname,
        avatar,
        senderAvatar,
        status
      )
      if (response && response.data) {
        contacts.value.push(response.data.account)
        return response.data
      } else {
        console.error('No contact data received')
      }
    } catch (error) {
      console.error(error)
      throw error // Ném lại lỗi để Component có thể xử lý
    }
  }

  const deleteContact = async (contactId) => {
    try {
      await ContactService.handleDeleteContact(contactId)
      contacts.value = contacts.value.filter((contact) => contact.contactId !== contactId)
    } catch (error) {
      console.error('Error deleting contact:', error)
    }
  }

  const acceptContactRequest = async (userId, contactUserId, senderNickname, senderAvatar) => {
    try {
      await ContactService.handleAcceptContactRequest(
        userId,
        contactUserId,
        senderNickname,
        senderAvatar,
        'accepted'
      )
      // Cập nhật danh sách pendingContacts sau khi chấp nhận
      pendingContacts.value = pendingContacts.value.filter(
        (contact) => contact.contactUserId !== contactUserId
      )
    } catch (error) {
      console.error('Error accepting contact request:', error)
    }
  }

  const declineContactRequest = async (userId, contactUserId) => {
    try {
      await ContactService.handleRejectContactRequest(userId, contactUserId)
      // Cập nhật danh sách pendingContacts sau khi từ chối
      pendingContacts.value = pendingContacts.value.filter(
        (contact) => contact.contactUserId !== contactUserId
      )
    } catch (error) {
      console.error('Error rejecting contact request:', error)
    }
  }

  const updateContactStatus = (userId, isOnline) => {
    const contact = contacts.value.find((contact) => contact.contactUserId === userId)
    if (contact) {
      contact.isOnline = isOnline // Cập nhật trạng thái
    }
  }

  // Lắng nghe sự kiện từ server
  socket.on('userStatusUpdate', ({ userId, isOnline }) => {
    updateContactStatus(userId, isOnline)
  })

  return {
    contacts,
    selectedContact,
    pendingContacts,
    getContactByUser,
    selectContact,
    addContact,
    deleteContact,
    getPendingContacts,
    acceptContactRequest,
    declineContactRequest,
    updateContactStatus
  }
})
