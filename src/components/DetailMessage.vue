<script setup>
import axios from 'axios';
import { ref, computed, onMounted, watch } from 'vue'
// Components
import CustomIcon from './custom/CustomIcon.vue'
import RightModal from './modal/RightModal.vue'

// Stores
import { useContactStore } from '../stores/ContactStore'
import { useUserStore } from '../stores/UserStore'
import { useSocketStore } from '../stores/SocketStore'
import { useMessageStore } from '../stores/MessageStore'
import MessageService from '../services/MessageService'
import { useCallStore } from '../stores/CallStore'
// SDK
import { StringeeClient } from 'stringee-chat-js-sdk';
import { useDark } from '@vueuse/core'
import Avatar from 'primevue/avatar'
import Image from 'primevue/image';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

// Stores
const contactStore = useContactStore()
const userStore = useUserStore()
const socketStore = useSocketStore()
const messageStore = useMessageStore()
const callStore = useCallStore()
// Refs handle component
const isModalOpen = ref(false)
const isLoading = ref(false);
const showPopup = ref(false);
const incomingCall = ref(null);
const callerName = ref('');
const callId = ref('');
const callFrom = ref('');
const callTo = ref('');

const clientConnected = ref(false);
const selectedMessageId = ref(null);
// Refs sdk
const isDark = useDark()
const client = new StringeeClient();
const token = ref('');
const toast = useToast();

// Refs value
const imageUrl = ref(null)
const videoUrl = ref(null)
const message = ref('')
const menu = ref();

const formatSentAt = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString(); // Định dạng thời gian theo định dạng địa phương
};

const items = computed(() => {
  return [
    {
      label: 'Options',
      items: [
        {
          label: 'Xoá tin nhắn',
          icon: 'pi pi-trash',
          command: async () => {
            try {
              await messageStore.handleDeleteMessage(selectedMessageId.value);
              toast.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Xóa tin nhắn thành công',
                life: 3000
              });
            } catch (error) {
              console.error('Error deleting message:', error);
              toast.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Xóa tin nhắn thất bại',
                life: 3000
              });
            }
          }
        },
        // Định dạng thời gian tin nhắn động
        {
          label: selectedMessageId.value ? `${formatSentAt(messageStore.messages.find(msg => msg.messageId === selectedMessageId.value).sentAt)}` : 'Thời gian: Không xác định',
          icon: 'pi pi-clock',
        }
      ]
    }
  ];
});


//Render
const fetchMessages = async (senderId, receiverId) => {
  isLoading.value = true; // Bắt đầu loading
  await messageStore.fetchMessagesBetweenUsers(senderId, receiverId);
  isLoading.value = false; // Kết thúc loading
}

onMounted(async () => {
  const senderId = contactStore.selectedContact.userId
  const receiverId = contactStore.selectedContact.contactUserId
  if (receiverId) {
    fetchMessages(senderId, receiverId);
  }
  await fetchTokenAndConnect();
})

watch(
  () => contactStore.selectedContact.contactUserId,
  (newContactId) => {
    if (newContactId) {
      const senderId = contactStore.selectedContact.userId
      fetchMessages(senderId, newContactId);
    }
  },
)
//Handle
const toggleMenu = (event, messageId) => {
  menu.value.toggle(event);
  selectedMessageId.value = messageId; // Store the current messageId to use for actions
  console.log("Message ID:", messageId);
};

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

const removeImage = () => {
  imageUrl.value = null; // Đặt lại imageUrl về null để xóa hình ảnh
  console.log("image deleted");
}

const handleFileChange = (event) => {
  const files = event.target.files; // Lấy tất cả các tệp được chọn
  if (files.length > 0) {
    for (const file of files) {
      // Kiểm tra kích thước tệp (10mb)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB');
        continue; // Bỏ qua tệp này nếu quá lớn
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (file.type.startsWith('video/')) {
          videoUrl.value = reader.result; // Lưu trữ dữ liệu Base64 của video
        } else if (file.type.startsWith('image/')) {
          imageUrl.value = reader.result; // Lưu trữ dữ liệu Base64 của file ảnh
        }
      };
      reader.onerror = (error) => {
        console.error('Error: ', error);
      };
    }
  } else {
    imageUrl.value = null;
    videoUrl.value = null; // Reset nếu không có tệp
  }
}

