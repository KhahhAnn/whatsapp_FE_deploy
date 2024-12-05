// src/stores/callStore.js
import CallService from '@/services/CallService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCallStore = defineStore('call', () => {
  const incomingCall = ref(null)
  const calls = ref([])

  function setIncomingCall(call) {
    //Lưu thông tin cuộc gọi vào store
    incomingCall.value = call
    //Kiểm tra incomingCall có tồn tại không
    if (incomingCall.value) {
      console.log('incomingCall Store:', incomingCall.value)
    }
    return incomingCall.value
  }

  const handleGetCallbyUser = async (userId) => {
    try {
      const CallData = await CallService.handleGetCallbyUser(userId)
      calls.value = CallData // Cập nhật danh sách người dùng
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
    }
  }

  //Lấy thông tin cuộc gọi từ store
  function getIncomingCall() {
    return incomingCall.value
  }

  function clearIncomingCall() {
    incomingCall.value = null
  }

  return { incomingCall, setIncomingCall, clearIncomingCall, getIncomingCall, handleGetCallbyUser }
})
