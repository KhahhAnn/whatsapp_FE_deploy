<script setup>
import ListContact from '@/components/ListContact.vue'
import DetailMessage from '@/components/DetailMessage.vue'
// import { useUserStore } from '../stores/AccountStore'

// const userStore = useUserStore()

// userStore.fetchUsers()
</script>

<template>
  <div class="flex gap-5 w-full min-h-screen p-4 bg-[#DBDDDC] dark:bg-slate-950">
    <ListContact />
    <DetailMessage />
  </div>
</template>
