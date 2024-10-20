<script setup>
import { computed } from 'vue';
import Avatar from 'primevue/avatar';
import { useDark } from '@vueuse/core'

const isDark = useDark()

const props = defineProps({
  account: {
    type: Object,
    required: true
  }
})

const accountInitial = computed(() => {
  return props.account.nickname?.charAt(0).toUpperCase() || '';
});

</script>

<template>
  <div
    class="flex justify-between items-center p-3 text-darkMode dark:text-lightMode hover:bg-lightModeHover dark:hover:bg-darkModeHover">
    <div class="flex items-center gap-4">
      <Avatar :label="accountInitial" class="mr-2" size="xlarge" shape="circle" :style="{
        backgroundColor: isDark ? '#4B5563' : '#c0bab1',
      }" />

      <h1>{{ account.nickname }}</h1>
      <p class="truncate max-w-[200px]">{{ account.message }}</p>
    </div>
    <font-awesome-icon class="p-3 rounded-2xl dark:text-lightMode hover:bg-[#d3cdc4] dark:hover:bg-gray-500"
      icon="ellipsis-vertical" size="lg" />
  </div>
</template>