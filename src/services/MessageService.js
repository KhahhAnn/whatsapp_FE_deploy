import apiClient from '../api/api'

const handleCreateMessage = async (senderId, receiverId, content, mediaUrl) => {
  try {
    const response = await apiClient.post('/message/create', {
      senderId,
      receiverId,
      content,
      mediaUrl
    })
    return response.data
  } catch (error) {
    console.error('Error creating message:', error)
    throw error
  }
}

const getMessageDetails = async (messageId) => {
  try {
    const response = await apiClient.get(`/message/${messageId}`)
    return response.data, console.log('Done', response.data)
  } catch (error) {
    console.error('Error fetching message details:', error)
    throw error
  }
}

const getMessagesByUser = async (userId) => {
  try {
    const response = await apiClient.get(`/message/messages-user/${userId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

const getMessagesBetweenUsers = async (senderId, receiverId) => {
  try {
    const response = await apiClient.get(`/message/messages-between/${senderId}/${receiverId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching messages:', error)
    throw error
  }
}

const handleDeleteMessage = async (messageId) => {
  try {
    return await apiClient.delete(`/message/${messageId}`, {
      messageId: messageId
    })
  } catch (error) {
    console.error(
      'Error during message deletion:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

export default {
  handleCreateMessage,
  getMessageDetails,
  getMessagesByUser,
  getMessagesBetweenUsers, // Thêm phương thức này
  handleDeleteMessage
}
