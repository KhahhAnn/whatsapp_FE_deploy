<script setup>
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useDark } from '@vueuse/core'
import { useToast } from 'primevue/usetoast'
import { useContactStore } from '../stores/ContactStore'
import Toast from 'primevue/toast';

const toast = useToast();
const menu = ref();
const contactStore = useContactStore();
const items = ref([
  {
    items: [
      {
        label: 'Xoá liên hệ',
        icon: 'pi pi-trash',
        command: async () => {
          try {
            await contactStore.deleteContact(props.account.contactId);
            toast.add({
              severity: 'success',
              summary: 'Thành công',
              detail: 'Liên hệ đã xóa thành công',
              life: 3000
            });
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

const isDark = useDark()

const props = defineProps({
  account: {
    type: Object,
    required: false
  },
  group: {
    type: Object,
    required: false
  }
})

const displayName = computed(() => {
  return props.account?.nickname || props.group?.groupName || '';
});

const initial = computed(() => {
  return props.account?.nickname?.charAt(0).toUpperCase() || props.group?.groupName?.charAt(0).toUpperCase() || '';
});
</script>

<template>
  <div
    class="flex justify-between items-center p-3 text-darkMode dark:text-lightMode hover:bg-lightModeHover dark:hover:bg-darkModeHover">
    <div class="flex items-center gap-4">
      <Avatar :label="initial" class="mr-2" size="xlarge" shape="circle" :style="{
        backgroundColor: isDark ? '#4B5563' : '#dfe1e3'
      }" />

      <h1>{{ displayName }}</h1>
      <p v-if="account" class="truncate max-w-[200px]">{{ account?.message }}</p>
    </div>
    <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
      size="small" variant="outlined" rounded />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    <Toast />
  </div>
</template>