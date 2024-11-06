<script setup>
import { ref, computed } from 'vue'

import CustomIcon from '../custom/CustomIcon.vue'
import ThemeModal from '../modal/ThemeModal.vue'
import NicknameModal from '../modal/NicknameModal.vue'
import CustomButton from '../custom/CustomButton.vue'
import { useAccountStore } from '../../stores/AccountStore'
import Avatar from 'primevue/avatar'
import { useDark } from '@vueuse/core'

defineProps({
  isOpen: Boolean
})

const isThemeModalOpen = ref(false)
const isNicknameModalOpen = ref(false)
const accountStore = useAccountStore()
const isLoading = computed(() => !accountStore.selectedAccount)
const isDark = useDark()
function toggleThemeModal() {
  isThemeModalOpen.value = !isThemeModalOpen.value
}
function toggleNicknameModal() {
  isNicknameModalOpen.value = !isNicknameModalOpen.value
}

// Compute the first letter of the username
const accountInitial = computed(() => {
  return accountStore.selectedAccount?.nickname?.charAt(0).toUpperCase() || ''
})
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
        <Avatar :label="accountInitial" class="mr-2" size="xlarge" shape="circle" :style="{
          backgroundColor: isDark ? '#4B5563' : '#c0bab1'
        }" />
        <p>{{ accountStore.selectedAccount.nickname }}</p>
        <!-- Trong contact không có trường isActive nên không thể xác định user hoạt động hay không -->
        <!-- <p>{{ accountStore.selectedAccount.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p> -->
      </template>

      <div class="flex gap-6">
        <CustomIcon icon="bell" />
        <CustomIcon icon="magnifying-glass" />
      </div>
    </div>

    <div class="flex flex-col justify-center items-center gap-4 px-4">
      <CustomButton @click="toggleThemeModal" text="Đổi chủ đề" />
      <CustomButton @click="toggleNicknameModal" text="Chỉnh sửa biệt danh" />
    </div>
  </div>
  <Teleport to="#app">
    <ThemeModal :isOpen="isThemeModalOpen" @update:isOpen="isThemeModalOpen = $event" />
    <NicknameModal 
  :isOpen="isNicknameModalOpen" 
  @update:isOpen="isNicknameModalOpen = $event" 
  :contactId="accountStore.selectedAccount?.contactId" 
  :currentNickname="accountStore.selectedAccount?.nickname" 
/>
  </Teleport>
</template>
