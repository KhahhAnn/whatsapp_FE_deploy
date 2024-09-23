<script setup>
import { defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button
    class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
  >
    <font-awesome-icon
      :icon="icon"
      class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer"
      size="lg"
    />
    {{ text }}
  </button>
</template>
