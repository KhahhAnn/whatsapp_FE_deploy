<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

import CustomButton from './custom/CustomButton.vue'
import CustomAvatar from './custom/CustomAvatar.vue'
import CustomModal from './custom/CustomModal.vue'
import { useUserStore } from '../stores/AccountStore'

const userStore = useUserStore();
const isDark = useDark()
const toggle = useToggle(isDark)
const isCustomContactModalOpen = ref(false)
const isCustomGroupModalOpen = ref(false)
const isCustomJoinGroupModalOpen = ref(false)

defineProps({
  isOpen: Boolean
})

function toggleContactModal() {
  isCustomContactModalOpen.value = !isCustomContactModalOpen.value
}
function toggleGroupModal() {
  isCustomGroupModalOpen.value = !isCustomGroupModalOpen.value
}
function toggleJoinGroupModal() {
  isCustomJoinGroupModalOpen.value = !isCustomJoinGroupModalOpen.value
}

onMounted(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    userStore.getContactByUser(userId);
  }
});

// Hàm để xử lý đăng xuất
function handleLogout() {
  userStore.logoutUser() // Gọi hàm logoutUser từ userStore
}
</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen"
      class="w-full h-[100%] rounded-3xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode shadow-lg">
      <div v-if="userStore.selectedUser" class="flex flex-col justify-center items-center gap-4 px-4 py-8">
        <CustomAvatar src="https://live.staticflickr.com/65535/53281664699_22ab1dee85_z.jpg" />
        <h1>username: {{ userStore.selectedUser.username }}</h1> <!-- Hiển thị username -->
        <h1>username: {{ userStore.selectedUser.email }}</h1> <!-- Hiển thị username -->



        <CustomButton icon="user-plus" text="Thêm liên hệ" @click="toggleContactModal" />
        <CustomButton icon="user-group" text="Tạo nhóm" @click="toggleGroupModal" />
        <CustomButton icon="plus" text="Tham gia nhóm" @click="toggleJoinGroupModal" />
        <CustomButton @click="toggle()" :icon="isDark ? 'sun' : 'moon'" :text="isDark ? 'Light Mode' : 'Dark Mode'" />
        <CustomButton icon="right-from-bracket" text="Đăng xuất" @click="handleLogout" /> <!-- Gọi handleLogout -->
      </div>
    </div>
  </Transition>
  <Teleport to="#app">
    <CustomModal title="Thêm liên hệ" placeholder="Thêm liên hệ" label="Thêm liên hệ" :isOpen="isCustomContactModalOpen"
      @update:isOpen="isCustomContactModalOpen = $event" />
    <CustomModal title="Tạo nhóm" placeholder="Tạo nhóm" label="Tạo nhóm" :isOpen="isCustomGroupModalOpen"
      @update:isOpen="isCustomGroupModalOpen = $event" />
    <CustomModal title="Tham gia nhóm" placeholder="Tham gia nhóm" label="Tham gia nhóm"
      :isOpen="isCustomJoinGroupModalOpen" @update:isOpen="isCustomJoinGroupModalOpen = $event" />
  </Teleport>
</template>
