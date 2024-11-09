<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue'
import { useUserStore } from '../../stores/UserStore.js'
import { useAccountStore } from '../../stores/AccountStore.js'
import Avatar from 'primevue/avatar'
import { useDark } from '@vueuse/core'
// import ContactService from '../../services/ContactService'
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast'

const isDark = useDark()
const toast = useToast();

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])
const userStore = useUserStore()
const accountStore = useAccountStore()
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
      (user.phoneNumber && user.phoneNumber.toLowerCase().includes(searchQuery.value.toLowerCase())) || // Tìm kiếm theo phoneNumber
      (user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase())) // Tìm kiếm theo username
  )
})

function closeModal() {
  emit('update:isOpen', false)
}

async function addContact(user) {
  try {
    const userId = localStorage.getItem('userId');
    const response = await accountStore.addContact(userId, user.userId, user.username, 'friend');
    console.log("Contact request sent:", response);
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Contact added successfully',
      life: 3000
    });
    // Cập nhật lại danh sách contacts
    await accountStore.getContactByUser(userId); // Lấy lại danh sách contacts sau khi thêm

    closeModal();
  } catch (error) {
    console.error('Error adding contact:', error);
    if (error.response && error.response.data) {
      if (error.response.data.message === "User đã có liên hệ này rồi") {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'User đã có liên hệ này rồi',
          life: 3000
        });
      } else {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.response.data.message,
          life: 3000
        });
      }
    } else {
      alert('Có lỗi xảy ra khi thêm liên hệ.');
    }
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
            <div class="overflow-y-auto h-96 border-b border-darkMode dark:border-lightMode">
              <div v-for="user in filteredUsers" :key="user.userId"
                class="flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-lightModeHover dark:hover:bg-darkModeHover">
                <div class="flex items-center justify-start">
                  <Avatar :label="user.username.charAt(0).toUpperCase()" class="mr-2" size="large" shape="circle"
                    :style="{
                      backgroundColor: isDark ? '#4B5563' : '#c0bab1'
                    }" />
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
            <div class="flex justify-end p-4 border-t border-darkMode dark:border-lightMode">
              <button @click="closeModal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
