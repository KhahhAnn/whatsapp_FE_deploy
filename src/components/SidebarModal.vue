<script setup>
import { defineProps } from 'vue'
import { useDark, useToggle } from '@vueuse/core'
import ButtonOption from './custom/CustomButton.vue' // Import your buttonOption component
import CustomAvatar from './custom/CustomAvatar.vue'

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
        <CustomAvatar src="https://live.staticflickr.com/65535/53281664699_22ab1dee85_z.jpg" />
        <ButtonOption icon="user-plus" text="Thêm liên hệ" />
        <ButtonOption icon="user-group" text="Tạo nhóm" />
        <ButtonOption icon="plus" text="Tham gia nhóm" />
        <ButtonOption
          @click="toggle()"
          :icon="isDark ? 'sun' : 'moon'"
          :text="isDark ? 'Light Mode' : 'Dark Mode'"
        />
        <ButtonOption icon="right-from-bracket" text="Đăng xuất" />
      </div>
    </div>
  </Transition>
</template>
