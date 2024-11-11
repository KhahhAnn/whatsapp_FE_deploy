<script setup>
import { ref, watch } from 'vue'
import ContactService from '../../services/ContactService'
import { useAccountStore } from '../../stores/AccountStore'
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
  isOpen: Boolean,
  contactId: String,
  currentNickname: String
})

const emit = defineEmits(['update:isOpen'])
const toast = useToast();

const newNickname = ref(props.currentNickname)
const accountStore = useAccountStore()
// Theo dõi sự thay đổi của currentNickname
watch(() => props.currentNickname, (newValue) => {
  newNickname.value = newValue
})

async function updateNickname() {
  try {
    // Gọi API để cập nhật nickname trong cơ sở dữ liệu
    await ContactService.handleUpdateContact(props.contactId, newNickname.value);
    
    // Cập nhật nickname trong selectedAccount
    accountStore.selectAccount({ ...accountStore.selectedAccount, nickname: newNickname.value });
    
    // Cập nhật nickname trong danh sách contacts
    const contact = accountStore.accounts.find(account => account.contactId === props.contactId);
    if (contact) {
      contact.nickname = newNickname.value; // Cập nhật nickname trong danh sách
    }

    console.log('Cập nhật biệt danh thành công', accountStore.selectedAccount.nickname);
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
          class="relative transform overflow-hidden rounded-2xl text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg bg-lightMode dark:bg-darkMode">

          <!-- Block modal -->
          <div class="relative px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <h3 class="text-center font-bold leading-10 text-darkMode dark:text-lightMode" id="modal-title">
              Biệt danh
            </h3>
            <input type="text" v-model="newNickname"
              class="w-full py-2 px-4 rounded-full bg-lightModeHover dark:bg-darkModeHover text-darkMode dark:text-lightMode placeholder-darkModeHover dark:placeholder-lightModeHover"
              placeholder="Nhập biệt danh mới" />
          </div>
          <div class="absolute top-4 right-4">
            <button @click="closeModal" type="button">
              <font-awesome-icon icon="xmark"
                class="p-2 rounded-xl border border-gray-600 text-darkMode hover:bg-lightModeHover dark:hover:bg-darkModeHover dark:text-lightMode" />
            </button>
          </div>
          <div class="flex justify-center pb-4">
            <button @click="updateNickname" class="bg-blue-500 text-white rounded-full px-4 py-2">
              Cập nhật
            </button>
          </div>
        </div>
        <Toast />
      </div>
    </div>
  </div>
</template>