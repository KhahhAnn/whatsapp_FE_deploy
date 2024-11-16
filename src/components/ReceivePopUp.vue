<template>
  <div class="call-container">
    <video ref="localVideo" autoplay muted></video>
    <video ref="remoteVideo" autoplay></video>
  </div>
</template>

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
const callId = urlParams.get('callId'); // ID của cuộc gọi đến

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
