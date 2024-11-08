<script setup>
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import ContactService from '../services/ContactService' // Import the ContactService

const menu = ref();
const items = ref([
  {
    label: 'Options',
    items: [
      {
        label: 'Delete contact',
        icon: 'pi pi-trash',
        command: async () => {
          try {
            await deleteContact(props.account.contactId) // Use contactId for deletion
            console.log('Contact deleted successfully');
          } catch (error) {
            console.error('Error deleting contact:', error);
          }
        }
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const deleteContact = async (contactId) => {
  try {
    await ContactService.handleDeleteContact(contactId)
  } catch (error) {
    console.error('Error deleting contact:', error)
  }
}

const isDark = useDark()

const props = defineProps({
  account: {
    type: Object,
    required: true
  }
})

const accountInitial = computed(() => {
  return props.account?.nickname?.charAt(0).toUpperCase() || ''
})
</script>

<template>
  <div
    class="flex justify-between items-center p-3 text-darkMode dark:text-lightMode hover:bg-lightModeHover dark:hover:bg-darkModeHover">
    <div class="flex items-center gap-4">
      <Avatar :label="accountInitial" class="mr-2" size="xlarge" shape="circle" :style="{
        backgroundColor: isDark ? '#4B5563' : '#c0bab1'
      }" />

      <h1>{{ account?.nickname }}</h1>
      <p class="truncate max-w-[200px]">{{ account?.message }}</p>
    </div>
    <!-- <font-awesome-icon class="p-3 rounded-2xl dark:text-lightMode hover:bg-[#d3cdc4] dark:hover:bg-gray-500"
      icon="ellipsis-vertical" size="lg" /> -->
    <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
  </div>
</template> 