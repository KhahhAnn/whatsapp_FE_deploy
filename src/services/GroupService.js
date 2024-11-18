import apiClient from '../api/api'

// // Tạo nhóm chat mới
// const handleCreateGroup = async (groupName, createdBy) => {
//    const response = await apiClient.post('/api/group-chat/create-group', { groupName, createdBy });
//    return response.data;
// }

// // Tạo tin nhắn cho nhóm
// const handleCreateGroupChat = async (groupId, message, senderId) => {
//    const response = await apiClient.post('/api/group-chat', { groupId, message, senderId });
//    return response.data;
// }

// // Xóa tin nhắn của nhóm
// const handleDeleteGroupChat = async (groupChatId) => {
//    const response = await apiClient.delete(`/api/group-chat/${groupChatId}`);
//    return response.data;
// }
// // Lấy danh sách tin nhắn của nhóm
// const handleGetGroupChatsByGroupId = async (groupId) => {
//    try {
//       const response = await apiClient.get(`/api/group-chat/${groupId}`);
//       return response.data;
//    } catch (error) {
//       console.error('Error during group chat retrieval:', error.response ? error.response.data : error.message);
//       throw error;
//    }
// }

// // Cập nhật trạng thái tin nhắn của nhóm
// const handleUpdateGroupChatStatus = async (groupId, status) => {
//    const response = await apiClient.put(`/api/group-chat/${groupId}`, { status });
//    return response.data;
// }

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
   // handleCreateGroup,
   // handleCreateGroupChat,
   // handleDeleteGroupChat,
   // handleGetGroupChatsByGroupId,
   // handleUpdateGroupChatStatus,
   handleGetAllGroup,
   handleGetGroupByUserId,
   handleGetGroupMessagesByGroupId
}
