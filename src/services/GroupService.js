import apiClient from '../api/api'

// // Tạo nhóm chat mới
const handleCreateGroup = async (groupName, createdBy) => {
   try {
      const response = await apiClient.post('/group-chat/create-group', { groupName, createdBy });
      return response.data;
   } catch (error) {
      console.error('Error during group creation:', error.response ? error.response.data : error.message);
      throw error;
   }
}

// Xóa group
const handleDeleteGroup = async (groupId) => {
   try {
      const response = await apiClient.delete(`/group-chat/delete-group/${groupId}`);
      return response.data;
   } catch (error) {
      console.error('Error during group deletion:', error.response ? error.response.data : error.message);
      throw error;
   }
}

// Lấy ra tất cả các group
const handleGetAllGroup = async () => {
   try {
      const response = await apiClient.get('/group-chat/all-group');
      return response.data;
   } catch (error) {
      console.error('Error during group retrieval:', error.response ? error.response.data : error.message);
      throw error;
   }
}

// Lấy ra các group với userId là thành viên
const handleGetGroupByUserId = async (userId) => {
   try {
      const response = await apiClient.get(`/group-chat/group-user/${userId}`);
      return response.data;
   } catch (error) {
      console.error('Error during group retrieval:', error.response ? error.response.data : error.message);
      throw error;
   }
}

// Lấy ra tin nhắn theo groupId
const handleGetGroupMessagesByGroupId = async (groupId) => {
   try {
      console.log("groupId", groupId)
      const response = await apiClient.get(`/group-chat/messages/${groupId}`);
      return response.data,
      console.log("response", response.data)
   } catch (error) {
      console.error('Error during group message retrieval:', error.response ? error.response.data : error.message);
      throw error;
   }
}

export default {
   handleCreateGroup,
   handleDeleteGroup,
   handleGetAllGroup,
   handleGetGroupByUserId,
   handleGetGroupMessagesByGroupId
}
