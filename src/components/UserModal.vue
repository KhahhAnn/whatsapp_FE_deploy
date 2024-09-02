<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import ThemeModal from './ThemeModal.vue'
import NicknameModal from './NicknameModal.vue'

defineProps({
  isOpen: Boolean
})

const isThemeModalOpen = ref(false)
const isNicknameModalOpen = ref(false)
const userStore = useUserStore()

function toggleThemeModal() {
  isThemeModalOpen.value = !isThemeModalOpen.value
}
function toggleNicknameModal() {
  isNicknameModalOpen.value = !isNicknameModalOpen.value
  console.log('clicked')
}
</script>

<template>
  <div
    v-if="isOpen"
    class="flex flex-col justify-start bg-[#FAF3E9] h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl"
  >
    <div v-if="userStore.selectedUser" class="flex flex-col justify-center items-center gap-2 py-8">
      <img
        class="w-24 h-24 rounded-full object-cover"
        :src="userStore.selectedUser ? userStore.selectedUser.avatar : ''"
      />
      <p>{{ userStore.selectedUser.name }}</p>
      <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
      <div class="flex gap-6">
        <font-awesome-icon icon="bell" size="xl" class="p-2 hover:bg-[#c0bab1] rounded-full" />
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <button
        @click="toggleThemeModal"
        class="p-2 hover:bg-[#c0bab1] rounded-xl text-lg font-semibold"
      >
        Đổi chủ đề
      </button>
      <button
        @click="toggleNicknameModal"
        class="p-2 hover:bg-[#c0bab1] rounded-xl text-lg font-semibold"
      >
        Chỉnh sửa biệt danh
      </button>
    </div>
  </div>
  <Teleport to="#app">
    <ThemeModal :isOpen="isThemeModalOpen" @update:isOpen="isThemeModalOpen = $event" />
    <NicknameModal :isOpen="isNicknameModalOpen" @update:isOpen="isNicknameModalOpen = $event" />
  </Teleport>
</template>
