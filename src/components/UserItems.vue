<script setup>
import { computed, ref } from 'vue'
import Avatar from 'primevue/avatar'
import Menu from 'primevue/menu';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast'
import { useContactStore } from '../stores/ContactStore'
import { useGroupStore } from '../stores/GroupStore'
import Toast from 'primevue/toast';

const toast = useToast();
const menu = ref();
const contactStore = useContactStore();
const groupStore = useGroupStore();

const props = defineProps({
  contact: {
    type: Object,
    required: false
  },
  group: {
    type: Object,
    required: false
  }
})

const items = ref([
  {
    items: [
      {
        label: props.contact ? 'Xoá liên hệ' : 'Xoá nhóm',
        icon: 'pi pi-trash',
        command: async () => {
          try {
            if (props.contact) {
              await contactStore.deleteContact(props.contact.contactId);
              toast.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Liên hệ đã xóa thành công',
                life: 3000
              });
            } else if (props.group) {
              await groupStore.deleteGroup(props.group.groupId);
              toast.add({
                severity: 'success',
                summary: 'Thành công',
                detail: 'Nhóm đã xóa thành công',
                life: 3000
              });
            }
          } catch (error) {
            console.error('Error deleting:', error);
          }
        }
      }
    ]
  }
]);

const toggle = (event) => {
  menu.value.toggle(event);
};

const displayName = computed(() => {
  return props.contact?.nickname || props.group?.groupName || '';
});

</script>

<template>
  <div
    class="flex justify-between items-center p-3 text-darkMode dark:text-lightMode hover:bg-lightModeHover dark:hover:bg-darkModeHover">
    <div class="flex items-center gap-4">
      <Avatar :image="props.contact.status" class="mr-2" size="xlarge" shape="circle" />
      <h1>{{ displayName }}</h1>
      <!-- <p v-if="contact" class="truncate max-w-[200px]">{{ contact?.message }}</p> -->
    </div>
    <Button type="button" icon="pi pi-ellipsis-v" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"
      size="small" variant="outlined" rounded />
    <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
    <Toast />
  </div>
</template>