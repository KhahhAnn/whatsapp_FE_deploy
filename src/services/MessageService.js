import apiClient from '../api/api'

const handleCreateMessage = async (senderId, receiverId, content, mediaUrl) => {
  try {
    const response = await apiClient.post('/message/create', {
      senderId,
      receiverId,
      content,
      mediaUrl,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating message:', error);
    throw error;
  }
};

const getMessageDetails = async (messageId) => {
  try {
    const response = await apiClient.get(`/message/${messageId}`)
    return response.data, 
    console.log('Done', response.data)
  } catch (error) {
    console.error('Error fetching message details:', error)
    throw error
  }
}

export default {
  handleCreateMessage,
  getMessageDetails,
}
