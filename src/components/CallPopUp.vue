<script setup>
import { StreamVideoClient } from '@stream-io/video-client'
import { nextTick, onMounted, ref, watch, computed } from 'vue'
import CallService from '../services/CallService'
import Button from 'primevue/button';
import CustomIcon from './custom/CustomIcon.vue';

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

const audioElement = ref(null);


const joinCall = async () => {
  await call.join(isCalling ? { create: true } : undefined)
  await call.camera.enable()
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
  call.bindAudioElement(audioElement.value, user.sessionId, 'audioTrack');
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
const hasRenderedPrimaryVideo = ref(false)
const hasRenderedSecondaryVideo = ref(false)

watch(primaryUser, (user) => {
  nextTick(() => {
    if (!hasRenderedPrimaryVideo.value) {
      call.bindVideoElement(primaryVideo.value, user.sessionId, 'videoTrack')
      hasRenderedPrimaryVideo.value = true
    }
  })
})

watch(secondaryUser, (user) => {
  nextTick(() => {
    if (!hasRenderedSecondaryVideo.value) {
      call.bindVideoElement(secondaryVideo.value, user.sessionId, 'videoTrack')
      hasRenderedSecondaryVideo.value = true
    }
  })
})

// const toggleMicrophone = async () => {
//   if (call.microphone.isEnabled) {
//     await call.microphone.disable(); // Tắt microphone
//   } else {
//     await call.microphone.enable(); // Bật microphone
//   }
// }
</script>

<template>
  <div ref="containerElement" class="relative flex items-center justify-center bg-gray-800 h-full w-full p-4">
    <video v-if="secondaryUser" ref="secondaryVideo" :id="`video-${secondaryUser.sessionId}`"
      :data-session-id="secondaryUser.sessionId"
      class="absolute bottom-7 end-7 w-[350px] aspect-video shadow-2xl rounded-2xl" />

    <Button @click="toggleMicrophone" class="fixed top-64 left-12" severity="danger">
      <CustomIcon icon="microphone" size="lg" />
    </Button>

    <video v-if="primaryUser" ref="primaryVideo" :id="`video-${primaryUser.sessionId}`"
      :data-session-id="primaryUser.sessionId" class="w-full aspect-video rounded-lg" />

    <audio ref="audioElement" hidden></audio>

  </div>
</template>
