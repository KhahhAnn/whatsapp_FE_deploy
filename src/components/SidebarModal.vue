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
      class="w-full h-[100%] rounded-3xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode shadow-lg"
    >
      <div class="flex flex-col justify-center items-center gap-4 px-24 py-8">
        <img
          src="https://live.staticflickr.com/65535/53281664699_22ab1dee85_z.jpg"
          class="w-24 h-24 rounded-full object-cover mb-4"
        />
        <button
          @click="toggleThemeModal"
          class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          <font-awesome-icon
            icon="user-plus"
            class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            size="lg"
          />
          Thêm liên hệ
        </button>
        <button
          @click="toggleNicknameModal"
          class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          <font-awesome-icon
            icon="user-group"
            class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            size="lg"
          />
          Tạo nhóm
        </button>
        <button
          class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          <font-awesome-icon
            icon="plus"
            class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            size="lg"
          />
          Tham gia nhóm
        </button>
        <button
          @click="toggle()"
          class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          <div>
            <font-awesome-icon
              v-if="isDark"
              icon="sun"
              size="xl"
              class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            />
            <font-awesome-icon
              v-else
              icon="moon"
              size="xl"
              class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            />
          </div>
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <button
          class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
        >
          <font-awesome-icon
            icon="right-from-bracket"
            class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
            size="lg"
          />
          Đăng xuất
        </button>
      </div>
    </div>
  </Transition>
</template>
