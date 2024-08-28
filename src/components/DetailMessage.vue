<script setup>
import { ref } from 'vue'
import MyModal from './SettingModal.vue'
import { useUserStore } from '../stores/userStore'

const isModalOpen = ref(false)
const userStore = useUserStore()

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <div
    :class="[
      'flex flex-col h-[calc(100vh-32px)] justify-between bg-[#FAF3E9] rounded-3xl shadow-2xl',
      isModalOpen ? 'w-1/2' : 'w-3/4'
    ]"
  >
    <div class="flex justify-between items-center p-4 border-b-2 border-black">
      <div class="flex items-center gap-4">
        <img
          :src="userStore.selectedUser ? userStore.selectedUser.avatar : ''"
          class="w-14 h-14 rounded-full object-cover"
          v-if="userStore.selectedUser"
        />
        <div v-if="userStore.selectedUser" class="user-data">
          <h1>{{ userStore.selectedUser.name }}</h1>
          <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
        </div>
      </div>
      <div class="flex gap-4">
        <font-awesome-icon
          class="hover:bg-[#c0bab1] p-2 rounded-full"
          :icon="['fas', 'phone']"
          size="lg"
        />
        <font-awesome-icon
          class="hover:bg-[#c0bab1] p-2 rounded-full"
          :icon="['fas', 'video']"
          size="lg"
        />
        <button @click="toggleModal">
          <font-awesome-icon
            class="hover:bg-[#c0bab1] p-2 rounded-full"
            :icon="['fas', 'ellipsis']"
          />
        </button>
      </div>
    </div>
    <div class="grow overflow-auto">
      <div v-if="userStore.selectedUser">
        <!-- test -->
        <p>{{ userStore.selectedUser.message }}</p>
      </div>
    </div>
    <div class="flex justify-center items-center gap-2 px-4 py-2 border-t-2 border-black">
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'circle-plus']"
        size="lg"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'image']"
        size="lg"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'note-sticky']"
        size="lg"
      />
      <input
        type="text"
        class="w-full py-2 px-4 rounded-full bg-gray-300 focus:bg-white focus:outline-none"
        placeholder="Send message"
      />
      <font-awesome-icon
        class="hover:bg-[#c0bab1] p-2 rounded-full"
        :icon="['fas', 'paper-plane']"
        size="lg"
      />
    </div>
  </div>
  <MyModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
