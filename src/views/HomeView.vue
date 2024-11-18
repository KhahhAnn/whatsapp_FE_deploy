```vue-whatsapp-client/src/views/HomeView.vue
<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import ListContact from '@/components/ListContact.vue'
import DetailMessage from '@/components/DetailMessage.vue'
import { useSocketStore } from '../stores/SocketStore'
import { useContactStore } from '../stores/ContactStore'

const contactStore = useContactStore()
const socketStore = useSocketStore()

let socket

onMounted(() => {
  socketStore.connect()
})

onBeforeUnmount(() => {
  if (socket) {
    socket.disconnect()
  }
})
</script>

<template>
  <div class="flex gap-5 w-full min-h-screen p-4 bg-[#DBDDDC] dark:bg-slate-950">
    <ListContact />
    <DetailMessage v-if="contactStore.selectedContact" />
  </div>
</template>
