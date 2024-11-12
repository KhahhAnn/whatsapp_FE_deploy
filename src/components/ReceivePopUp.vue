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
const callId = urlParams.get('callId'); // ID của cuộc gọi đến

const callStore = useCallStore(); // Initialize the CallStore

onMounted(async () => {
  await connectClient();
  const incomingCall = callStore.setIncomingCall(call);
  console.log('Incoming Call store:', incomingCall); // Log the incoming call value
});

async function connectClient() {
  try {
    const response = await axios.post('http://localhost:8080/api/token', { from: callFrom });
    const token = response.data.access_token;
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
  call.value = new StringeeCall(client, callId);

  // Trả lời cuộc gọi đến
  call.value.answer();

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
