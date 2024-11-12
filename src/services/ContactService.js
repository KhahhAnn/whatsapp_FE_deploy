import apiClient from '../api/api'

const handleCreateContact = async (userId, contactUserId, nickname, status) => {
  try {
    console.log("Creating contact with data:", { userId, contactUserId, nickname, status });
    return await apiClient.post('/contact', {
      userId,
      contactUserId,
      nickname,
      status
    });
  } catch (error) {
    console.error('Error during adding contact:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create contact: ' + (error.response ? error.response.data.message : error.message));
  }
};

const handleGetContactByUser = async (userId) => {
  try {
    const response = await apiClient.get(`/contact/contacts-user/${userId}`)
    return response.data
  } catch (error) {
    console.error(
      'Error during contact retrieval:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

const handleUpdateContact = async (contactId, nickname) => {
  try {
    return await apiClient.put(`/contact/${contactId}`, {
      contactId: contactId,
      nickname: nickname
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
    return await apiClient.delete(`/contact/${contactId}`, {
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
