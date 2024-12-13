<script setup>
import { defineProps, defineEmits, onMounted } from 'vue'
import { useCallStore } from '../../stores/CallStore'

const callStore = useCallStore()

onMounted(async () => {
  const userId = localStorage.getItem('userId')
  if (userId) {
    await callStore.handleGetCallbyUser(userId)
  }
})

defineProps({
  isOpen: Boolean
})
const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}

const formatDate = (dateStr) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }
  return new Date(dateStr).toLocaleDateString('en-US', options)
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const durationMs = end - start;
  const seconds = Math.floor((durationMs / 1000) % 60);
  const minutes = Math.floor((durationMs / 1000 / 60) % 60);
  const hours = Math.floor((durationMs / 1000 / 60 / 60) % 24);

  return `${hours}h ${minutes}m ${seconds}s`;
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
        <!-- Modal container -->
        <div
          class="p-6 relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl text-darkMode dark:text-lightMode bg-lightMode dark:bg-darkMode"
        >
          <h2 class="my-5 text-lg font-medium" id="modal-title">Lịch sử cuộc gọi</h2>
          <div class="overflow-x-auto">
            <table class="min-w-full border border-gray-200">
              <thead>
                <tr class="border-b">
                  <th class="p-4 text-left">Người gọi</th>
                  <th class="p-4 text-left">Người nhận</th>
                  <th class="p-4 text-left">Call Type</th>
                  <th class="p-4 text-left">Duration</th>
                  <th class="p-4 text-left">Date and Time</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="call in callStore.calls" :key="call.id" class="border-b">
                  <td class="p-4 text-left">{{ call.callerName }}</td>
                  <td class="p-4 text-left">{{ call.receiverName }}</td>
                  <td class="p-4 text-left text-green-500">
                    {{ call.callType }}
                  </td>
                  <td class="p-4 text-left">{{ calculateDuration(call.startTime, call.endTime) }}</td>
                  <td class="p-4 text-left">{{ formatDate(call.startTime) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <button
            @click="closeModal"
            type="button"
            class="m-8 border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
