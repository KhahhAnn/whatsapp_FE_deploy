import apiClient from '../api/api'

const handleCreateMessage = (senderId, receiverId, content, mediaUrl) => {
  try {
    return apiClient.post(`/create`, {
      senderId: senderId,
      receiverId: receiverId,
      content: content,
      mediaUrl: mediaUrl
    })
  } catch (error) {
    console.error(error)
  }
}

// const handleGetMessageDetails = (messageId) => {
//   try {
//     return apiClient.get(`/message/${messageId}`, {
//       messageId: messageId
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

const getMessageDetails = async (messageId) => {
  try {
    const response = await apiClient.get(`/message/${messageId}`)
    console.log('Dữ liệu nhận được:', response.data); // Thêm log ở đây
    return response.data, 
    console.log('Done', response.data)
  } catch (error) {
    console.error('Error fetching message details:', error)
    throw error
  }
}

// const handleGetMessageByUser = (userId) => {
//   try {
//     return apiClient.get(`/messages-user/${userId}`, {
//       userId: userId
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

export default {
  handleCreateMessage,
  getMessageDetails,
  // handleGetMessageByUser
}
