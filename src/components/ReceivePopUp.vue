<script setup>
import { ref, onMounted } from 'vue';
import { StringeeClient, StringeeCall } from 'stringee-chat-js-sdk';
import axios from 'axios';
import { useCallStore } from '../stores/CallStore'; // Import the CallStore

const client = new StringeeClient();
const call = ref(null);
const localVideo = ref(null);
const remoteVideo = ref(null);
const urlParams = new URLSearchParams(window.location.search);
const callFrom = urlParams.get('fromNumber');
const callTo = urlParams.get('toNumber');
const callId = urlParams.get('callId'); // ID của cuộc gọi đến\
const isCalling = ref(false);
const loading = ref(false);
const hasIncomingCall = ref(false);

const callStore = useCallStore(); // Initialize the CallStore

onMounted(async () => {
  await connectClient();
  const incomingCall = callStore.setIncomingCall(call);
  console.log('Incoming Call store:', incomingCall); // Log the incoming call value
});

async function connectClient() {
  try {
    const response = await axios.post('http://localhost:8080/api/token', { from: callTo });
    const token = response.data.access_token;
    console.log('token', token)
    client.connect(token);

    
    client.on('connect', () => {
      console.log('Connected to Stringee!');
      if (callId) {
        joinIncomingCall();
       
      }
    });

    client.on('authen', (res) => {
      if (res.r !== 0) {
        console.error('Authentication failed!', res.message);
      }
    });
  } catch (error) {
    console.error('Error connecting client:', error);
  }
}


// const joinIncomingCall = () => {
//   callStore.incomingCall.value.on('addremotestream', (stream) => {
//     if (remoteVideo.value) {
//       remoteVideo.value.srcObject = stream;
//     }
//   });

//   callStore.incomingCall.value.on('addlocalstream', (stream) => {
//     if (localVideo.value) {
//       localVideo.value.srcObject = stream;
//     }
//   });

//   callStore.incomingCall.value.on('signalingstate', (state) => {
//     console.log("Signaling state:", state);
//   });

//   callStore.incomingCall.value.answer((res) => {
//     console.log("res: ", callStore.incomingCall.value);
//     console.log("answer call callback: " + JSON.stringify(res));
//     hasIncomingCall.value = false;
//     isCalling.value = true;
//     loading.value = false;
//   });

// };

function joinIncomingCall() {
  // Khởi tạo đối tượng StringeeCall để trả lời cuộc gọi đến
  call.value = new StringeeCall(client,  callFrom,callTo, false);
  call.value.callId = callId
  call.value.isIncomingCall = true
  console.log('join incoming call', callId, callFrom, callTo)

  call.value.on('addremotestream', (stream) => {
    if (remoteVideo.value) {
      remoteVideo.value.srcObject = stream;
    }
  });

  call.value.on('addlocalstream', (stream) => {
    if (localVideo.value) {
      localVideo.value.srcObject = stream;
    }
  });

  call.value.on('signalingstate', (state) => {
    console.log("Signaling state:", state);
  });

// Trả lời cuộc gọi đến
call.value.answer((r)=>{
  console.log('answer response:', r)
});
}
</script>


<template>
  <div class="flex flex-col items-center justify-center bg-gray-800 h-full w-full p-4">
        <div class="flex flex-col items-center mb-4">
            <Avatar :label="accountInitial" class="mr-2" size="xlarge" shape="circle"
                :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
            <p class="text-white text-lg">{{ isVideoCall ? 'Video Call' : 'Voice Call' }}</p>
            <p class="text-gray-400">{{ to }}</p>
        </div>

        <ProgressSpinner aria-label="Loading" v-if="loading" />

        <div class="relative w-1/2 h-auto rounded-lg">
            <video v-if="isWebcamOn" ref="localVideo" class="w-full h-auto rounded-lg" autoplay muted></video>
            <img v-else src="../assets/cameraoff.png" class="w-full h-auto rounded-lg" alt="Webcam is off" />
        </div>

        <div class="flex space-x-4 mt-4">
            <button v-if="!isVideoCall && isCalling" @click="upgradeToVideoCall"
                class="bg-blue-500 text-white p-2 rounded-full">
                <i class="fas fa-video"></i> Nâng cấp lên video
            </button>
            <button @click="toggleWebcam" class="bg-yellow-500 text-white p-2 rounded-full">
                <i class="fas" :class="isWebcamOn ? 'fa-video-slash' : 'fa-video'"></i>
                {{ isWebcamOn ? 'Tắt Webcam' : 'Bật Webcam' }}
            </button>
            <Button label="Kết thúc" severity="danger" @click="hangupCall" />
        </div>
    </div>
</template>

<style scoped>
.call-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
video {
  width: 100%;
  max-width: 600px;
  border-radius: 10px;
  margin-bottom: 20px;
}
</style>
