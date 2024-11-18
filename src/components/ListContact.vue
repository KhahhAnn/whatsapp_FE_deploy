<script setup>
import { ref, onBeforeMount, computed } from 'vue'

import CustomIcon from './custom/CustomIcon.vue'
import UserItems from './UserItems.vue'
import LeftModal from './modal/LeftModal.vue'
import { useContactStore } from '../stores/ContactStore'
import { useGroupStore } from '../stores/GroupStore'

const contactStore = useContactStore()
const groupStore = useGroupStore()
const isSidebarOpen = ref(false)

const selectedNickname = computed(() => contactStore.selectedContact?.nickname)

const selectAccount = (account) => {
  contactStore.selectContact(account)
  contactStore.selectedContact.contactUserId = account.contactUserId // Cập nhật contactUserId
  console.log(account.contactUserId)
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  console.log(selectedNickname.value)
}

onBeforeMount(async () => {
  const userId = localStorage.getItem('userId')
  if (userId) {
    await contactStore.getContactByUser(userId)
    contactStore.selectContact(contactStore.contacts[0])
  }
  await groupStore.getAllGroups()
})

const filteredAccounts = computed(() => {
  return contactStore.contacts.filter(account => account) // Filter out any falsy accounts
})

const filteredGroups = computed(() => {
  return groupStore.groups.filter(group => group)
})
</script>

<template>
  <div
    class="flex flex-col justify-between h-[calc(100vh-32px)] w-1/4 rounded-3xl shadow-2xl bg-lightMode dark:bg-darkMode dark:text-lightMode select-none">
    <div class="flex justify-between items-center gap-4 p-4 border-b border-darkModeHover dark:border-lightModeHover">
      <input type="text"
        class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
        placeholder="Tìm kiếm" />
      <CustomIcon icon="bars" size="lg" @click="toggleSidebar" />
    </div>

    <!-- Skeleton loader for user items -->
    <div :class="[isSidebarOpen ? 'hidden' : '']" v-if="contactStore.contacts.length === 0"
      class="grow overflow-auto scroll-smooth">
      <div v-for="i in 7" :key="i"
        class="flex items-center gap-4 p-4 border-darkModeHover dark:border-lightModeHover animate-pulse">
        <div class="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        <div class="flex-1 space-y-2">
          <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div class="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>

    <LeftModal :is-open="isSidebarOpen" @close="toggleSidebar" />
    <div :class="[isSidebarOpen ? 'hidden' : '']" class="grow overflow-auto scroll-smooth">
      <UserItems v-for="account in filteredAccounts" :key="account?.id" :account="account"
        @click="selectAccount(account)" />
      <UserItems v-for="group in filteredGroups" :key="group?.id" :account="group" @click="selectAccount(group)" />
    </div>
  </div>
</template>
