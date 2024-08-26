<script setup>
const { isOpen } = defineProps({
  isOpen: Boolean
})
</script>

<template>
  <div
    v-if="isOpen"
    class="flex flex-col h-[calc(100vh-32px)] justify-between bg-[#FAF3E9] w-1/4 rounded-3xl shadow-2xl"
  ></div>
</template>
