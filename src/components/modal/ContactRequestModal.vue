<script setup>
import { defineProps, defineEmits, onBeforeMount } from 'vue'

import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import { useToast } from 'primevue/usetoast'
import ContactService from '../../services/ContactService'
import { useContactStore } from '../../stores/ContactStore'

const contactStore = useContactStore()
const toast = useToast()
const userId = localStorage.getItem('userId')

defineProps({
  isOpen: Boolean,
})

const emit = defineEmits(['update:isOpen'])
function closeModal() {
  emit('update:isOpen', false)
}

onBeforeMount(async () => {
  if (userId) {
    await contactStore.getPendingContacts(userId)
  }
})

const acceptRequest = async (contact) => {
  try {
    await ContactService.handleAcceptContactRequest(
      contact.contactUserId,
      contact.userId,
      contact.senderNickname,
      contact.senderAvatar,
      'accepted'
    )
    await contactStore.getContactByUser(userId)
    await contactStore.getPendingContacts(userId)
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Bạn đã chấp nhận lời mời kết bạn',
      life: 3000
    })
    closeModal()
  } catch (error) {
    console.error('Error accepting contact request:', error)
  }
}

const declineRequest = async (contact) => {
  try {
    await ContactService.handleRejectContactRequest(contact.contactUserId, contact.userId)
    await contactStore.getPendingContacts(userId)

    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Bạn đã từ chối lời mời kết bạn',
      life: 3000
    })
    closeModal()
  } catch (error) {
    console.error('Error rejecting contact request:', error)
  }
}
</script>

<template>
  <div
    v-if="isOpen"
    class="relative z-10 text-darkMode dark:text-lightMode"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900"
      aria-hidden="true"
    ></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-xl bg-lightMode dark:bg-darkMode"
        >
          <!-- Modal -->
          <div class="bg-lightMode dark:bg-darkMode w-full rounded-lg shadow-lg">
            <!-- Title -->
            <div
              class="flex justify-center items-center p-4 border-b border-darkMode dark:border-lightMode"
            >
              <h2 class="text-lg font-semibold">Lời mời kết bạn</h2>
            </div>
            <!-- List lời mời kết bạn -->
            <div class="overflow-y-auto h-96 border-b border-darkMode dark:border-lightMode">
              <div
                v-for="contact in contactStore.pendingContacts"
                :key="contact.id"
                class="py-2 px-4 cursor-pointer hover:bg-lightModeHover dark:hover:bg-darkModeHover"
              >
                <div class="flex items-center justify-around gap-2">
                  <Avatar :image="contact.senderAvatar" class="" size="large" shape="circle" />
                  <p>{{ contact.senderNickname }} gửi lời mời kết bạn</p>
                  <Button @click="acceptRequest(contact)" label="Chấp nhận" severity="success" />
                  <Button @click="declineRequest(contact)" label="Từ chối" severity="danger" />
                </div>
              </div>
            </div>
            <!-- Button đóng modal -->
            <div class="flex justify-end p-4 border-t border-darkMode dark:border-lightMode">
              <button @click="closeModal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
