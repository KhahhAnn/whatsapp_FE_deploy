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
          <div class="relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-center font-bold leading-10 text-gray-900" id="modal-title">
                  Settings
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consequatur officiis
                    quidem obcaecati ut, itaque laborum hic doloribus optio iusto odio totam,
                    accusantium quis dolor! Aliquid fugit accusantium ipsam architecto officia?
                  </p>
                </div>
              </div>
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
