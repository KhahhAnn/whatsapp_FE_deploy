<script setup>
import { ref, computed, onMounted } from 'vue'
import CustomIcon from './custom/CustomIcon.vue'
import RightModal from './modal/RightModal.vue'
import Avatar from 'primevue/avatar'
import { useAccountStore } from '../stores/AccountStore'
import { useDark } from '@vueuse/core'
// import { useSocketStore } from '../stores/SocketStore'
import socketConnect from '@/plugins/webSocket'

const accountStore = useAccountStore()
const isDark = useDark()
// const socketStore = useSocketStore()
const isModalOpen = ref(false)
const isLoading = computed(() => !accountStore.selectedAccount)

const imageUrl = ref(null);
const message = ref("");

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
  } else {
    imageUrl.value = null;
  }
};

const accountInitial = computed(() => {
  return accountStore.selectedAccount?.nickname?.charAt(0).toUpperCase() || '';
});

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

// onMounted(() => {
//   socketConnect.on('privateMessageToReceiver', ({ message, from }) => {
//     console.log('Received private message: ', message, from)
//   })
// })

const sendMessage = () => {
  socketConnect.emit('privateMessage', {
    message: message.value,
    from: accountStore.selectedAccount.userId,
    to: accountStore.selectedAccount.contactUserId
  })
  console.log('Send message: ', message.value, accountStore.selectedAccount.contactUserId)
  message.value = ''
}

// const sendMessage = () => {
//   const msg = { content: message.value, reviceId: accountStore.selectedAccount.contactUserId, reviceName: accountStore.selectedAccount.nickname };
//   sendChat.value.push(msg);
//   socketStore.sendMessageStore(msg);
//   socketStore.receiveMessageStore(msg);
//   message.value = ''; // Xóa nội dung tin nhắn sau khi gửi
// }

</script>

<template>
  <div :class="[
    'flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl bg-lightMode dark:text-lightMode dark:bg-darkMode',
    isModalOpen ? 'w-1/2' : 'w-3/4'
  ]">
    <div class="flex justify-between items-center p-4 border-b border-darkModeHover dark:border-lightModeHover">
      <!-- Skeleton loader for user info -->
      <div v-if="isLoading" class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="space-y-2">
          <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- User information -->
      <div v-else class="flex items-center gap-4 select-none">
        <Avatar :label="accountInitial" class="mr-2" size="large" shape="circle" :style="{
          backgroundColor: isDark ? '#4B5563' : '#c0bab1',
        }" />
        <div class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ accountStore.selectedAccount.nickname }}</h1>
          <!-- Trong contact không có trường isActive nên không thể xác định user hoạt động hay không -->
          <!-- <p>{{ accountStore.selectedAccount.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p> -->
        </div>
      </div>

      <div class="flex gap-4">
        <CustomIcon icon="phone" size="lg" />
        <CustomIcon icon="video" size="lg" />
        <button @click="toggleModal">
          <CustomIcon v-if="isModalOpen" icon="angle-right" size="lg" />
          <CustomIcon v-else icon="angle-left" size="lg" />
        </button>
      </div>
    </div>

    <div :class="[
      'flex flex-col-reverse overflow-auto p-4',
      isLoading ? '' : 'bg-custom-pattern' // Chỉ áp dụng lớp nền khi không đang tải
    ]">
      <!-- Skeleton loader for messages -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="flex mb-4" :class="i % 2 === 0 ? 'justify-end' : ''">
          <div class="w-3/4 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </template>

      <div v-else>
        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="User Avatar"
              class="w-8 h-8 rounded-full" />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">YOU</p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>ME</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato" alt="My Avatar"
              class="w-8 h-8 rounded-full" />
          </div>
        </div>

      </div>
    </div>
    <div class="flex justify-center items-end gap-2 px-4 py-2 border-t border-darkModeHover dark:border-lightModeHover">
      <CustomIcon icon="face-smile" size="lg" />
      <div>
        <CustomIcon icon="image" size="lg" @click="$refs.fileInput.click()" />
        <input type="file" ref="fileInput" @change="handleFileChange" hidden multiple />
      </div>
      <CustomIcon icon="note-sticky" size="lg" />
      <input type="text" v-model="message" @keyup.enter="sendMessage"
        class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
        placeholder="Aa" />
      <button @click="sendMessage">
        <CustomIcon icon="paper-plane" size="lg" />
      </button>
    </div>
  </div>
  <RightModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
