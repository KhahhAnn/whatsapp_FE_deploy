<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}
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
          class="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="w-96 rounded-lg p-6">
              <!-- Header -->
              <div class="font-bold text-xl text-center mb-6">Chọn chủ đề</div>

              <!-- Theme Selection -->
              <div class="flex flex-col">
                <span>App color theme</span>
                <select class="bg-[#7c7873] text-white p-2 rounded">
                  <option>System default</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>

              <!-- Chat Wallpaper -->
              <div class="mt-6 flex flex-col justify-center items-center">
                <span class="text-lg mb-2">Chat wallpaper</span>
                <div class="grid grid-cols-4 gap-8">
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-red-400 to-red-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded hover:border border-gray-600"
                  />
                  <div
                    class="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded hover:border border-gray-600"
                  />
                </div>
              </div>

              <button class="flex mt-4 border border-gray-600 px-4 py-2 rounded hover:bg-[#c0bab1]">
                Reset
              </button>
            </div>
          </div>
          <div class="absolute top-4 right-4">
            <button @click="closeModal" type="button">
              <font-awesome-icon
                icon="xmark"
                class="p-2 hover:bg-[#c0bab1] rounded-xl border border-gray-600"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