const sendMessage = async () => {
  try {
    if (message.value.trim() === '' && !imageUrl.value && !videoUrl.value) {
      return;
    }
    const content = videoUrl.value ?? imageUrl.value ?? message.value;

    // Gửi tin nhắn qua socket
    await socketStore.sendMessage(
      content,
      contactStore.selectedContact.userId,
      contactStore.selectedContact.contactUserId
    );

    // Cập nhật tin nhắn vào MessageService
    await MessageService.handleCreateMessage(
      contactStore.selectedContact.userId,
      contactStore.selectedContact.contactUserId,
      content
    );

    // Thêm tin nhắn vào messageStore
    messageStore.addMessage({
      content: content,
      senderId: contactStore.selectedContact.userId,
      messageId: Date.now(),
      sentAt: new Date()
    });

    // Reset các giá trị
    message.value = '';
    imageUrl.value = null;
    videoUrl.value = null;
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// Handle call
function openCallPopUp() {
  const url = `http://localhost:5173/call?from=${contactStore.selectedContact.userId}&to=${contactStore.selectedContact.contactUserId}`;
  const features = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
  window.open(url, '_blank', features);
}

function openReceivePopUp(callId, fromNumber, toNumber) {
  const url = `http://localhost:5173/receive?callId=${callId}&fromNumber=${fromNumber}&toNumber=${toNumber}`;
  const features = 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=800,height=600';
  window.open(url, '_blank', features);
}

async function fetchTokenAndConnect() {
  try {
    const response = await axios.post('http://localhost:8080/api/token', { from: contactStore.selectedContact.userId });
    token.value = response.data.access_token;
    client.connect(token.value);

    client.on('connect', () => {
      console.log('Connected to Stringee!');
      clientConnected.value = true;
    });

    client.on('authen', (res) => {
      if (res.r !== 0) {
        console.error('Authentication failed!', res.message);
      }
    });

    client.on('authensuccess', (res) => {
      if (res.r === 0) {
        console.log('Authentication successful:', res.message);
      } else {
        console.error('Authentication success failed:', res.message);
      }
    });

    client.on('incomingcall', (call) => {
      incomingCall.value = call;
      console.log("incomingCall:", incomingCall);

      // Đặt callerName là nickname của người gọi
      callerName.value = call.fromNumber;
      showPopup.value = true;
      console.log('call id:', call);

      callId.value = call.callId;
      callFrom.value = call.fromNumber;
      callTo.value = call.toNumber;

      callStore.setIncomingCall(incomingCall);

      console.log('Incoming call received:', call);
    });


  } catch (error) {
    console.error('Error fetching token:', error);
  }
}

const acceptCall = () => {
  incomingCall.value.answer((res) => {
    console.log("res: ", callId.value);
    openReceivePopUp(callId.value, callFrom.value, callTo.value)
    showPopup.value = false;
    console.log("answer call callback: " + JSON.stringify(res));
  });
};

const rejectCall = () => {
  if (incomingCall.value) {
    incomingCall.value.reject();
    showPopup.value = false;
    console.log('Cuộc gọi đã bị từ chối');
  }
};
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
        <Avatar :image="contactStore.selectedContact.avatar" class="mr-2" size="large" shape="circle" />
        <div class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ contactStore.selectedContact.nickname }}</h1>
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
        <div v-for="msg in messageStore.messages" :key="msg.messageId" class="flex mb-4 items-center" :class="msg.senderId === contactStore.selectedContact.userId
          ? 'justify-end'
          : 'flex-row-reverse justify-end'
          ">
          <Button type="button" icon="pi pi-ellipsis-v" @click="toggleMenu($event, msg.messageId)" aria-haspopup="true"
            aria-controls="overlay_menu" size="small" variant="outlined" rounded
            :style="{ border: 'none', backgroundColor: 'transparent', color: isDark ? 'white' : 'black' }" />
          <div class="flex flex-col max-w-full overflow-hidden rounded-2xl" :class="msg.senderId === contactStore.selectedContact.userId
            ? 'bg-lightModeHover dark:bg-darkModeHover'
            : 'bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode'
            ">
            <p v-if="msg.content.startsWith('data:image/') && msg.content.includes(';base64,')"
              class="text-darkMode dark:text-lightMode min-w-0 w-full">
              <Image :src="msg.content" alt="Image" image-class="lg:max-w-[512px] sm:max-w-[352px] rounded-lg" />
            </p>
            <video v-else-if="msg.content.startsWith('data:video/')" controls
              class="lg:max-w-[512px] sm:max-w-[352px] rounded-lg">
              <source :src="msg.content" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <p v-else class="text-darkMode dark:text-lightMode break-words min-w-0 w-full px-3 py-1">
              {{ msg.content }}
            </p>
          </div>
          <!-- Hien thi tin nhan -->
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2 mr-2">
            <Avatar v-if="msg.senderId === contactStore.selectedContact.userId" :image="userStore.selectedUser.profilePicture" size="small"
              shape="circle" />
            <Avatar v-else :image="contactStore.selectedContact.avatar" size="small" shape="circle" />
          </div>
        </div>
        <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
      </div>
    </div>

    <div class="flex flex-col justify-center border-t border-darkModeHover dark:border-lightModeHover">
      <!-- Image preview -->
      <div v-if="imageUrl || videoUrl" class="flex items-center justify-start p-4 gap-2">
        <Image v-if="imageUrl" :src="imageUrl" alt="Image" image-class="max-w-[128px] rounded-lg" />
        <video v-if="videoUrl" controls class="max-w-[128px] rounded-lg">
          <source :src="videoUrl" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <Button @click="removeImage" icon="pi pi-trash" size="small" severity="danger" aria-label="Delete"
          class=" py-2 px-4 rounded-full mt-2" />
      </div>
      <!-- Input message -->
      <div class="flex justify-center items-end gap-2 px-4 py-2">
        <CustomIcon icon="face-smile" size="lg" />
        <div>
          <CustomIcon icon="image" size="lg" @click="$refs.fileInput.click()" />
          <input type="file" ref="fileInput" @change="handleFileChange" hidden accept="image/*,video/*" multiple />
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
  </div>
  <RightModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />

  <Teleport to="#app">
    <div v-if="showPopup" class="popup fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg text-center">
        <p class="text-lg font-semibold text-black">Bạn có một cuộc gọi đến từ {{ callerName }}</p>
        <div class="flex justify-center mt-4 space-x-4">
          <button @click="acceptCall" class="bg-green-500 text-white py-2 px-4 rounded-full">
            Chấp nhận
          </button>
          <button @click="rejectCall" class="bg-red-500 text-white py-2 px-4 rounded-full">
            Từ chối
          </button>
        </div>
      </div>
    </div>
  </Teleport>
  <Toast />
</template>