// src/stores/callStore.js
import CallService from '../services/CallService.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCallStore = defineStore('call', () => {
  const incomingCall = ref(null)
  const calls = ref([])
  const callDetail = ref(null)
  const selectedCall = ref(null)

  function selectCall(call) {
    selectedCall.value = call
  }

  function setIncomingCall(call) {
    //Lưu thông tin cuộc gọi vào store
    incomingCall.value = call
    //Kiểm tra incomingCall có tồn tại không
    if (incomingCall.value) {
      console.log('incomingCall Store:', incomingCall.value)
    }
    return incomingCall.value
  }

  //Lấy thông tin cuộc gọi từ store
  function getIncomingCall() {
    return incomingCall.value
  }

  function clearIncomingCall() {
    incomingCall.value = null
  }

  const handleGetCallbyUser = async (userId) => {
    try {
      const response = await CallService.GetCallbyUser(userId)
      calls.value = response // Cập nhật danh sách người dùng
    } catch (error) {
      console.error('Failed to fetch user detail:', error)
      throw new Error('Failed to fetch user detail')
    }
  }

  const handleGetCallDetail = async (callId) => {
    try {
      const response = await CallService.getCallDetail(callId)
      callDetail.value = response
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  const handleCreateCall = async (callerId, callerName, receiverId, receiverName, callType) => {
    try {
      const response = await CallService.createCall(
        callerId,
        callerName,
        receiverId,
        receiverName,
        callType
      )
      if (response && response.data) {
        calls.value.push(response.data.call)
        return response.data
      } else {
        console.error('No call data received')
      }
    } catch (error) {
      console.error('Error during registration:', error)
      throw new Error('Error during registration')
    }
  }

  const handleEndCall = async (callId) => {
    try {
      const response = await CallService.endCall(callId)
      return response.data
    } catch (error) {
      console.error('Error during registration:', error)
      throw new Error('Error during registration')
    }
  }

  

  return {
    incomingCall,
    calls,
    callDetail,
    selectedCall,
    selectCall,
    setIncomingCall,
    clearIncomingCall,
    getIncomingCall,
    handleGetCallbyUser,
    handleCreateCall,
    handleEndCall,
    handleGetCallDetail
  }
})
