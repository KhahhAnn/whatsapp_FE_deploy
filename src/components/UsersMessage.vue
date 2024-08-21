<script setup>
import { onMounted, ref } from 'vue'
import UserItems from './UserItems.vue'
import axios from 'axios'

const users = ref([])

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/users')
    users.value = response.data
  } catch (error) {
    console.error('Failed to fetch users:', error)
  }
})
</script>

<template>
  <div class="flex flex-col justify-between bg-[#FAF3E9] w-1/4 rounded-3xl shadow-2xl">
    <div class="flex flex-col justify-start">
      <div class="p-4 border-b-2 border-black">
        <h1 class="text-2xl font-bold">Đoạn chat</h1>
        <input
          type="text"
          class="w-full py-2 px-4 mt-2 rounded-full bg-gray-300 focus:bg-white focus:outline-none"
          placeholder="Tìm kiếm"
        />
      </div>
      <div class="grow overflow-auto max-h-[78vh]">
        <UserItems v-for="user in users" :key="user.id" :user="user" />
      </div>
    </div>

    <div class="flex justify-center items-center gap-4 p-4 border-t-2 border-black">
      <font-awesome-icon :icon="['fas', 'download']" size="xl" />
      <p>Dùng thử WhatsApp dành cho điện thoại</p>
    </div>
  </div>
</template>
