<script setup>
import { defineProps, ref, onMounted } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

import CustomButton from '../custom/CustomButton.vue'
import CustomModal from '../custom/CustomModal.vue'
import ContactRequestModal from './ContactRequestModal.vue'
import ContactModal from './ContactModal.vue'
import HistoryCallModal from './HistoryCallModal.vue'

import { useUserStore } from '../../stores/UserStore'
import { useAccountStore } from '../../stores/AccountStore'
import { useSocketStore } from '../../stores/SocketStore'
import { useContactStore } from '../../stores/ContactStore'

import Avatar from 'primevue/avatar'
import OverlayBadge from 'primevue/overlaybadge'
import { useToast } from 'primevue/usetoast'

import { defineEmits } from 'vue'

defineEmits(['close'])

const userStore = useUserStore()
const accountStore = useAccountStore()
const isDark = useDark()
const toast = useToast()
const toggle = useToggle(isDark)
const socketStore = useSocketStore()
const fileInput = ref(null)
const isContactModalOpen = ref(false)
const isCustomGroupModalOpen = ref(false)
const isCustomJoinGroupModalOpen = ref(false)
const isContactRequestModalOpen = ref(false)
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

function toggleContactRequestModal() {
  isContactRequestModalOpen.value = !isContactRequestModalOpen.value
}

function toggleHistoryCallModal() {
  isHistoryCallModalOpen.value = !isHistoryCallModalOpen.value
}

function handleLogout() {
  accountStore.logoutUser()
  socketStore.disconnect()
}

onMounted(() => {
  const userId = localStorage.getItem('userId')
  if (userId) {
    userStore.getUserDetail(userId)
  }
})

const handleUpdateUserAvatar = async () => {
  const inputElement = fileInput.value
  if (inputElement.files.length > 0) {
    const file = inputElement.files[0]
    const reader = new FileReader()

    reader.onloadend = async () => {
      const base64String = reader.result
      try {
        await accountStore.updateUserAvatar(
          userStore.selectedUser.userId,
          userStore.selectedUser.phoneNumber,
          base64String
        )
        console.log('Avatar updated successfully')

        userStore.selectedUser.profilePicture = base64String

        toast.add({
          severity: 'success',
          summary: 'Thành công',
          detail: 'Ảnh đại diện đã cập nhật thành công',
          life: 3000
        })
      } catch (error) {
        console.error('Error updating avatar:', error)
      }
    }

    reader.readAsDataURL(file)
  }
}

const contactStore = useContactStore()

onMounted(async () => {
  const userId = localStorage.getItem('userId')
  if (userId) {
    await contactStore.getPendingContacts(userId)
  }
})
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="min-w-24 h-[calc(100vh-32px)] overflow-auto rounded-3xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode shadow-lg"
    >
      <div
        v-if="userStore.selectedUser"
        class="flex flex-col justify-center items-center gap-4 px-4 pt-9"
      >
        <!-- Avatar -->
        <OverlayBadge
          severity="success"
          value="edit"
          icon="pencil"
          @click="$refs.fileInput.click()"
          class="cursor-pointer"
        >
          <Avatar
            :image="userStore.selectedUser.profilePicture"
            class="mr-2 cursor-default"
            size="xlarge"
            shape="circle"
            @click.stop
          />
          <input
            type="file"
            ref="fileInput"
            @change="handleUpdateUserAvatar"
            hidden
            accept="image/*,video/*"
            multiple
          />
        </OverlayBadge>
        <!-- Username -->
        <h1 class="text-xl font-semibold hidden sm:inline-block">{{ userStore.selectedUser.username }}</h1>

        <!-- Button -->
        <div class="flex flex-col overflow-auto justify-center items-start gap-4 py-8 w-full">
          <CustomButton icon="user-plus" text="Thêm liên hệ" @click="toggleContactModal" />
          <CustomButton icon="user-group" text="Tạo nhóm" @click="toggleGroupModal" />
          <CustomButton icon="plus" text="Tham gia nhóm" @click="toggleJoinGroupModal" />
          <OverlayBadge :value="contactStore.pendingContacts.length" severity="danger" class="">
            <CustomButton
              icon="clock-rotate-left"
              text="Lời mời kết bạn"
              @click="toggleContactRequestModal"
            />
          </OverlayBadge>
          <CustomButton
            icon="box-archive"
            text="Lịch sử cuộc gọi"
            @click="toggleHistoryCallModal"
          />
          <CustomButton
            @click="toggle()"
            :icon="isDark ? 'sun' : 'moon'"
            :text="isDark ? 'Chế độ sáng' : 'Chế độ tối'"
          />
          <CustomButton icon="right-from-bracket" text="Đăng xuất" @click="handleLogout" />
        </div>
        <!-- Gọi handleLogout -->
      </div>
    </div>
  </Transition>
  <Teleport to="#app">
    <!-- Thêm liên hệ -->
    <ContactModal :isOpen="isContactModalOpen" @update:isOpen="isContactModalOpen = $event" />
    <!-- Tạo nhóm -->
    <CustomModal
      title="Tạo nhóm"
      placeholder="Tạo nhóm"
      label="Tạo nhóm"
      :isOpen="isCustomGroupModalOpen"
      @update:isOpen="isCustomGroupModalOpen = $event"
    />
    <!-- Tham gia nhóm -->
    <CustomModal
      title="Tham gia nhóm"
      placeholder="Tham gia nhóm"
      label="Tham gia nhóm"
      :isOpen="isCustomJoinGroupModalOpen"
      @update:isOpen="isCustomJoinGroupModalOpen = $event"
    />
    <!-- Lời mời kết bạn -->
    <ContactRequestModal
      :isOpen="isContactRequestModalOpen"
      @update:isOpen="isContactRequestModalOpen = $event"
      :pendingContacts="contactStore.pendingContacts"
    />
    <HistoryCallModal
      :isOpen="isHistoryCallModalOpen"
      @update:isOpen="isHistoryCallModalOpen = $event"
    />
  </Teleport>
</template>
