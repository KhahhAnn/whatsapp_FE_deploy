import { defineStore } from 'pinia'
import { ref } from 'vue'
import AccountService from '../services/AccountService.js'

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
        localStorage.setItem('username', response.data.user.username)
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

  // Cập nhật avatar người dùng
  const updateUserAvatar = async (userId, phoneNumber, profilePicture) => {
    try {
      const response = await AccountService.handleUpdateUser(userId, phoneNumber, profilePicture)
      return response.data
    } catch (error) {
      console.error('Update user avatar failed:', error)
    }
  }

  return {
    selectedAccount,
    accounts,
    selectAccount,
    loginAccount,
    registerAccount,
    logoutUser,
    updateUserAvatar
  }
})
