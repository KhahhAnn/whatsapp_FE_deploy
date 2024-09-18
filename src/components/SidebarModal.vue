<script setup>
import { defineProps } from 'vue'
import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggle = useToggle(isDark)

defineProps({
  isOpen: Boolean
})
</script>

<template>
  <Transition name="slide">
    <div
      v-if="isOpen"
      class="fixed inset-y-0 left-0 w-80 text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode shadow-lg"
    >
      <div class="flex flex-col items-stretch gap-4 p-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ891HLuugNKthcStMIQ3VD_phd6XrcYAhkjA&s"
          class="w-14 h-14 rounded-full object-cover"
        />
        <button
          @click="toggleThemeModal"
          class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          Thêm liên hệ
        </button>
        <button
          @click="toggleNicknameModal"
          class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          Tạo nhóm
        </button>
        <button
          class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          THam gia nhóm
        </button>
        <button
          @click="toggle()"
          class="rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
