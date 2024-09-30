<script setup>
import { ref, computed } from 'vue'
import UserModal from './UserModal.vue'
import { useUserStore } from '../stores/userStore'
import CustomIcon from './custom/CustomIcon.vue'
import CustomAvatar from './custom/CustomAvatar.vue'
import CustomInput from './custom/CustomInput.vue'

const isModalOpen = ref(false)
const userStore = useUserStore()

const isLoading = computed(() => !userStore.selectedUser)

function toggleModal() {
  isModalOpen.value = !isModalOpen.value
}
</script>

<template>
  <div
    :class="[
      'flex flex-col justify-between h-[calc(100vh-32px)] rounded-3xl shadow-2xl bg-lightMode dark:text-lightMode dark:bg-darkMode',
      isModalOpen ? 'w-1/2' : 'w-3/4'
    ]"
  >
    <div
      class="flex justify-between items-center p-4 border-b border-darkModeHover dark:border-lightModeHover"
    >
      <!-- Skeleton loader for user info -->
      <div v-if="isLoading" class="flex items-center gap-4">
        <div class="w-14 h-14 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
        <div class="space-y-2">
          <div class="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          <div class="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
      </div>

      <!-- User information -->
      <div v-else class="flex items-center gap-4 select-none">
        <CustomAvatar :avatar="userStore.selectedUser.avatar" width="3rem" height="3rem" />
        <div class="user-data text-darkMode dark:text-lightMode">
          <h1>{{ userStore.selectedUser.name }}</h1>
          <p>{{ userStore.selectedUser.isActive ? 'Đang hoạt động' : 'Không hoạt động' }}</p>
        </div>
      </div>

      <div class="flex gap-4">
        <CustomIcon icon="phone" size="lg" />
        <CustomIcon icon="video" size="lg" />
        <button @click="toggleModal">
          <CustomIcon v-if="isModalOpen" icon="angle-right" size="lg" />
          <CustomIcon v-else icon="angle-left" size="lg" />
        </button>
      </div>
    </div>

    <div ref="scrollContainer" class="flex flex-col-reverse overflow-auto p-4">
      <!-- Skeleton loader for messages -->
      <template v-if="isLoading">
        <div v-for="i in 5" :key="i" class="flex mb-4" :class="i % 2 === 0 ? 'justify-end' : ''">
          <div class="w-3/4 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
        </div>
      </template>

      <div v-else>
        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">Hey Bob, how's it going?</p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>Hi Alice! I'm good, just finished a great book. How about you?</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="My Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">
              That book sounds interesting! What's it about?That book sounds interesting! What's it
              about?That book sounds interesting! What's it about?That book sounds interesting!
              What's it about?That book sounds interesting! What's it about?That book sounds
              interesting! What's it about?
            </p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>It's about an astronaut stranded on Mars, trying to survive. Gripping stuff!</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="My Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">
              I'm intrigued! Maybe I'll borrow it from you when you're done?
            </p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>Of course! I'll drop it off at your place tomorrow.</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="My Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">Thanks, you're the best!</p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>Anytime! Let me know how you like it. 😊</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="My Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>

        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">So, pizza next week, right?</p>
          </div>
        </div>

        <!-- Outgoing Message -->
        <div class="flex justify-end mb-4 cursor-pointer">
          <div class="flex max-w-96 bg-indigo-500 text-white rounded-lg p-3 gap-3">
            <p>Absolutely! Can't wait for our pizza date. 🍕</p>
          </div>
          <div class="w-9 h-9 rounded-full flex items-center justify-center ml-2">
            <img
              src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="My Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
        </div>
        <!-- Incoming Message -->
        <div class="flex mb-4 cursor-pointer">
          <div class="w-9 h-9 rounded-full flex items-center justify-center mr-2">
            <img
              src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
              alt="User Avatar"
              class="w-8 h-8 rounded-full"
            />
          </div>
          <div class="flex max-w-96 bg-white rounded-lg p-3 gap-3">
            <p class="text-gray-700">Hoorayy!!</p>
          </div>
        </div>
      </div>
    </div>
    <div
      class="flex justify-center items-center gap-2 px-4 py-2 border-t border-darkModeHover dark:border-lightModeHover"
    >
      <CustomIcon icon="circle-plus" size="lg" />
      <CustomIcon icon="image" size="lg" />
      <CustomIcon icon="note-sticky" size="lg" />
      <CustomInput type="text" placeholder="Aa" />
      <button>
        <CustomIcon icon="paper-plane" size="lg" />
      </button>
    </div>
  </div>
  <UserModal :isOpen="isModalOpen" @update:isOpen="isModalOpen = $event" />
</template>
