import { defineStore } from 'pinia'
import { ref } from 'vue'
import AccountService from '../services/AccountService.js'
import UserService from '../services/UserService.js'
import ContactService from '../services/ContactService.js'

export const useUserStore = defineStore('user', () => {
  const selectedUser = ref(null)
  const users = ref([])

  function selectUser(user) {
    selectedUser.value = user
  }

  // Thêm hàm để gọi handleLoginUser và lưu access token
  const loginUser = async (email, password, rememberMe) => {
    try {
      const response = await AccountService.handleLoginUser(email, password, rememberMe)
      if (response && response.data) {
        // Lưu thông tin người dùng vào store hoặc xử lý theo nhu cầu
        users.value.push(response.data.user)
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

  const registerUser = async (username, email, password, phoneNumber) => {
    try {
      const response = await AccountService.handleRegisterUser(
        username,
        email,
        password,
        phoneNumber
      )
      if (response && response.data) {
        // Lưu thông tin người dùng vào store hoặc xử lý theo nhu cầu
        users.value.push(response.data.user)
        // Lưu access token vào localStorage
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
    selectedUser.value = null
    users.value = []

    // Chuyển hướng về trang đăng nhập
    window.location.assign('/login')
  }

  const getUserDetail = async (userId) => {
    try {
      const user = await UserService.getUserDetail(userId)
      selectedUser.value = user // Lưu thông tin người dùng vào store
      console.log('Thông tin người dùng đã lấy:', selectedUser.value) // Log thông tin người dùng
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
    }
  }

  const getContactByUser = async (userId) => {
    try {
      const contacts = await ContactService.handleGetContactByUser(userId)
      users.value = contacts // Assuming `users` is where you store the contacts
    } catch (error) {
      console.error('Failed to fetch contacts:', error)
    }
  }

  return {
    selectedUser,
    users,
    selectUser,
    loginUser,
    registerUser,
    logoutUser,
    getUserDetail,
    getContactByUser
  }
})
