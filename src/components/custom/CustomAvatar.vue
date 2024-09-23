<script setup>
import { defineProps } from 'vue'

defineProps({
  avatar: {
    type: String,
    required: true
  },
  width: {
    type: String,
    default: '6rem' // Kích thước mặc định
  },
  height: {
    type: String,
    default: '6rem' // Kích thước mặc định
  }
})
</script>

<template>
  <img
    :class="`rounded-full object-cover`"
    :src="avatar"
    :alt="'User avatar'"
    :style="{ width, height }"
  />
</template>
