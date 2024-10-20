<script setup>
import { defineProps, ref, computed, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

import CustomButton from '../custom/CustomButton.vue'
import CustomModal from '../custom/CustomModal.vue'
import HistoryCallModal from './HistoryCallModal.vue'
import ContactModal from './ContactModal.vue'
import { useUserStore } from '../../stores/UserStore'
import { useAccountStore } from '../../stores/AccountStore'

import Avatar from 'primevue/avatar'

import { defineEmits } from 'vue'

defineEmits(['close'])

const userStore = useUserStore()
const accountStore = useAccountStore()
const isDark = useDark()
const toggle = useToggle(isDark)
const isContactModalOpen = ref(false)
const isCustomGroupModalOpen = ref(false)
const isCustomJoinGroupModalOpen = ref(false)
const isHistoryCallModalOpen = ref(false)
defineProps({
  isOpen: Boolean
})

function toggleContactModal() {
  isContactModalOpen.value = !isContactModalOpen.value
}
function toggleGroupModal() {
  isCustomGroupModalOpen.value = !isCustomGroupModalOpen.value
}
function toggleJoinGroupModal() {
  isCustomJoinGroupModalOpen.value = !isCustomJoinGroupModalOpen.value
}

function toggleHistoryCallModal() {
  isHistoryCallModalOpen.value = !isHistoryCallModalOpen.value
}

function handleLogout() {
  accountStore.logoutUser()
}

onMounted(() => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    userStore.getUserDetail(userId);
  }
});

const userInitial = computed(() => {
  return userStore.selectedUser?.username?.charAt(0).toUpperCase() || ''
})

</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen"
      class="w-full h-[100%] rounded-3xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode shadow-lg">
      <div v-if="userStore.selectedUser" class="flex flex-col justify-center items-center gap-4 px-4 py-8">
        <Avatar :label="userInitial" class="mr-2" size="xlarge" shape="circle" :style="{
          backgroundColor: isDark ? '#4B5563' : '#c0bab1',
        }" />

        <h1 class="text-xl font-semibold">{{ userStore.selectedUser.username }}</h1>

        <CustomButton icon="user-plus" text="Thêm liên hệ" @click="toggleContactModal" />
        <CustomButton icon="user-group" text="Tạo nhóm" @click="toggleGroupModal" />
        <CustomButton icon="plus" text="Tham gia nhóm" @click="toggleJoinGroupModal" />
        <CustomButton icon="clock-rotate-left" text="Lịch sử cuộc gọi" @click="toggleHistoryCallModal" />
        <CustomButton @click="toggle()" :icon="isDark ? 'sun' : 'moon'" :text="isDark ? 'Chế độ sáng' : 'Chế độ tối'" />
        <CustomButton icon="right-from-bracket" text="Đăng xuất" @click="handleLogout" />
        <!-- Gọi handleLogout -->
      </div>
    </div>
  </Transition>
  <Teleport to="#app">
    <ContactModal :isOpen="isContactModalOpen" @update:isOpen="isContactModalOpen = $event" />
    <CustomModal title="Tạo nhóm" placeholder="Tạo nhóm" label="Tạo nhóm" :isOpen="isCustomGroupModalOpen"
      @update:isOpen="isCustomGroupModalOpen = $event" />
    <CustomModal title="Tham gia nhóm" placeholder="Tham gia nhóm" label="Tham gia nhóm"
      :isOpen="isCustomJoinGroupModalOpen" @update:isOpen="isCustomJoinGroupModalOpen = $event" />
    <HistoryCallModal :isOpen="isHistoryCallModalOpen" @update:isOpen="isHistoryCallModalOpen = $event" />
  </Teleport>
</template>
