import apiClient from '../api/api'

const handleCreateContact = async (userId, contactUserId, nickname, status) => {
  try {
    return await apiClient.post(``, {
      userId: userId,
      contactUserId: contactUserId,
      nickname: nickname,
      status: status
    })
  } catch (error) {
    console.error(
      'Error during contact creation:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

const handleGetContactByUser = async (userId) => {
  try {
    const response = await apiClient.get(`/contact/contacts-user/${userId}`)
    console.log('Dữ liệu người dùng nhận được:', response.data) // Log dữ liệu nhận được
    return response.data
  } catch (error) {
    console.error(
      'Error during contact retrieval:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

const handleUpdateContact = async (contactId) => {
  try {
    return await apiClient.put(`${contactId}`, {
      contactId: contactId
    })
  } catch (error) {
    console.error(
      'Error during contact update:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

const handleDeleteContact = async (contactId) => {
  try {
    return await apiClient.delete(`:contactId`, {
      contactId: contactId
    })
  } catch (error) {
    console.error(
      'Error during contact deletion:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

export default {
  handleCreateContact,
  handleUpdateContact,
  handleGetContactByUser,
  handleDeleteContact
}
