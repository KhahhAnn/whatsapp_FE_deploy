<script setup>
import UserItems from './UserItems.vue'
import SidebarModal from './SidebarModal.vue'
import { useUserStore } from '../stores/userStore'
import { ref } from 'vue'

const userStore = useUserStore()
const isSidebarOpen = ref(false)

const selectUser = (user) => {
  userStore.selectUser(user)
  console.log(userStore.selectedUser.name)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
</script>

<template>
  <div
    class="flex flex-col justify-between h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode select-none"
  >
    <div
      class="flex justify-between items-center gap-4 p-4 border-b border-darkModeHover dark:border-lightModeHover"
    >
      <input
        type="text"
        class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
        placeholder="Tìm kiếm"
      />
      <font-awesome-icon
        icon="bars"
        class="p-2 rounded-full dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
        size="lg"
        @click="toggleSidebar"
      />
    </div>
    <SidebarModal :is-open="isSidebarOpen" @close="toggleSidebar" />
    <div :class="[isSidebarOpen ? 'hidden' : '']" class="grow overflow-auto scroll-smooth">
      <UserItems
        v-for="user in userStore.users"
        :key="user.id"
        :user="user"
        @click="selectUser(user)"
      />
    </div>
  </div>
</template>
