import { defineStore } from 'pinia'
import { ref } from 'vue'
import UserService from '../services/UserService.js'

export const useUserStore = defineStore('users', () => {
  const selectedUser = ref(null)
  const users = ref([])

  function selectUser(user) {
    selectedUser.value = user
  }

  const getUserDetail = async (userId) => {
    try {
      const user = await UserService.getUserDetail(userId)
      selectedUser.value = user // Lưu thông tin người dùng vào store
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
    }
  }

  const getAllUsers = async () => {
    try {
      const usersData = await UserService.getAllUsers() // Gọi hàm từ UserService
      users.value = usersData // Cập nhật danh sách người dùng
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  return {
    selectedUser,
    users,
    selectUser,
    getAllUsers,
    getUserDetail
  }
})
