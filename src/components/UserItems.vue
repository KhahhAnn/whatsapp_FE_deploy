<script setup>
defineProps({
  user: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex justify-between items-center p-3 hover:bg-[#c0bab1]">
    <div class="flex items-center gap-4">
      <img class="w-16 h-16 rounded-full object-cover" :src="user.avatar" alt="Avatar" width="50" />
      <div class="user-data">
        <h1>{{ user.name }}</h1>
        <p class="truncate max-w-[200px]">{{ user.message }}</p>
      </div>
    </div>
    <font-awesome-icon
      class="hover:bg-[#d3cdc4] p-3 rounded-2xl"
      icon="ellipsis-vertical"
      size="lg"
    />
  </div>
</template>
