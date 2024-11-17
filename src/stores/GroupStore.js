import { defineStore } from 'pinia'
import GroupService from '../services/GroupService'
import { ref, onMounted } from 'vue'

export const useGroupStore = defineStore('groups', () => {
   const groups = ref([])

   // Lấy tất cả các group
   const getAllGroups = async () => {
      const groupsData = await GroupService.handleGetAllGroup()
      groups.value = groupsData
   }
   onMounted(getAllGroups)

   return {
      groups,
      getAllGroups
   }
})