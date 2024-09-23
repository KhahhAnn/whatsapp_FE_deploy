<script setup>
import { defineProps } from 'vue'

defineProps({
  icon: {
    type: String,
    required: true
  }
})
</script>

<template>
  <font-awesome-icon
    :icon="icon"
    size="xl"
    class="rounded-full p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover"
  />
</template>
