import { defineStore } from 'pinia'
import { ref } from 'vue'
import AccountService from '../services/AccountService.js'
import ContactService from '../services/ContactService.js'

export const useAccountStore = defineStore('account', () => {
  const selectedAccount = ref(null)
  const accounts = ref([])

  function selectAccount(account) {
    selectedAccount.value = account
  }

  const loginAccount = async (email, password, rememberMe) => {
    try {
      const response = await AccountService.handleLoginUser(email, password, rememberMe)
      if (response && response.data) {
        // Lưu thông tin người dùng vào store hoặc xử lý theo nhu cầu
        accounts.value.push(response.data.account)
        // Lưu access token vào localStorage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('userId', response.data.user.userId)
        return response.data // Trả về dữ liệu người dùng
      } else {
        console.error('No user data received')
      }
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  const registerAccount = async (username, email, password, phoneNumber) => {
    try {
      const response = await AccountService.handleRegisterUser(
        username,
        email,
        password,
        phoneNumber
      )
      if (response && response.data) {
        // Lưu thông tin người dùng vào store hoặc xử lý theo nhu cầu
        accounts.value.push(response.data.account)
        localStorage.setItem('accessToken', response.data.accessToken)
        return response.data // Trả về dữ liệu người dùng
      } else {
        console.error('No user data received')
      }
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  // Hàm đăng xuất
  const logoutUser = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userId')

    // Cập nhật trạng thái người dùng
    selectedAccount.value = null
    accounts.value = []

    window.location.assign('/login')
  }

  const getContactByUser = async (userId) => {
    try {
      const contacts = await ContactService.handleGetContactByUser(userId)
      accounts.value = contacts
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    }
  }

  const addContact = async (userId, contactUserId, nickname, status) => {
    try {
      console.log("Adding contact with data:", { userId, contactUserId, nickname, status }); // Log dữ liệu
      const response = await ContactService.handleCreateContact(userId, contactUserId, nickname, status);
      console.log("Response from server:", response); // Log phản hồi từ server
      if (response && response.data) {
        accounts.value.push(response.data.account); // Cập nhật danh sách contacts
        console.log("Updated contacts:", accounts.value); // Log danh sách contacts sau khi cập nhật
        return response.data; // Trả về dữ liệu contact vừa thêm
      } else {
        console.error('No contact data received');
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  }

  return {
    selectedAccount,
    accounts,
    selectAccount,
    loginAccount,
    registerAccount,
    logoutUser,
    getContactByUser,
    addContact
  }
})
