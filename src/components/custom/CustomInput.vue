<script setup>
import { defineProps } from 'vue'

defineProps({
  placeholder: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
</script>

<template>
  <input
    :type="type"
    class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
    :placeholder="placeholder"
  />
</template>
