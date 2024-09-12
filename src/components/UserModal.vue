<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../stores/userStore'
import ThemeModal from './ThemeModal.vue'
import NicknameModal from './NicknameModal.vue'
import { useDark, useToggle } from '@vueuse/core'

defineProps({
  isOpen: Boolean
})

const isThemeModalOpen = ref(false)
const isNicknameModalOpen = ref(false)
const userStore = useUserStore()

const isDark = useDark()
const toggle = useToggle(isDark)

function toggleThemeModal() {
  isThemeModalOpen.value = !isThemeModalOpen.value
}
function toggleNicknameModal() {
  isNicknameModalOpen.value = !isNicknameModalOpen.value
  console.log('clicked')
}

const isLoading = computed(() => !userStore.selectedUser)
</script>

<template>
  <div
    v-if="isOpen"
    class="flex flex-col justify-start h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode"
  >
    <div class="flex flex-col justify-center items-center gap-2 py-8">
      <!-- Skeleton loader -->
      <template v-if="isLoading">
        <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </template>

      <!-- User information -->
      <template v-else>
        <img
          class="w-24 h-24 rounded-full object-cover bg-darkModeHover"
          :src="userStore.selectedUser.avatar"
          alt="User avatar"
        />
        <p>{{ userStore.selectedUser.name }}</p>
        <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
      </template>

      <div class="flex gap-6">
        <font-awesome-icon
          icon="bell"
          size="xl"
          class="rounded-full p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        />
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="rounded-full p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        />
        <button
          @click="toggle()"
          :class="{ 'hover:bg-lightModeHover': !isDark, 'hover:bg-darkModeHover': isDark }"
          class="rounded-full p-2"
        >
          <font-awesome-icon v-if="isDark" icon="sun" size="xl" class="rounded-full" />
          <font-awesome-icon v-else icon="moon" size="xl" class="rounded-full" />
        </button>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button
        @click="toggleThemeModal"
        class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
      >
        Đổi chủ đề
      </button>
      <button
        @click="toggleNicknameModal"
        class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
      >
        Chỉnh sửa biệt danh
      </button>

      <button
        class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
      >
        Đăng xuất
      </button>
    </div>
  </div>
  <Teleport to="#app">
    <ThemeModal :isOpen="isThemeModalOpen" @update:isOpen="isThemeModalOpen = $event" />
    <NicknameModal :isOpen="isNicknameModalOpen" @update:isOpen="isNicknameModalOpen = $event" />
  </Teleport>
</template>
