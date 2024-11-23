<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { useUserStore } from '../../stores/UserStore.js'
import { useContactStore } from '../../stores/ContactStore.js'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import { useToast } from 'primevue/usetoast'

const toast = useToast()

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])
const userStore = useUserStore()
const contactStore = useContactStore()
const searchQuery = ref('')

// Theo dõi sự thay đổi của props.isOpen
watch(
  () => props.isOpen,
  async (newValue, oldValue) => {
    if (newValue && !oldValue) {
      if (userStore.users.length === 0) {
        await userStore.getAllUsers()
      }
    }
  }
)

// Computed property để lọc người dùng dựa trên giá trị tìm kiếm
const filteredUsers = computed(() => {
  return userStore.users.filter(
    (user) =>
      (user.phoneNumber &&
        user.phoneNumber.toLowerCase().includes(searchQuery.value.toLowerCase())) || // Tìm kiếm theo phoneNumber
      (user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) // Tìm kiếm theo username
  )
})

function closeModal() {
  emit('update:isOpen', false)
}

async function addContact(user) {
  try {
    const userId = localStorage.getItem('userId');
    await contactStore.addContact(userId, user.userId, user.username, user.profilePicture);
    await contactStore.getContactByUser(userId);
    toast.add({
      severity: 'success',
      summary: 'Thành công',
      detail: 'Liên hệ đã thêm thành công',
      life: 3000
    });
    closeModal();
  } catch (error) {
    console.error('Error adding contact in ContactModal:', error);
    toast.add({
      severity: 'error',
      summary: 'Lỗi',
      detail: 'User đã có liên hệ này rồi',
      life: 3000
    });
  }
}
</script>

<template>
  <div v-if="props.isOpen" class="relative z-10 text-darkMode dark:text-lightMode" aria-labelledby="modal-title"
    role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode">
          <div class="bg-lightMode dark:bg-darkMode w-full rounded-lg shadow-lg">
            <div class="flex justify-center items-center p-4 border-b border-darkMode dark:border-lightMode">
              <h2 class="text-lg font-semibold">Thêm liên hệ</h2>
            </div>
            <div class="p-4">
              <input type="text" v-model="searchQuery" @keyup.enter="searchUser" placeholder="Tìm kiếm"
                class="w-full p-2 border border-darkMode dark:border-lightMode rounded-lg bg-lightMode dark:bg-darkMode" />
            </div>
            <div class="min-h-80">
              <div class="overflow-y-auto border-darkMode dark:border-lightMode" v-if="searchQuery">
                <div v-for="user in filteredUsers" :key="user.userId"
                  class="flex justify-between items-center py-2 px-4 cursor-pointer">
                  <div class="flex items-center justify-start">
                    <Avatar :image="user.profilePicture" class="mr-2" size="large" shape="circle" />
                    <div class="flex flex-col justify-center items-start ml-4">
                      <div class="text-sm font-semibold">{{ user.username }}</div>
                      <div class="text-xs" :class="{ 'text-green-500': user.isOnline, 'text-red-500': !user.isOnline }">
                        {{ user.isOnline ? 'Đang hoạt động' : 'Không hoạt động' }}
                      </div>
                    </div>
                  </div>
                  <Button @click="addContact(user)" label="Thêm liên hệ" size="small" severity="primary" />
                  <Toast />
                </div>
              </div>
            </div>

            <div class="flex justify-end p-4 border-t border-darkMode dark:border-lightMode">
              <button @click="closeModal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
