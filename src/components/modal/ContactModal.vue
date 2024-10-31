<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue' // Thêm watch
import { useUserStore } from '../../stores/UserStore.js'
import Avatar from 'primevue/avatar'
import { useDark } from '@vueuse/core'

const isDark = useDark()

const props = defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])
const userStore = useUserStore() // Khởi tạo store
const searchQuery = ref('') // Biến để lưu trữ giá trị tìm kiếm

// Theo dõi sự thay đổi của props.isOpen
watch(
  () => props.isOpen,
  async (newValue, oldValue) => {
    if (newValue && !oldValue) {
      // Kiểm tra khi modal mở từ trạng thái đóng
      // Chỉ gọi getAllUsers nếu users là rỗng hoặc bạn muốn cập nhật theo lịch cụ thể
      if (userStore.users.length === 0) {
        await userStore.getAllUsers()
      }
    }
  }
)

// Computed property để lọc người dùng dựa trên giá trị tìm kiếm
const filteredUsers = computed(() => {
  return userStore.users.filter(
    (user) => user.username && user.username.toLowerCase().includes(searchQuery.value.toLowerCase()) // Kiểm tra user.username
  )
})

function closeModal() {
  emit('update:isOpen', false)
}
</script>

<template>
  <div
    v-if="props.isOpen"
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
          class="relative transform rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode"
        >
          <div class="bg-lightMode dark:bg-darkMode w-full rounded-lg shadow-lg">
            <div
              class="flex justify-center items-center p-4 border-b border-darkMode dark:border-lightMode"
            >
              <h2 class="text-lg font-semibold">Thêm liên hệ</h2>
            </div>
            <div class="p-4">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Tìm kiếm"
                class="w-full p-2 border border-darkMode dark:border-lightMode rounded-lg bg-lightMode dark:bg-darkMode"
              />
            </div>
            <div class="overflow-y-auto h-96 border-b border-darkMode dark:border-lightMode">
              <div
                v-for="user in filteredUsers"
                :key="user.userId"
                class="py-2 px-4 cursor-pointer hover:bg-lightModeHover dark:hover:bg-darkModeHover"
              >
                <div class="flex items-center justify-between">
                  <div v-if="userStore.selectedUser" class="flex item-center">
                    <!-- Add user avatar or image here if available -->
                    <Avatar
                      :label="user.username.charAt(0).toUpperCase()"
                      class="mr-2"
                      size="large"
                      shape="circle"
                      :style="{
                        backgroundColor: isDark ? '#4B5563' : '#c0bab1'
                      }"
                    />
                    <div class="flex flex-col justify-center items-start ml-4">
                      <div class="text-sm font-semibold">{{ user.username }}</div>
                      <!-- Hiển thị tên người dùng -->
                      <div
                        class="text-xs"
                        :class="{ 'text-green-500': user.isOnline, 'text-red-500': !user.isOnline }"
                      >
                        {{ user.isOnline ? 'Đang hoạt động' : 'Không hoạt động' }}
                      </div>
                      <!-- Hiển thị trạng thái người dùng -->
                    </div>
                  </div>
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
