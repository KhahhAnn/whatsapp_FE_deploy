<script setup>
import { ref, computed } from 'vue'

import CustomIcon from './custom/CustomIcon.vue'
import ThemeModal from './ThemeModal.vue'
import NicknameModal from './NicknameModal.vue'
import ButtonOption from './custom/CustomButton.vue'
import { useUserStore } from '../stores/AccountStore'
import Avatar from 'primevue/avatar'


defineProps({
  isOpen: Boolean
})

const isThemeModalOpen = ref(false)
const isNicknameModalOpen = ref(false)
const userStore = useUserStore()
const isLoading = computed(() => !userStore.selectedUser)

function toggleThemeModal() {
  isThemeModalOpen.value = !isThemeModalOpen.value
}
function toggleNicknameModal() {
  isNicknameModalOpen.value = !isNicknameModalOpen.value
  console.log('clicked')
}

// Compute the first letter of the username
const userInitial = computed(() => {
  return userStore.selectedUser?.nickname?.charAt(0).toUpperCase() || '';
});

</script>

<template>
  <div v-if="isOpen"
    class="flex flex-col justify-start h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode">
    <div class="flex flex-col justify-center items-center gap-2 py-8">
      <!-- Skeleton loader -->
      <template v-if="isLoading">
        <div class="w-24 h-24 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="w-24 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </template>

      <!-- User information -->
      <template v-else>
        <Avatar :label="userInitial" class="mr-2" size="xlarge" shape="circle" />
        <p>{{ userStore.selectedUser.name }}</p>
        <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
      </template>

      <div class="flex gap-6">
        <CustomIcon icon="bell" />
        <CustomIcon icon="magnifying-glass" />
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-4 px-4">
      <ButtonOption @click="toggleThemeModal" text="Đổi chủ đề" />
      <ButtonOption @click="toggleNicknameModal" text="Chỉnh sửa biệt danh" />
    </div>
  </div>
  <Teleport to="#app">
    <ThemeModal :isOpen="isThemeModalOpen" @update:isOpen="isThemeModalOpen = $event" />
    <NicknameModal :isOpen="isNicknameModalOpen" @update:isOpen="isNicknameModalOpen = $event" />
  </Teleport>
</template>