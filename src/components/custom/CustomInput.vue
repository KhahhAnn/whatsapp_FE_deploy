<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  modelValue: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value) // Phát ra sự kiện khi giá trị thay đổi
}
</script>

<template>
  <div class="flex flex-col w-full">
    <img v-if="modelValue" :src="modelValue" alt="Selected Image" class="mt-2 w-16 h-16 object-cover" /> 
    <input
    :type="type"
    class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
    :placeholder="placeholder"
    :value="modelValue"
    @input="updateValue" 
  />
  </div>
</template>