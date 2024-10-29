<script setup>
import { ref, computed } from 'vue'
import CustomIcon from './custom/CustomIcon.vue'
import RightModal from './modal/RightModal.vue'
import { useDark } from '@vueuse/core'
import Avatar from 'primevue/avatar'
import { useAccountStore } from '../stores/AccountStore'
import { useUserStore } from '../stores/UserStore'
import { useSocketStore } from '../stores/SocketStore'
import MessageService from '../services/MessageService'
const accountStore = useAccountStore()
const userStore = useUserStore()
const isDark = useDark()
const socketStore = useSocketStore()
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

const userInitial = computed(() => {
  return userStore.selectedUser?.username?.charAt(0).toUpperCase() || ''
})


function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

const sendMessage = async () => {
  try {
    await socketStore.sendMessage(message.value, accountStore.selectedAccount.userId, accountStore.selectedAccount.contactUserId);
    await MessageService.handleCreateMessage(accountStore.selectedAccount.userId, accountStore.selectedAccount.contactUserId, message.value);
    socketStore.messages.push({ content: message.value, from: accountStore.selectedAccount.userId });
    message.value = '';
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

</script>

<template>
  <div
    :class="['flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl bg-lightMode dark:text-lightMode dark:bg-darkMode ', isModalOpen ? 'w-1/2' : 'w-3/4']">
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
        <Avatar :label="accountInitial" class="mr-2" size="large" shape="circle"
          :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
        <div class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ accountStore.selectedAccount.nickname }}</h1>
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

    <div :class="['flex flex-col-reverse overflow-auto p-4', isLoading ? '' : 'bg-custom-pattern']">
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="flex mb-4" :class="i % 2 === 0 ? 'justify-end' : ''">
          <div class="w-3/4 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </template>

      <div v-else>
  <!-- Hiển thị tin nhắn -->
  <div v-for="msg in socketStore.messages" :key="msg.content" class="flex mb-4"
    :class="msg.from === accountStore.selectedAccount.userId ? 'justify-end' : 'flex-row-reverse justify-end'">
    <div class="flex flex-col max-w-full overflow-hidden rounded-2xl px-3 py-1"
      :class="msg.from === accountStore.selectedAccount.userId ? 'bg-lightModeHover dark:bg-darkModeHover' : 'bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode'">
      <!-- Thêm break-words và max-w-xs cấu hình lại thành min-w-0 và w-full để kéo dài tối đa hoặc dung lượng tùy theo nội dung -->
      <p class="text-darkMode dark:text-lightMode break-words min-w-0 w-full">{{ msg.content }}</p>
    </div>
    <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2 mr-2">
      <Avatar v-if="msg.from === accountStore.selectedAccount.userId" :label="userInitial" size="small"
        shape="circle" :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
      <Avatar v-else :label="accountInitial" size="small" shape="circle"
        :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
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
