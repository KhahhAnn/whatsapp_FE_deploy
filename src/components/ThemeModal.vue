<script setup>
import { useDark, useToggle } from '@vueuse/core'
import { defineProps, defineEmits } from 'vue'

defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}

const isDark = useDark()
const toggle = useToggle(isDark)
</script>

<template>
  <div
    v-if="isOpen"
    class="relative z-10"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
      aria-hidden="true"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-lightMode dark:bg-darkMode"
        >
          <div class="flex flex-col items-center justify-center p-8">
            <!-- Header -->
            <div class="font-bold text-xl text-center mb-6 dark:text-lightMode">Chọn chủ đề</div>

            <!-- Theme Selection -->
            <div class="flex flex-col justify-center items-center">
              <span class="dark:text-lightMode">App color theme</span>
              <select class="mt-2 p-2 rounded border-2">
                <option>System default</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>

            <!-- Chat Wallpaper -->
            <div class="mt-8 flex flex-col justify-center items-center">
              <span class="text-lg mb-2 dark:text-lightMode">Chat wallpaper</span>
              <div class="grid grid-cols-4 gap-8">
                <button
                  class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded hover:border-2 hover:border-green-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded hover:border-2 hover:border-blue-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded hover:border-2 hover:border-yellow-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded hover:border-2 hover:border-pink-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded hover:border-2 hover:border-red-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded hover:border-2 hover:border-purple-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded hover:border-2 hover:border-orange-700"
                />
                <button
                  class="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded hover:border-2 hover:border-teal-700"
                />
              </div>
            </div>

            <div class="flex justify-between w-full mt-8">
              <button
                @click="toggle()"
                class="border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover"
              >
                Reset
              </button>
              <button
                class="border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover"
              >
                Save
              </button>
            </div>
          </div>
          <div class="absolute top-4 right-4">
            <button @click="closeModal" type="button">
              <font-awesome-icon
                icon="xmark"
                class="p-2 rounded-xl border hover:bg-lightModeHover border-gray-600 dark:hover:bg-darkModeHover dark:text-lightMode"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
