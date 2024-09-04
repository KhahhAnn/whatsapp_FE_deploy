<script setup>
import ChatList from '@/components/ChatList.vue'
import DetailMessage from '@/components/DetailMessage.vue'
import { useUserStore } from '../stores/userStore'

const userStore = useUserStore()

userStore.fetchUsers()
</script>

<template>
  <div class="flex gap-5 w-full min-h-screen p-4 bg-[#DBDDDC] dark:bg-slate-950">
    <ChatList />
    <DetailMessage />
  </div>
</template>
