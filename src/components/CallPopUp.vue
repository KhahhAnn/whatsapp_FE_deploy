<script setup>
import axios from 'axios';
import { StringeeCall, StringeeClient } from 'stringee-chat-js-sdk';
import { computed, onMounted, ref, nextTick, watchEffect } from 'vue';
import { useAccountStore } from '@/stores/AccountStore';
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';
import { useDark } from '@vueuse/core';

const accountStore = useAccountStore();
console.log(accountStore.selectedAccount);

const client = new StringeeClient();
const token = ref('');
const clientConnected = ref(false);
const localVideo = ref(null);
const remoteVideo = ref(null);
const isVideoCall = ref(false);
const callStatus = ref('');
const isCalling = ref(false);
const loading = ref(false);
const hasIncomingCall = ref(false);
let call = null;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const from = urlParams.get('from');
const to = urlParams.get('to');

const isWebcamOn = ref(true);
const isDark = useDark();

onMounted(async () => {
    await fetchTokenAndConnect();
    await nextTick();
    await startLocalVideo();
});

watchEffect(() => {
    if (isWebcamOn.value && localVideo.value) {
        startLocalVideo().catch(console.error);
    }
});

async function startLocalVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideo.value) {
            localVideo.value.srcObject = stream;
        } else {
            console.error('localVideo is not available');
        }
    } catch (error) {
        console.error('Error accessing webcam:', error);
    }
}

async function toggleWebcam() {
    isWebcamOn.value = !isWebcamOn.value;
    if (!isWebcamOn.value) {
        stopAndResetLocalVideo();
    } else {
        await nextTick();
        await startLocalVideo();
    }
}

function stopAndResetLocalVideo() {
    if (localVideo.value && localVideo.value.srcObject) {
        const tracks = localVideo.value.srcObject.getTracks();
        tracks.forEach(track => track.stop());
        localVideo.value.srcObject = null;
    }
}

async function fetchTokenAndConnect() {
    try {
        const response = await axios.post('http://localhost:8080/api/token', { from });
        token.value = response.data.access_token;

        client.on('connect', () => {
            console.log('Connected to Stringee!');
            clientConnected.value = true;
            toCall();
        });

        client.on('authen', (res) => {
            if (res.r !== 0) {
                console.error('Authentication failed!', res.message);
            }
        });

        client.on("incomingcall", (incomingcall) => {
            console.log('Connected to Stringee!');
            call = incomingcall;
            settingCallEvent(incomingcall);
            hasIncomingCall.value = true;
            isVideoCall.value = incomingcall.isVideoCall;
            loading.value = true;
        });

        client.on('disconnect', () => {
            console.log('Disconnected from Stringee!');
            clientConnected.value = false;
        });

        client.connect(token.value);

    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

function settingCallEvent(callInstance) {
    callInstance.on("addremotestream", (stream) => {
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = stream;
        }
    });

    callInstance.on("addlocalstream", (stream) => {
        localVideo.value.srcObject = stream;
    });

    callInstance.on("signalingstate", (state) => {
        callStatus.value = state.reason;
        if (state.code === 3) {
            isCalling.value = true;
            loading.value = false;
        } else if ([4, 5, 6].includes(state.code)) {
            isCalling.value = false;
            loading.value = false;
            hasIncomingCall.value = false;
        }
    });
}

const toCall = () => {
    call = new StringeeCall(client, from, to, false);
    settingCallEvent(call);
    call.makeCall((res) => {
        console.log("make call callback: " + JSON.stringify(res));
    });
};

const acceptCall = () => {
    call.answer((res) => {
        console.log("answer call callback: " + JSON.stringify(res));
        hasIncomingCall.value = false;
        isCalling.value = true;
        loading.value = false;
    });
};

const rejectCall = () => {
    call.reject((res) => {
        console.log("reject call callback: " + JSON.stringify(res));
        hasIncomingCall.value = false;
        loading.value = false;
    });
};

const upgradeToVideoCall = () => {
    call.upgradeToVideoCall();
    isVideoCall.value = true;
};

const accountInitial = computed(() => {
    return accountStore.selectedAccount?.nickname?.charAt(0).toUpperCase() || '';
});
</script>

<template>
    <div class="flex flex-col items-center justify-center bg-gray-800 h-full w-full p-4">
        <div class="flex flex-col items-center mb-4">
            <Avatar :label="accountInitial" class="mr-2" size="large" shape="circle"
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
            <button v-if="hasIncomingCall" @click="acceptCall" class="bg-green-500 text-white p-2 rounded-full">
                <i class="fas fa-phone-alt"></i> Chấp nhận
            </button>
            <button v-if="hasIncomingCall" @click="rejectCall" class="bg-red-500 text-white p-2 rounded-full">
                <i class="fas fa-times"></i> Từ chối
            </button>
            <button v-if="!isVideoCall && isCalling" @click="upgradeToVideoCall" class="bg-blue-500 text-white p-2 rounded-full">
                <i class="fas fa-video"></i> Nâng cấp lên video
            </button>
            <button @click="toggleWebcam" class="bg-yellow-500 text-white p-2 rounded-full">
                <i class="fas" :class="isWebcamOn ? 'fa-video-slash' : 'fa-video'"></i>
                {{ isWebcamOn ? 'Tắt Webcam' : 'Bật Webcam' }}
            </button>
        </div>
    </div>
</template>
