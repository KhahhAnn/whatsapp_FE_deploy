<script setup>
import { StreamVideoClient } from '@stream-io/video-client'
import { nextTick, onMounted, ref, watch, computed } from 'vue'
import CallService from '../services/CallService'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'

const isCalling = window.location.pathname === '/call'
const isReceiving = window.location.pathname === '/receive'
const searchQuery = new URLSearchParams(window.location.search)
const userId = searchQuery.get('user_id')
const callId = searchQuery.get('call_id')
const user = { id: userId }

let call

const createCall = async () => {
  const { data } = await CallService.handleCreateCallToken(userId, callId)
  const { apiKey, callToken } = data
  const client = new StreamVideoClient({ apiKey, token: callToken, user })
  return client.call('default', callId)
}

const callerUser = ref()
const receiverUser = ref()

const isCameraEnabled = ref(true)
const isMicrophoneEnabled = ref(true)

const subscribeCallParticipants = () => {
  // Whenever the participants change, we update the UI
  call.state.participants$.subscribe((participants) => {
    // render / update existing participants
    participants.forEach((participant) => {
      if (isCalling) {
        if (participant.userId === user.id) {
          callerUser.value = participant
        } else {
          receiverUser.value = participant
        }
      } else if (isReceiving) {
        if (participant.userId === user.id) {
          receiverUser.value = participant
        } else {
          callerUser.value = participant
        }
      }
    })
  })
}

const isVideoCall = searchQuery.get('isVideoCall') === 'true'

const joinCall = async () => {
  await call.join(isCalling ? { create: true } : undefined)
  if (isVideoCall) {
    await call.camera.enable()
  } else {
    await call.camera.disable()
  }
  await call.microphone.enable()
}

const containerElement = ref()

const setupCallContainer = () => {
  const parentContainer = containerElement.value
  // This will enable visibility tracking in the client
  call.setViewport(parentContainer)
}

onMounted(async () => {
  call = await createCall()
  subscribeCallParticipants()
  await joinCall()
  setupCallContainer()
})

// User who has big video on the screen
const primaryUser = computed(() => {
  return isCalling ? receiverUser.value : callerUser.value
})

// User who has small video on the screen
const secondaryUser = computed(() => {
  return isCalling ? callerUser.value : receiverUser.value
})

const primaryVideo = ref()
const secondaryVideo = ref()
const primaryAudio = ref()
const secondaryAudio = ref()
const hasRenderedPrimaryVideo = ref(false)
const hasRenderedSecondaryVideo = ref(false)

watch(primaryUser, (user) => {
  nextTick(() => {
    if (!hasRenderedPrimaryVideo.value) {
      call.bindVideoElement(primaryVideo.value, user.sessionId, 'videoTrack')
      call.bindAudioElement(primaryAudio.value, user.sessionId, 'audioTrack')
      hasRenderedPrimaryVideo.value = true
    }
  })
})

watch(secondaryUser, (user) => {
  nextTick(() => {
    if (!hasRenderedSecondaryVideo.value) {
      call.bindVideoElement(secondaryVideo.value, user.sessionId, 'videoTrack')
      call.bindAudioElement(secondaryAudio.value, user.sessionId, 'audioTrack')
      hasRenderedSecondaryVideo.value = true
    }
  })
})

const toggleMicrophone = async () => {
  if (isMicrophoneEnabled.value) {
    await call.microphone.disable() // Tắt camera
    isMicrophoneEnabled.value = false // Cập nhật trạng thái
  } else {
    await call.microphone.enable() // Bật camera
    isMicrophoneEnabled.value = true // Cập nhật trạng thái
  }
}

const toggleCamera = async () => {
  if (isCameraEnabled.value) {
    await call.camera.disable() // Tắt camera
    isCameraEnabled.value = false // Cập nhật trạng thái
  } else {
    await call.camera.enable() // Bật camera
    isCameraEnabled.value = true // Cập nhật trạng thái
  }
}

const toggleEndCall = async () => {
  await call.leave() // Ngắt kết nối cuộc gọi
  // Cập nhật trạng thái người dùng nếu cần
  callerUser.value = null
  receiverUser.value = null
  //Closed call windows
  window.close()
}

const username = ref('') 
const usernameAvatar = ref('') 
const recipientNickname = ref('') 
const recipientNicknameAvatar = ref('') 

// Thêm listener để nhận dữ liệu từ postMessage
window.addEventListener('message', (event) => {
  console.log('Origin:', event.origin) // In ra origin để kiểm tra
  if (event.origin === window.location.origin) {
    // Kiểm tra origin
    if (event.data.username) {
      username.value = event.data.username // Lưu username vào biến
    }
    if (event.data.recipientNickname) {
      recipientNickname.value = event.data.recipientNickname // Lưu nickname của người nhận vào biến
    }
    if (event.data.usernameAvatar) {
      usernameAvatar.value = event.data.usernameAvatar // Lưu avatar của người gọi
    }
    if (event.data.recipientNicknameAvatar) {
      recipientNicknameAvatar.value = event.data.recipientNicknameAvatar // Lưu avatar của người nhận
    }
  }
})
</script>

<template>
  <div ref="containerElement" class="relative flex flex-col items-center justify-center bg-gray-800 h-full w-full p-4">
    <div class="w-full h-4/5 flex">
      <!-- Thực hiện cuộc gọi, trái -->
      <div class="w-1/4 h-full p-4 flex justify-center items-center">
        <div class="w-full relative">
          <div v-if="!isCameraEnabled"
            class="  w-full h-full flex flex-col justify-center items-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <Avatar :image="usernameAvatar" class="" size="large" shape="circle" />

          </div>
          <p class="font-bold text-lg text-lightMode dark:text-darkMode">
            {{ username }}
          </p>
          <video v-if="secondaryUser" ref="secondaryVideo" autoplay :id="`video-${secondaryUser.sessionId}`"
            :data-session-id="secondaryUser.sessionId"
            class="w-full aspect-video shadow-2xl rounded-2xl border border-white" />
        </div>
      </div>

      <!-- Nhận cuộc gọi - phải -->
      <div class="w-3/4 h-full p-4 flex justify-center items-center">
        <div class="w-full ">
          <!-- <div
            class=" w-full h-full flex flex-col justify-center items-center absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
            <Avatar :image="recipientNicknameAvatar" class="" size="large" shape="circle" />
            <p class="font-bold text-lg text-lightMode dark:text-darkMode">
              {{ recipientNickname }}
            </p>
          </div> -->
          <video v-if="primaryUser" ref="primaryVideo" autoplay :id="`video-${primaryUser.sessionId}`"
            :data-session-id="primaryUser.sessionId"
            class="w-full aspect-video shadow-2xl rounded-2xl border border-white" />
        </div>
      </div>
    </div>
    <!-- SenderCall-->
    <div class="w-full h-1/4 flex justify-center items-center gap-6">
      <Button @click="toggleMicrophone" class="" :severity="isMicrophoneEnabled ? 'success' : 'danger'"
        icon="pi pi-microphone" size="large" />
      <Button @click="toggleCamera" class="" :severity="isCameraEnabled ? 'success' : 'danger'" icon="pi pi-camera"
        size="large" />
      <Button @click="toggleEndCall" severity="danger" size="large">
        <font-awesome-icon icon="phone-slash" />
      </Button>
    </div>

    <div hidden>
      <audio ref="secondaryAudio" hidden></audio>
      <audio ref="primaryAudio" hidden></audio>
    </div>
  </div>
</template>
