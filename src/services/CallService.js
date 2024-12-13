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

const GetCallbyUser = async (userId) => {
  try {
    const response = await apiClient.get(`/call/calls-user/${userId}`)
    return response.data
  } catch (error) {
    console.error(
      'Error during contact retrieval:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

const createCall = async (callerId, callerName, receiverId, receiverName, callType) => {
  try {
    return await apiClient.post(`/call/call-start`, {
      callerId,
      callerName,
      receiverId,
      receiverName,
      callType
    })
  } catch (error) {
    console.error(
      'Error during registration:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

const endCall = async (callId) => {
  try {
    return await apiClient.put(`/call/call-end/${callId}`, {
      callId: callId
    })
  } catch (error) {
    console.error('Error during user update:', error.response ? error.response.data : error.message)
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

export default {
  handleCreateCallToken,
  GetCallbyUser,
  createCall,
  endCall
}
