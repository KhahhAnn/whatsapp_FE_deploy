import { defineStore } from 'pinia'
import { ref } from 'vue'
import GroupService from '../services/GroupService'


export const useGroupStore = defineStore('groups', () => {
   const groups = ref([])
   const selectedGroup = ref(null)
   const groupMessages = ref([])
   
   function selectGroup(group) {
      selectedGroup.value = group
   }

   //Lấy ra các group với userId là thành viên
   const getGroupByUserId = async (userId) => {
      try {
         const groupsData = await GroupService.handleGetGroupByUserId(userId)
         groups.value = groupsData
      } catch (error) {
         console.error('Failed to fetch groups:', error)
      }
   }

   //Lấy ra tin nhắn theo groupId
   const getGroupMessagesByGroupId = async (groupId) => {
      try {
         const groupMessagesData = await GroupService.handleGetGroupMessagesByGroupId(groupId)
         groupMessages.value = groupMessagesData
         console.log("groupMessages", groupMessages.value)
      } catch (error) {
         console.error('Failed to fetch group messages:', error)
      }
   }

   //Tạo group
   const createGroup = async (groupName, createdBy) => {
      try {
         const response = await GroupService.handleCreateGroup(groupName, createdBy)
         
         console.log("response", response)
      } catch (error) {
         console.error('Failed to create group:', error)
      }
   }

   //Xóa group
   const deleteGroup = async (groupId) => {
      try {
         const response = await GroupService.handleDeleteGroup(groupId)
         console.log("response", response)
      } catch (error) {
         console.error('Failed to delete group:', error)
      }
   }

   return {
      groups,
      selectedGroup,
      groupMessages,
      selectGroup,
      getGroupByUserId,
      getGroupMessagesByGroupId,
      createGroup,
      deleteGroup
   }
})