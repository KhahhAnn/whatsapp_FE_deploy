<script setup>
import { ref } from 'vue'
import { useUserStore } from '../stores/userStore'
import SettingModal from './SettingModal.vue'

const isModalOpen = ref(false)
const userStore = useUserStore()

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}

const { isOpen } = defineProps({
  isOpen: Boolean
})
</script>

<template>
  <div
    v-if="isOpen"
    class="flex flex-col justify-start bg-[#FAF3E9] h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl"
  >
    <div v-if="userStore.selectedUser" class="flex flex-col justify-center items-center gap-2 py-8">
      <img
        class="w-24 h-24 rounded-full object-cover"
        :src="userStore.selectedUser ? userStore.selectedUser.avatar : ''"
      />
      <p>{{ userStore.selectedUser.name }}</p>
      <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
      <div class="flex gap-6">
        <font-awesome-icon icon="bell" size="xl" class="p-2 hover:bg-[#c0bab1] rounded-full" />
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />
        <button @click="toggleModal">
          <font-awesome-icon icon="gear" size="xl" class="p-2 hover:bg-[#c0bab1] rounded-full" />
        </button>
      </div>
    </div>

    <div class="flex flex-col justify-between">
      <div class="flex items-center min-w-0 gap-x-4 p-2 hover:bg-[#c0bab1] rounded-xl">
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">Thong tin doan chat</p>
        </div>
      </div>
      <div class="flex items-center min-w-0 gap-x-4 p-2 hover:bg-[#c0bab1] rounded-xl">
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">Thong tin doan chat</p>
        </div>
      </div>
      <div class="flex items-center min-w-0 gap-x-4 p-2 hover:bg-[#c0bab1] rounded-xl">
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">Thong tin doan chat</p>
        </div>
      </div>
      <div class="flex items-center min-w-0 gap-x-4 p-2 hover:bg-[#c0bab1] rounded-xl">
        <font-awesome-icon
          icon="magnifying-glass"
          size="xl"
          class="p-2 hover:bg-[#c0bab1] rounded-full"
        />

        <div class="min-w-0 flex-auto">
          <p class="text-sm font-semibold leading-6 text-gray-900">Thong tin doan chat</p>
        </div>
      </div>
    </div>
  </div>
  <SettingModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
