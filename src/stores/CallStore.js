// src/stores/callStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCallStore = defineStore('call', () => {
  const incomingCall = ref(null)

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

  return { incomingCall, setIncomingCall, clearIncomingCall, getIncomingCall }
})
