<script setup>
import { defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: true
  }
})
</script>

<template>
  <button
    class="flex items-center gap-5 w-full rounded-xl font-semibold p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover overflow-hidden">
    <font-awesome-icon :icon="icon" size="lg" v-if="icon"
      class="dark:hover:bg-darkModeHover hover:bg-lightModeHover cursor-pointer" />
    <span :class="{'hidden sm:inline-block': icon}">
      {{ text }}
    </span>
  </button>
</template>
