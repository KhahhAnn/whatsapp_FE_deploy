<script setup>
import axios from 'axios';
import { StringeeCall, StringeeClient } from 'stringee-chat-js-sdk';
import { computed, onMounted, ref } from 'vue';
import { useAccountStore } from '@/stores/AccountStore';
import Avatar from 'primevue/avatar';
import ProgressSpinner from 'primevue/progressspinner';

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


onMounted(() => {
    fetchTokenAndConnect();
})

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
    <div class="flex flex-col items-center justify-center bg-slate-500 h-full w-full">
        
<ProgressSpinner aria-label="Loading" />

        <Avatar :label="accountInitial" class="mr-2" size="large" shape="circle"
            :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
        <div>
            <p>Adasd</p>
        </div>
        <div>
            <button @click="acceptCall">Accept Call</button>
            <button @click="rejectCall">Reject Call</button>
            <button @click="upgradeToVideoCall">Upgrade to Video Call</button>
        </div>
    </div>
</template>