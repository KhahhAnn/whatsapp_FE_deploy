<script setup>
import { defineProps, defineEmits, ref, computed } from 'vue'
// import { useStore } from 'pinia'

// const store = useStore()
// const contacts = ref([]) // Khởi tạo contacts là một mảng rỗng

// // Hàm để lấy dữ liệu từ store hoặc API
// async function fetchContacts() {
//     // Giả sử bạn có một action trong store để lấy lịch sử cuộc gọi
//     contacts.value = await store.dispatch('fetchCallHistory')
// }

// // Gọi hàm fetchContacts khi component được khởi tạo
// onMounted(() => {
//     fetchContacts()
// })

defineProps({
  isOpen: Boolean,
  title: {
    type: String,
    required: true
  },
  placeholder: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  }
})

const contacts = ref([
  {
    initials: 'AT',
    name: 'A Thắng',
    lastSeen: 'last seen 1 hour ago',
    bgColor: 'bg-orange-500',
    phoneNumber: '0909090909',
    callType: 'video call',
    callDuration: '5 mins',
    callStatus: 'missed',
    datetime: '10/12/2024'
  },
  {
    initials: 'AD',
    name: 'Anh Duy Cnpm1',
    lastSeen: 'last seen 7 hours ago',
    bgColor: 'bg-blue-500',
    phoneNumber: '0909090909',
    callType: 'audio call',
    callDuration: '10 mins',
    callStatus: 'accepted',
    datetime: '10/12/2024'
  },
  {
    initials: 'BC',
    name: 'Bách Cnpm1',
    lastSeen: 'last seen 7 hours ago',
    bgColor: 'bg-blue-500',
    phoneNumber: '0909090909',
    callType: 'rejected',
    callDuration: '2 mins',
    callStatus: 'rejected',
    datetime: '10/12/2024'
  },
  {
    initials: 'H',
    name: 'Huy',
    lastSeen: 'last seen 10/12/2024',
    bgColor: 'bg-pink-500',
    phoneNumber: '0909090909',
    callType: 'missed',
    callDuration: '3 mins',
    callStatus: 'missed',
    datetime: '10/12/2024'
  },
  {
    initials: 'CV',
    name: 'Cô Giang VL',
    lastSeen: 'last seen 7/27/2024',
    bgColor: 'bg-blue-500',
    phoneNumber: '0909090909',
    callType: 'accepted',
    callDuration: '15 mins',
    callStatus: 'accepted',
    datetime: '10/12/2024'
  },
  {
    initials: 'AT',
    name: 'A thắng',
    lastSeen: 'last seen 6/7/2024',
    bgColor: 'bg-orange-500',
    phoneNumber: '0909090909',
    callType: 'rejected',
    callDuration: '4 mins',
    callStatus: 'rejected',
    datetime: '10/12/2024'
  },
  {
    initials: 'TC',
    name: 'Thảo Cnpm1',
    lastSeen: 'last seen 4/27/2024',
    bgColor: 'bg-blue-500',
    phoneNumber: '0909090909',
    callType: 'accepted',
    callDuration: '8 mins',
    callStatus: 'accepted',
    datetime: '10/12/2024'
  },
  {
    initials: 'DV',
    name: 'Duẩn Vinh',
    lastSeen: 'last seen 3/12/2024',
    bgColor: 'bg-blue-500',
    phoneNumber: '0909090909',
    callType: 'missed',
    callDuration: '6 mins',
    callStatus: 'missed',
    datetime: '10/12/2024'
  }
])

const emit = defineEmits(['update:isOpen'])

function closeModal() {
  emit('update:isOpen', false)
}

const selectedContact = ref(null)

function toggleDropdown(contact) {
  selectedContact.value = selectedContact.value === contact ? null : contact
}

const searchQuery = ref('') // Thêm biến tìm kiếm

// Lọc danh sách contacts dựa trên searchQuery
const filteredContacts = computed(() => {
  return contacts.value.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>

<template>
  <div v-if="isOpen" class="relative z-10 text-darkMode dark:text-lightMode" aria-labelledby="modal-title" role="dialog"
    aria-modal="true">
    <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          class="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode">
          <div class="bg-lightMode dark:bg-darkMode w-full rounded-lg shadow-lg">
            <div class="flex justify-center items-center p-4 border-b border-darkMode dark:border-lightMode">
              <h2 class="text-lg font-semibold">Lịch sử cuộc gọi</h2>
            </div>
            <div class="p-4">
              <input type="text" placeholder="Tìm kiếm" v-model="searchQuery"
                class="w-full p-2 border border-darkMode dark:border-lightMode rounded-lg bg-lightMode dark:bg-darkMode" />
            </div>
            <div class="overflow-y-auto h-96 border-b border-darkMode dark:border-lightMode">
              <div v-for="contact in filteredContacts" :key="contact.name" @click="toggleDropdown(contact)"
                class="py-2 px-4 cursor-pointer hover:bg-lightModeHover dark:hover:bg-darkModeHover">
                <div class="flex items-center justify-between">
                  <div class="flex item-center">
                    <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                      :class="contact.bgColor">
                      <span class="font-semibold">{{ contact.initials }}</span>
                    </div>
                    <div class="flex flex-col justify-center items-start ml-4">
                      <div class="text-sm font-semibold">{{ contact.name }}</div>
                      <div class="text-xs">Trạng thái</div>
                    </div>
                  </div>
                  <font-awesome-icon v-if="selectedContact === contact" icon="chevron-down" />
                  <font-awesome-icon v-else icon="chevron-right" />
                </div>

                <div v-if="selectedContact === contact"
                  class="flex flex-col items-start w-full mt-2 p-2 border border-gray-300 rounded-lg bg-lightMode dark:bg-darkMode">
                  <div class="text-sm">Số điện thoại: {{ contact.phoneNumber }}</div>
                  <div class="text-sm">Ngày, giờ: {{ contact.datetime }}</div>
                  <div class="text-sm">Loại cuộc gọi: {{ contact.callType }}</div>
                  <div class="text-sm">Thời gian: {{ contact.callDuration }}</div>
                  <div class="text-sm">Trạng thái: {{ contact.callStatus }}</div>
                </div>
              </div>
            </div>
            <div class="flex justify-end p-4 border-t border-darkMode dark:border-lightMode">
              <button @click="closeModal">Đóng</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
