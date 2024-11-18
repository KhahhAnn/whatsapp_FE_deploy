<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import { useGroupStore } from '@/stores/GroupStore'

const groupStore = useGroupStore()
const groupName = ref('')
defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const handlecreateGroup = async () => {
  try {
    const createdBy = localStorage.getItem('userId');
    const response = await groupStore.createGroup(groupName.value, createdBy)
    console.log("response", response)
  } catch (error) {
    console.error('Failed to create group:', error)
  }
}

const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}
</script>

<template>
  <div v-if="isOpen" class="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode">
          <div class="flex flex-col justify-center items-center relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 class="text-center font-bold leading-10 text-darkMode dark:text-lightMode mb-3" id="modal-title">
                  {{ title }}
                </h3>
                <div class="relative w-full min-w-[300px] h-11">
                  <input v-model="groupName" :placeholder="placeholder"
                    class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border-b placeholder-shown:border-blue-gray-200 placeholder:opacity-0 focus:placeholder:opacity-100 text-sm pt-4 pb-1.5 border-blue-gray-200 focus:border-darkMode dark:focus:border-lightMode text-darkMode dark:text-lightMode" /><label
                    class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] after:content[''] after:block after:w-full after:absolute after:-bottom-1.5 after:border-b-2 after:scale-x-0 peer-focus:after:scale-x-100 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] text-darkMode dark:text-lightMode peer-focus:text-darkMode dark:peer-focus:text-lightMode after:border-darkMode dark:after:border-lightMode peer-focus:after:border-darkMode dark:peer-focus:after:border-lightMode">{{
                    label }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-between w-full px-6 py-4">
            <button type="button"
            @click="handlecreateGroup"
              class="border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover">
              Add
            </button>
            <button @click="closeModal" type="button"
              class="border px-4 py-2 rounded border-gray-600 hover:bg-lightModeHover dark:text-lightMode dark:hover:bg-darkModeHover">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
