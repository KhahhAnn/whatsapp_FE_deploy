<script setup>
import { ref, computed } from 'vue'
import UserModal from './UserModal.vue'
import { useUserStore } from '../stores/userStore'

const isModalOpen = ref(false)
const userStore = useUserStore()

const isLoading = computed(() => !userStore.selectedUser)

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <div
    :class="[
      'flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl bg-lightMode dark:text-lightMode dark:bg-darkMode',
      isModalOpen ? 'w-1/2' : 'w-3/4'
    ]"
  >
    <div
      class="flex justify-between items-center p-4 border-b border-darkModeHover dark:border-lightModeHover"
    >
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
        <img :src="userStore.selectedUser.avatar" class="w-14 h-14 rounded-full object-cover" />
        <div class="user-data text-darkMode dark:text-lightMode">
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
            v-if="isModalOpen"
            icon="angle-right"
            size="lg"
            class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
          />
          <font-awesome-icon
            v-else
            icon="angle-left"
            size="lg"
            class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
          />
        </button>
      </div>
    </div>
    <div class="grow overflow-auto p-4">
      <!-- Skeleton loader for messages -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="flex mb-4" :class="i % 2 === 0 ? 'justify-end' : ''">
          <div class="w-3/4 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </template>

      <!-- Actual messages -->
      <div v-else>
        <p>{{ userStore.selectedUser.message }}</p>
        <!-- Add your actual message rendering logic here -->
      </div>
    </div>
    <div
      class="flex justify-center items-center gap-2 px-4 py-2 border-t border-darkModeHover dark:border-lightModeHover"
    >
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
        class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
        placeholder="Aa"
      />
      <button>
        <font-awesome-icon
          class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover"
          :icon="['fas', 'paper-plane']"
          size="lg"
        />
      </button>
    </div>
  </div>
  <UserModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
