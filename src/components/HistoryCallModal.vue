<script setup>
import { defineProps, defineEmits, ref } from 'vue'

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
    { initials: 'AT', name: 'A Thắng', lastSeen: 'last seen 1 hour ago', bgColor: 'bg-orange-500' },
    { initials: 'AT', name: 'A Thắng', lastSeen: 'last seen 1 hour ago', bgColor: 'bg-orange-500' },
    { initials: 'AD', name: 'Anh Duy Cnpm1', lastSeen: 'last seen 7 hours ago', bgColor: 'bg-blue-500' },
    { initials: 'BC', name: 'Bách Cnpm1', lastSeen: 'last seen 7 hours ago', bgColor: 'bg-blue-500' },
    { initials: 'H', name: 'Huy', lastSeen: 'last seen 10/12/2024', bgColor: 'bg-pink-500' },
    { initials: 'CV', name: 'Cô Giang VL', lastSeen: 'last seen 7/27/2024', bgColor: 'bg-blue-500' },
    { initials: 'AT', name: 'A thắng', lastSeen: 'last seen 6/7/2024', bgColor: 'bg-orange-500' },
    { initials: 'TC', name: 'Thảo Cnpm1', lastSeen: 'last seen 4/27/2024', bgColor: 'bg-blue-500' },
    { initials: 'DV', name: 'Duẩn Vinh', lastSeen: 'last seen 3/12/2024', bgColor: 'bg-blue-500' },
]);

const emit = defineEmits(['update:isOpen'])

function closeModal() {
    emit('update:isOpen', false)
}
</script>

<!-- nickname , datetime , call type , call duration , call status(missed, accept, reject) , phone number -->

<template>
    <div v-if="isOpen" class="relative z-10 text-darkMode dark:text-lightMode" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-opacity-75 transition-opacity bg-gray-900" aria-hidden="true"></div>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div
                    class="relative transform overflow-hidden rounded-2xl shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm bg-lightMode dark:bg-darkMode">
                    <div class="bg-lightMode dark:bg-darkMode w-full rounded-lg shadow-lg">
                        <div
                            class="flex justify-between items-center p-4 border-b border-darkMode dark:border-lightMode">
                            <h2 class="text-lg font-semibold">History Call</h2>
                            <i class="fas fa-bars"></i>
                        </div>
                        <div class="p-4 ">
                            <input type="text" placeholder="Search"
                                class="w-full p-2 border border-darkMode dark:border-lightMode rounded-lg bg-lightMode dark:bg-darkMode">
                        </div>
                        <div class="px-4 overflow-y-auto max-h-96 border-b border-darkMode dark:border-lightMode">
                            <div v-for="contact in contacts" :key="contact.name" @click="dropDown"
                                class="flex items-center justify-between mb-4">
                                <div class="flex items-center">
                                    <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                                        :class="contact.bgColor">
                                        <span class="font-semibold">{{ contact.initials }}</span>
                                    </div>
                                    <div class="flex flex-col justify-center items-start ml-4">
                                        <div class="text-sm font-semibold">{{ contact.name }}</div>
                                        <div class="text-xs">call status</div>
                                    </div>
                                </div>
                                <font-awesome-icon icon="chevron-down" />
                            </div>
                        </div>
                        <div class="flex justify-end p-4 border-t border-darkMode dark:border-lightMode">
                            <button @click="closeModal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
