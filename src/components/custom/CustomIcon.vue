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
  <font-awesome-icon :icon="icon" size="xl"
    class=" no-hover rounded-full p-2 hover:bg-lightModeHover dark:hover:bg-darkModeHover" />
</template>

<style>
/* CSS để vô hiệu hóa hover effect */
.no-hover .hover:bg-lightModeHover,
.no-hover .dark:hover:bg-darkModeHover {
  background-color: transparent; /* hoặc bất kỳ màu nền ban đầu của bạn */
}
</style>