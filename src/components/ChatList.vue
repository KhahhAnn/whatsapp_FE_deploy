<script setup>
import UserItems from './UserItems.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

const selectUser = (user) => {
  userStore.selectUser(user)
  console.log(userStore.selectedUser.name)
}
</script>

<template>
  <div
    class="flex flex-col justify-between h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode"
  >
    <div class="p-4 border-b-2 border-black">
      <h1 class="text-center text-2xl font-bold">Đoạn chat</h1>
      <input
        type="text"
        class="w-full py-2 px-4 mt-2 rounded-full focus:bg-white focus:outline-none bg-gray-300"
        placeholder="Tìm kiếm"
      />
    </div>
    <div class="grow overflow-auto">
      <UserItems
        v-for="user in userStore.users"
        :key="user.id"
        :user="user"
        @click="selectUser(user)"
      />
    </div>

    <div class="flex justify-center items-center gap-4 p-4 border-t-2 border-black">
      <font-awesome-icon :icon="['fas', 'download']" size="xl" />
      <p>Dùng thử WhatsApp dành cho điện thoại</p>
    </div>
  </div>
</template>
