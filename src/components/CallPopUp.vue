<script setup>
import axios from 'axios';
import { StringeeCall, StringeeClient } from 'stringee-chat-js-sdk';
import { computed, onMounted, ref, nextTick, watchEffect } from 'vue';
import { useAccountStore } from '@/stores/AccountStore';
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';
import { useDark } from '@vueuse/core'


const accountStore = useAccountStore();
const client = new StringeeClient();
const token = ref('');
const clientConnected = ref(false);
const localVideo = ref(null);
const remoteVideo = ref(null);
const isVideoCall = ref(false);
const callStatus = ref("");
const isCalling = ref(false);
const loading = ref(false);
const hasIncomingCall = ref(false);
let call = null;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const from = urlParams.get('from');
const to = urlParams.get('to');

const isWebcamOn = ref(true); // Biến trạng thái cho webcam
const isDark = useDark()


onMounted(async () => {
    await fetchTokenAndConnect();
    await nextTick(); // Đảm bảo DOM đã được cập nhật
    console.log('localVideo:', localVideo.value); // Kiểm tra giá trị của localVideo
    await startLocalVideo(); // Khởi động webcam
});

watchEffect(() => {
    if (isWebcamOn.value && localVideo.value) {
        startLocalVideo().catch(console.error);
    }
});

async function startLocalVideo() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (localVideo.value) { // Kiểm tra xem localVideo.value có phải là null không
            localVideo.value.srcObject = stream; // Gán stream cho localVideo
            console.log('localVideo after:', localVideo.value); // Kiểm tra giá trị của localVideo
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
        // Tắt webcam
        stopAndResetLocalVideo();
    } else {
        // Bật webcam
        console.log('Turning on webcam...');
        await nextTick();
        await startLocalVideo();
    }
}

function stopAndResetLocalVideo() {
    if (localVideo.value && localVideo.value.srcObject) {
        const tracks = localVideo.value.srcObject.getTracks();
        tracks.forEach(track => {
            track.stop();
            console.log('Stopping track: ', track.kind); // For debugging: check which tracks are stopped
        });
        localVideo.value.srcObject = null;
        console.log('Webcam tracks stopped and srcObject is reset.');
    }
}


async function fetchTokenAndConnect() {
    try {
        const response = await axios.post('http://localhost:8080/api/token', { from });
        token.value = response.data.access_token;

        client.on('connect', () => {
            console.log('Connected to Stringee!');
            clientConnected.value = true;
        });

        client.on('authen', (res) => {
            if (res.r !== 0) {
                console.error('Authentication failed!', res.message);
            }
        });

        client.on('disconnect', () => {
            console.log('Disconnected from Stringee!');
            clientConnected.value = false;
        });

        client.connect(token.value);
        makeCall();

    } catch (error) {
        console.error('Error fetching token:', error);
    }
}

function settingCallEvent(call1) {
    call1.on("addremotestream", function (stream) {
        console.log("addremotestream");
        if (remoteVideo.value) {
            remoteVideo.value.srcObject = null;
            remoteVideo.value.srcObject = stream;
        }
    });

    call1.on("addlocalstream", function (stream) {
        // reset srcObject to work around minor bugs in Chrome and Edge.
        console.log("addlocalstream");
        localVideo.value.srcObject = null;
        localVideo.value.srcObject = stream;
    });

    call1.on("signalingstate", function (state) {
        console.log("signalingstate ", state);

        callStatus.value = state.reason;

        if (state.code === 3) {
            // call accepted
            isCalling.value = true;
            loading.value = false;
        } else if (state.code === 4 || state.code === 5 || state.code === 6) {
            // call ended
            isCalling.value = false;
            loading.value = false;
            hasIncomingCall.value = false;
        }
    });

    call1.on("mediastate", function (state) {
        console.log("mediastate ", state);
    });

    call1.on("info", function (info) {
        console.log("on info:" + JSON.stringify(info));
    });
}

client.on("incomingcall", (incomingcall) => {
    console.log("incomingcall", incomingcall);
    call = incomingcall;
    settingCallEvent(incomingcall);
    hasIncomingCall.value = true;
    isVideoCall.value = incomingcall.isVideoCall;
    loading.value = true;
});

const makeCall = () => {
    call = new StringeeCall(client, from, to, false);
    settingCallEvent(call);
    call.makeCall(function (res) {
        console.log("make call callback: " + JSON.stringify(res));
    });
}


const acceptCall = () => {
    call.answer(function (res) {
        console.log("answer call callback: " + JSON.stringify(res));
        hasIncomingCall.value = false;
        isCalling.value = true;
        loading.value = false;
    });
};

const rejectCall = () => {
    call.reject(function (res) {
        console.log("reject call callback: " + JSON.stringify(res));
        hasIncomingCall.value = false;
        loading.value = false;
    });
};

const hangupCall = () => {
    call.hangup(function (res) {
        console.log("hangup call callback: " + JSON.stringify(res));
        isCalling.value = false;
        loading.value = false;
    });
};

const upgradeToVideoCall = () => {
    call.upgradeToVideoCall();
    isVideoCall.value = true;
};

const accountInitial = computed(() => {
    return accountStore.selectedAccount?.nickname?.charAt(0).toUpperCase() || ''
})
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
            <button @click="acceptCall" class="bg-green-500 text-white p-2 rounded-full">
                <i class="fas fa-phone-alt"></i> <!-- Nhấn để chấp nhận cuộc gọi -->
                Chấp nhận
            </button>
            <button @click="rejectCall" class="bg-red-500 text-white p-2 rounded-full">
                <i class="fas fa-times"></i> <!-- Nhấn để từ chối cuộc gọi -->
                Từ chối
            </button>
            <button @click="upgradeToVideoCall" v-if="!isVideoCall" class="bg-blue-500 text-white p-2 rounded-full">
                <i class="fas fa-video"></i> <!-- Nhấn để nâng cấp cuộc gọi lên video -->
                Nâng cấp lên video
            </button>
            <button @click="toggleWebcam" class="bg-yellow-500 text-white p-2 rounded-full">
                <i class="fas" :class="isWebcamOn ? 'fa-video-slash' : 'fa-video'"></i>
                {{ isWebcamOn ? 'Tắt Webcam' : 'Bật Webcam' }} <!-- Nhấn để bật/tắt webcam -->
            </button>
        </div>
    </div>
</template>