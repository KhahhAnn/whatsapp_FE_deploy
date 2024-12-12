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
      class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900"
      aria-hidden="true"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-lightMode dark:bg-darkMode"
        >
          <div class="px-4 pt-5 sm:p-6">
            <h2 class="text-lg font-medium" id="modal-title">Call History</h2>
            <!-- List of calls -->
          </div>

          <div class="flex justify-between w-full px-6 py-4">
            <button
              @click="closeModal"
              type="button"
              class="border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
