<script setup>
import { ref, watch } from 'vue'
import ContactService from '../../services/ContactService'
import { useContactStore } from '../../stores/ContactStore'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';

const props = defineProps({
  isOpen: Boolean,
  contactId: String,
  currentNickname: String
})

const emit = defineEmits(['update:isOpen'])
const toast = useToast();

const newNickname = ref(props.currentNickname)
const contactStore = useContactStore()
// Theo dõi sự thay đổi của currentNickname
watch(() => props.currentNickname, (newValue) => {
  newNickname.value = newValue
})

async function updateNickname() {
  try {
    // Gọi API để cập nhật nickname trong cơ sở dữ liệu
    await ContactService.handleUpdateContact(props.contactId, newNickname.value);

    // Cập nhật nickname trong selectedContact
    contactStore.selectContact({ ...contactStore.selectedContact, nickname: newNickname.value });

    // Cập nhật nickname trong danh sách contacts
    const contact = contactStore.contacts.find(contact => contact.contactId === props.contactId);
    if (contact) {
      contact.nickname = newNickname.value; // Cập nhật nickname trong danh sách
    }

    console.log('Cập nhật biệt danh thành công', contactStore.selectedContact.nickname);
    toast.add({ severity: 'success', summary: 'Thành công', detail: 'Cập nhật biệt danh thành công', life: 3000 });

    // Đóng modal
    closeModal();
  } catch (error) {
    console.error('Error updating nickname:', error);
    toast.add({ severity: 'error', summary: 'Thất bại', detail: 'Cập nhật biệt danh thất bại', life: 3000 });
  }
}

function closeModal() {
  emit('update:isOpen', false)
}
</script>

<template>
  <div v-if="isOpen" class="relative z-10 text-darkMode dark:text-lightMode" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode">
          <!-- Block modal -->
          <div class="relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 class="text-center font-bold leading-10 mb-4 text-darkMode dark:text-lightMode" id="modal-title">
              Biệt danh
            </h3>
            <div class="relative h-11">
              <input type="text" v-model="newNickname" placeholder="Nhập biệt danh mới"
                class="peer w-full h-full bg-transparent text-blue-gray-700 font-sans font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 disabled:cursor-not-allowed transition-all border-b placeholder-shown:border-blue-gray-200 placeholder:opacity-0 focus:placeholder:opacity-100 text-sm pt-4 pb-1.5 border-blue-gray-200 focus:border-darkMode dark:focus:border-lightMode text-darkMode dark:text-lightMode" /><label
                class="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-blue-gray-500 leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500 transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] after:content[''] after:block after:w-full after:absolute after:-bottom-1.5 after:border-b-2 after:scale-x-0 peer-focus:after:scale-x-100 after:transition-transform after:duration-300 peer-placeholder-shown:leading-[4.25] text-darkMode dark:text-lightMode peer-focus:text-darkMode dark:peer-focus:text-lightMode after:border-darkMode dark:after:border-lightMode peer-focus:after:border-darkMode dark:peer-focus:after:border-lightMode">
                Biệt danh
              </label>
            </div>
          </div>
          <div class="absolute top-4 right-4">
            <button @click="closeModal" type="button">
              <font-awesome-icon icon="xmark"
                class="p-2 rounded-xl border border-gray-600 text-darkMode hover:bg-lightModeHover dark:hover:bg-darkModeHover dark:text-lightMode" />
            </button>
          </div>
          <div class="flex justify-center pb-4">
            <Button label="Cập nhật" severity="success" @click="updateNickname" />
          </div>
        </div>
        <Toast />
      </div>
    </div>
  </div>
</template>