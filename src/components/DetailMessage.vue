<script setup>
import { ref } from 'vue'
import UserModal from './UserModal.vue'
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
      'flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl dark:text-lightMode bg-lightMode dark:bg-darkMode',
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
        <div v-if="userStore.selectedUser" class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ userStore.selectedUser.name }}</h1>
          <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
        </div>
      </div>
      <div class="flex gap-4">
        <font-awesome-icon
          class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
          :icon="['fas', 'phone']"
          size="lg"
        />
        <font-awesome-icon
          class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
          :icon="['fas', 'video']"
          size="lg"
        />
        <button @click="toggleModal">
          <font-awesome-icon
            class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
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
        class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
        :icon="['fas', 'circle-plus']"
        size="lg"
      />
      <font-awesome-icon
        class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
        :icon="['fas', 'image']"
        size="lg"
      />
      <font-awesome-icon
        class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
        :icon="['fas', 'note-sticky']"
        size="lg"
      />
      <input
        type="text"
        class="w-full py-2 px-4 rounded-full focus:bg-white focus:outline-none bg-gray-300"
        placeholder="Send message"
      />
      <font-awesome-icon
        class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
        :icon="['fas', 'paper-plane']"
        size="lg"
      />
    </div>
  </div>
  <UserModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
