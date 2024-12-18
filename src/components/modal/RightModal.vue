<script setup>
import { ref, onMounted, watch } from 'vue'

import { useContactStore } from '../../stores/ContactStore'
import { useMessageStore } from '../../stores/MessageStore'

import CustomButton from '../custom/CustomButton.vue'
import CustomIcon from '../custom/CustomIcon.vue'
import ThemeModal from '../modal/ThemeModal.vue'
import NicknameModal from '../modal/NicknameModal.vue'

import Avatar from 'primevue/avatar'
import Image from 'primevue/image'
import ProgressSpinner from 'primevue/progressspinner';

defineProps({
  isOpen: Boolean
})
const isLoading = ref(true); // Initialize as true to show loading initially
const isThemeModalOpen = ref(false)
const isNicknameModalOpen = ref(false)

const mediaMessages = ref([])
const messageStore = useMessageStore()
const contactStore = useContactStore()
const selectedContactId = ref(contactStore.selectedContact.contactUserId)

const fetchMedia = async () => {
  const senderId = contactStore.selectedContact.userId;
  const receiverId = selectedContactId.value;
  if (receiverId) {
    isLoading.value = true; // Start loading
    mediaMessages.value = await messageStore.fetchMediaMessages(senderId, receiverId);
    isLoading.value = false; // End loading
  }
};

// Call fetchMedia when the component is mounted
onMounted(fetchMedia);

// Watch for changes in the selected contact and fetch media messages accordingly
watch(() => contactStore.selectedContact.contactUserId, (newContactId) => {
  selectedContactId.value = newContactId;
  fetchMedia();
});

function toggleThemeModal() {
  isThemeModalOpen.value = !isThemeModalOpen.value
}
function toggleNicknameModal() {
  isNicknameModalOpen.value = !isNicknameModalOpen.value
}
</script>

<template>
  <div v-if="isOpen"
    class="flex flex-col overflow-auto justify-start h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode">
    <div class="flex flex-col justify-center items-center gap-2 py-8">
      <!-- Skeleton loader for media messages -->
      <template v-if="isLoading">
        <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </template>

      <!-- User information -->
      <template v-else>
        <Avatar :image="contactStore.selectedContact.avatar" class="mr-2" size="xlarge" shape="circle" />
        <p>{{ contactStore.selectedContact.nickname }}</p>
      </template>

      <div class="flex gap-6">
        <CustomIcon icon="bell" />
        <CustomIcon icon="magnifying-glass" />
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-4 px-4">
      <CustomButton @click="toggleThemeModal" text="Đổi chủ đề" />
      <CustomButton @click="toggleNicknameModal" text="Chỉnh sửa biệt danh" />
      <!-- Media Messages Section -->
      <div class="flex flex-col items-center gap-5 w-full rounded-xl font-semibold p-2 ">
        <h2>Hình ảnh & video</h2>
        <div v-if="isLoading">
          <ProgressSpinner />
        </div>
        <div v-else class="flex items-start gap-2 flex-wrap h-60 w-full overflow-scroll">
          <div v-for="msg in mediaMessages" :key="msg.messageId"
            class="bg-slate-300 w-[96px] h-[96px] overflow-hidden shadow-xl">
            <Image v-if="msg.content.startsWith('data:image/')" :src="msg.content" alt="Image" preview
              image-class="object-cover" class="w-full h-full" />
            <video v-else-if="msg.content.startsWith('data:video/')" controls class="w-full h-full object-cover">
              <source :src="msg.content" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Teleport to="#app">
    <ThemeModal :isOpen="isThemeModalOpen" @update:isOpen="isThemeModalOpen = $event" />
    <NicknameModal :isOpen="isNicknameModalOpen" @update:isOpen="isNicknameModalOpen = $event"
      :contactId="contactStore.selectedContact?.contactId" :currentNickname="contactStore.selectedContact?.nickname" />
  </Teleport>
</template>
