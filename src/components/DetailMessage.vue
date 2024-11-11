<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import CustomIcon from './custom/CustomIcon.vue'
import RightModal from './modal/RightModal.vue'
import { useDark } from '@vueuse/core'
import { useAccountStore } from '../stores/AccountStore'
import { useUserStore } from '../stores/UserStore'
import { useSocketStore } from '../stores/SocketStore'
import { useMessageStore } from '../stores/MessageStore'
import MessageService from '../services/MessageService'

import Avatar from 'primevue/avatar'
import Image from 'primevue/image';
import Button from 'primevue/button';
import Menu from 'primevue/menu';

const accountStore = useAccountStore()
const userStore = useUserStore()
const isDark = useDark()
const socketStore = useSocketStore()
const messageStore = useMessageStore()
const isModalOpen = ref(false)
const isLoading = ref(false); // Thêm biến loading

const imageUrl = ref(null)
const message = ref('')

const selectedMessageId = ref(null);

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Delete Message',
        icon: 'pi pi-trash',
        command: async () => {
          try {
            await messageStore.handleDeleteMessage(selectedMessageId.value);
            console.log("Message deleted successfully", selectedMessageId.value);
          } catch (error) {
            console.error('Error deleting message:', error);
          }
        }
      },
      {
        label: 'Export',
        icon: 'pi pi-upload'
      }
    ]
  }
]);

const toggleMenu = (event, messageId) => {
  menu.value.toggle(event);
  selectedMessageId.value = messageId; // Store the current messageId to use for actions
  console.log("Message ID:", messageId);
};


const accountInitial = computed(() => {
  return accountStore.selectedAccount?.nickname?.charAt(0).toUpperCase() || ''
})

const userInitial = computed(() => {
  return userStore.selectedUser?.username?.charAt(0).toUpperCase() || ''
})

const fetchMessages = async (senderId, receiverId) => {
  isLoading.value = true; // Bắt đầu loading
  await messageStore.fetchMessagesBetweenUsers(senderId, receiverId);
  isLoading.value = false; // Kết thúc loading
}

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    //Kiểm tra kích thước tệp (10mb)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      imageUrl.value = reader.result; // Lưu trữ dữ liệu Base64 của file ảnh
    };
    reader.onerror = (error) => {
      console.error('Error: ', error);
    };
  } else {
    imageUrl.value = null;
  }
}

// Call API to get messages when DetailMessage component is mounted
onMounted(() => {
  const senderId = accountStore.selectedAccount.userId
  const receiverId = accountStore.selectedAccount.contactUserId
  if (receiverId) {
    fetchMessages(senderId, receiverId);
  }
})

// Theo dõi sự thay đổi của contactUserId khi click vào contact khác trong list contact
watch(
  () => accountStore.selectedAccount.contactUserId,
  (newContactId) => {
    if (newContactId) {
      const senderId = accountStore.selectedAccount.userId
      fetchMessages(senderId, newContactId);
    }
  }
)

const sendMessage = async () => {
  try {
    if (message.value.trim() === '' && !imageUrl.value) {
      return
    }
    const content = imageUrl.value ? imageUrl.value : message.value; // Sử dụng imageUrl nếu có
    await socketStore.sendMessage(
      content,
      accountStore.selectedAccount.userId,
      accountStore.selectedAccount.contactUserId
    )
    await MessageService.handleCreateMessage(
      accountStore.selectedAccount.userId,
      accountStore.selectedAccount.contactUserId,
      content // Gửi nội dung hình ảnh hoặc tin nhắn
    )
    messageStore.addMessage({
      content: content,
      senderId: accountStore.selectedAccount.userId,
      messageId: Date.now()
    })
    message.value = ''
    imageUrl.value = null // Reset imageUrl sau khi gửi
  } catch (error) {
    console.error('Error sending message:', error)
  }
}

function openCallPopUp() {
  const url = `http://localhost:5173/call?from=${accountStore.selectedAccount.userId}&to=${accountStore.selectedAccount.contactUserId}`;
  const features = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
  window.open(url, '_blank', features);
}
</script>

<template>
  <div :class="[
    'flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl bg-lightMode dark:text-lightMode dark:bg-darkMode ',
    isModalOpen ? 'w-1/2' : 'w-3/4'
  ]">
    <div class="flex justify-between items-center p-4 border-b border-darkModeHover dark:border-lightModeHover">
      <div v-if="isLoading" class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="space-y-2">
          <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <div v-else class="flex items-center gap-4 select-none">
        <Avatar :label="accountInitial" class="mr-2" size="large" shape="circle"
          :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
        <div class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ accountStore.selectedAccount.nickname }}</h1>
        </div>
      </div>

      <div class="flex gap-4">
        <button @click="openCallPopUp">
          <CustomIcon icon="phone" size="lg" />
        </button>
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
        <div v-for="msg in messageStore.messages" :key="msg.messageId" class="flex mb-4 items-center" :class="msg.senderId === accountStore.selectedAccount.userId
          ? 'justify-end'
          : 'flex-row-reverse justify-end'
          ">
          <Button type="button" icon="pi pi-ellipsis-v" @click="toggleMenu($event, msg.messageId)" aria-haspopup="true"
            aria-controls="overlay_menu" size="small" variant="outlined" rounded />
          <div class="flex flex-col max-w-full overflow-hidden rounded-2xl" :class="msg.senderId === accountStore.selectedAccount.userId
            ? 'bg-lightModeHover dark:bg-darkModeHover'
            : 'bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode'
            ">
            <p v-if="msg.content.startsWith('data:image/') && msg.content.includes(';base64,')"
              class="text-darkMode dark:text-lightMode min-w-0 w-full">
              <Image :src="msg.content" alt="Image" preview class=" lg:max-w-[512px] rounded-lg" />
            </p>
            <p v-else class="text-darkMode dark:text-lightMode break-words min-w-0 w-full px-3 py-1">
              {{ msg.content }}
            </p>
          </div>
          <!-- Hien thi tin nhan -->
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2 mr-2">
            <Avatar v-if="msg.senderId === accountStore.selectedAccount.userId" :label="userInitial" size="small"
              shape="circle" :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
            <Avatar v-else :label="accountInitial" size="small" shape="circle"
              :style="{ backgroundColor: isDark ? '#4B5563' : '#c0bab1' }" />
          </div>
        </div>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
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