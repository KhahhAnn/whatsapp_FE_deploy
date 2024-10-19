<script setup>
import { defineProps, defineEmits } from 'vue'

import { ref } from "vue";
const loggedIn = ref(false);
const username = ref("");
const accessToken = ref("");
const callStatus = ref("");
const friendUsername = ref("");
const loading = ref(false);

const localVideo = ref(null);
const remoteVideo = ref(null);
const isVideoCall = ref(false);

const stringeeClient = new StringeeClient();
let call = null; // call handler
const hasIncomingCall = ref(false);
const isCalling = ref(false);

const friendName = ref("");

function settingCallEvent(call1) {
  call1.on("addremotestream", function (stream) {
    // reset srcObject to work around minor bugs in Chrome and Edge.
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

stringeeClient.on("connect", () => console.log("Connected to StringeeServer"));

stringeeClient.on("authen", (res) => {
  if (res.message === "SUCCESS") {
    loggedIn.value = true;
  }
});

stringeeClient.on("incomingcall", (incomingcall) => {
  console.log("incomingcall", incomingcall);
  call = incomingcall;
  settingCallEvent(incomingcall);
  hasIncomingCall.value = true;
  isVideoCall.value = incomingcall.isVideoCall;

  friendName.value = incomingcall.fromNumber;
  loading.value = true;
});
const onLogin = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_JWT_ENDPOINT}?u=${username.value}`
  );

  const data = await res.json();

  accessToken.value = data.access_token;
  localStorage.setItem('accessToken', accessToken.value); // Lưu vào localStorage
  stringeeClient.connect(accessToken.value);
  loggedIn.value = true; // Cập nhật trạng thái đăng nhập
};

const onCall = async (videoCall = false) => {
  if (isCalling.value || !friendUsername.value) {
    return;
  }

  if (username.value === friendUsername.value) {
    alert("Không thể gọi cho chính mình");
    return;
  }

  loading.value = true;
  isVideoCall.value = videoCall;

  call = new StringeeCall2(
    stringeeClient,
    username.value,
    friendUsername.value,
    videoCall
  );
  settingCallEvent(call);

  call.makeCall(function (res) {
    console.log("make call callback: " + JSON.stringify(res));

    friendName.value = res.toNumber;
  });
};

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


defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}
</script>
<template>
  <div v-if="isOpen" class="relative z-10 text-darkMode dark:text-lightMode" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-lightMode dark:bg-darkMode">
          <div class="relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-center font-bold leading-10 text-darkMode dark:text-lightMode" id="modal-title">
                  Biệt danh
                </h3>
                <div class="mt-2">
                  <div class="row">
                    <div class="col">
                      <h1>Demo: Voice Call & Video Call</h1>

                      <p>
                        Trạng thái:
                        {{ loggedIn ? `đã đăng nhập (${username})` : "chưa đăng nhập" }}
                      </p>

                      <form @submit.prevent="onLogin" v-if="!loggedIn">
                        <div class="mb-3">
                          <label for="username" class="form-label">Tên đăng nhập</label>
                          <input type="text" v-model="username" class="form-control" id="username"
                            placeholder="Nhập tên đăng nhập" autofocus required />
                        </div>
                        <button type="submit" class="btn btn-primary">Đăng nhập</button>
                      </form>

                      <form action="#" @submit.prevent="onCall(false)" v-else>
                        <div class="mb-3">
                          <label for="friend-username" class="form-label">Bạn muốn gọi cho ai?</label>
                          <input type="text" v-model="friendUsername" class="form-control" id="friend-username"
                            placeholder="Nhập ID bạn bè" :disabled="isCalling || loading" required />
                        </div>

                        <button type="submit" class="btn btn-primary" :disabled="loading || isCalling">
                          <i class="bi bi-telephone"></i>
                          {{ loading ? "Đang gọi..." : "Gọi thoại" }}
                        </button>

                        <button type="button" class="btn btn-secondary ms-3" :disabled="loading || isCalling"
                          @click="onCall(true)">
                          <i class="bi bi-camera-video"></i>
                          {{ loading ? "Đang gọi..." : "Gọi video" }}
                        </button>
                      </form>

                      <!-- <p class="mt-3" v-if="isCalling && callStatus">
        Trạng thái cuộc gọi: {{ callStatus }}
      </p> -->

                      <div v-if="hasIncomingCall" class="mt-3">
                        <p>
                          Bạn nhận được cuộc gọi từ: <strong>{{ call.fromNumber }}</strong>
                        </p>

                        <button class="btn btn-primary me-3" @click="acceptCall">
                          Trả lời
                        </button>
                        <button class="btn btn-danger" @click="rejectCall">Từ chối</button>
                      </div>

                      <div v-if="isCalling" class="mt-3">
                        <p>
                          Đang gọi cho: <strong>{{ friendName }}</strong>
                        </p>

                        <button class="btn btn-danger" @click="hangupCall">Kết thúc</button>
                      </div>

                      <div class="mt-3" v-show="isCalling && isVideoCall">
                        <video ref="localVideo" autoplay muted style="width: 300px"></video>
                        <video ref="remoteVideo" autoplay style="width: 300px" class="ms-3"></video>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="absolute top-4 right-4">
            <button @click="closeModal" type="button">
              <font-awesome-icon icon="xmark"
                class="p-2 rounded-xl border border-gray-600 text-darkMode hover:bg-lightModeHover dark:hover:bg-darkModeHover dark:text-lightMode" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
