<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

defineProps({
    isOpen: Boolean
});
const emit = defineEmits(['select']);
const emojis = ref([]);
const searchQuery = ref('');

onMounted(async () => {
    try {
        const response = await axios.get('https://emoji-api.com/emojis?access_key=2cfb5f0918acba1946fc078bfa87f5d23065f3d9');
        emojis.value = response.data;
    } catch (error) {
        console.error('Failed to load emojis:', error);
    }
});

const filteredEmojis = computed(() => {
    return emojis.value.filter(emoji =>
        emoji.character.includes(searchQuery.value) ||
        emoji.unicodeName.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function selectEmoji(emoji) {
    emit('select', emoji.character);
}
</script>

<template>
    <div v-show="isOpen"
        class="fixed bottom-20 left-80 w-96 h-96 bg-lightMode border border-gray-300 rounded-lg shadow-lg overflow-auto transition-opacity duration-300 ease-in-out opacity-100 pointer-events-auto">
        <div class="p-4">
            <input type="text" v-model="searchQuery" placeholder="Search emojis..."
                class="w-full p-2 border border-gray-300 rounded-md mb-2" />
            <div class="flex flex-wrap">
                <div v-for="emoji in filteredEmojis" :key="emoji.slug" @click="selectEmoji(emoji)"
                    class="h-9 w-9 rounded-md text-2xl p-1 cursor-pointer hover:bg-gray-200 transition duration-300 ease-in-out">
                    {{ emoji.character }}
                </div>
            </div>
        </div>
    </div>
</template>