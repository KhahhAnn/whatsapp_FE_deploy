import apiClient from '../api/api'

const handleCreateCallToken = async (userId, callId) => {
  try {
    return await apiClient.post(`/call/token`, {
      userId,
      callId
    })
  } catch (error) {
    console.error(
      'Error during create call token:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

export default {
  handleCreateCallToken
}
