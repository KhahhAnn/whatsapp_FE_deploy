<script setup>
import { defineProps, defineEmits, onMounted } from 'vue'
import { useCallStore } from '../../stores/CallStore'
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '../../stores/UserStore'
import { useSocketStore } from '../../stores/SocketStore'
import { useContactStore } from '../../stores/ContactStore'

const callStore = useCallStore()
const userStore = useUserStore()
const contactStore = useContactStore()
const socketStore = useSocketStore()

onMounted(async () => {
  const userId = localStorage.getItem('userId')
  if (userId) {
    await callStore.handleGetCallbyUser(userId)
  }
})

defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}

const formatDate = (dateStr) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }
  return new Date(dateStr).toLocaleDateString('en-US', options)
}

// function calculateDuration(startTime, endTime) {
//   const start = new Date(startTime);
//   const end = new Date(endTime);
//   const durationMs = end - start;
//   const seconds = Math.floor((durationMs / 1000) % 60);
//   const minutes = Math.floor((durationMs / 1000 / 60) % 60);
//   const hours = Math.floor((durationMs / 1000 / 60 / 60) % 24);

//   return `${hours}h ${minutes}m ${seconds}s`;
// }

const startCall = async (call) => {
  const callId = uuidv4()
  callStore.selectCall(call)
  const usernameAvatar = userStore.selectedUser.profilePicture
  const recipientNicknameAvatar = contactStore.selectedContact.avatar

  //const callerId = contactStore.selectedContact.userId
  const username = userStore.selectedUser.username
  const receiverId = callStore.selectedCall.receiverId
  const recipientNickname = callStore.selectedCall.receiverName
  const callType = 'gọi video'

  let toUserId
  let toUserName
  if (callStore.selectedCall.receiverId === userStore.selectedUser.userId) {
    toUserId = callStore.selectedCall.callerId
    toUserName = callStore.selectedCall.callerName
  } else {
    toUserId = callStore.selectedCall.receiverId
    toUserName = callStore.selectedCall.receiverName
  }

  try {
    await callStore.handleCreateCall(toUserId, username, receiverId, toUserName, callType)

    console.log('Success')
  } catch (error) {
    console.error('Error:', error)
    throw error
  }

  

  socketStore.sendCall({
    from: userStore.selectedUser.userId,
    to: toUserId,
    //or  callStore.selectedCall.callerId
    callId
  })

  const url = `/call?user_id=${userStore.selectedUser.userId}&call_id=${callId}`
  const features =
    'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600'

  // Gửi username và nickname qua postMessage
  const newWindow = window.open(url, '_blank', features)
  newWindow.onload = () => {
    setTimeout(() => {
      newWindow.postMessage(
        { username, recipientNickname, usernameAvatar, recipientNicknameAvatar },
        '*'
      )
    }, 100) // Trì hoãn 100ms
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900"
      aria-hidden="true"
    ></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <!-- Modal container -->
        <div
          class="p-6 relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode"
        >
          <h2 class="my-5 text-lg font-medium" id="modal-title">Lịch sử cuộc gọi</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full">
              <thead class="bg-gray-500">
                <tr class="border-b">
                  <th class="p-4 text-left">Người gọi</th>
                  <th class="p-4 text-left">Người nhận</th>
                  <th class="p-4 text-left">Loại cuộc gọi</th>
                  <th class="p-4 text-left">Thời gian</th>
                  <th class="p-4 text-left">Thời gian</th>
                </tr>
              </thead>
            </table>
            <div class="overflow-y-auto max-h-96">
              <table class="min-w-full border border-gray-200">
                <tbody>
                  <tr v-for="call in callStore.calls" :key="call.id" class="border-b">
                    <td class="p-4 text-left">{{ call.callerName }}</td>
                    <td class="p-4 text-left">{{ call.receiverName }}</td>
                    <td class="p-4 text-left text-green-500">{{ call.callType }}</td>
                    <td class="p-4 text-left">{{ formatDate(call.startTime) }}</td>
                    <td class="p-4 flex justify-start items-start">
                      <button
                        @click="startCall(call)"
                        class="px-4 py-2 rounded hover:bg-lightModeHover dark:hover:bg-darkModeHover"
                      >
                        Gọi lại
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <button
            @click="closeModal"
            type="button"
            class="mt-4 border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
