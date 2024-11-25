import apiClient from '../api/api'

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

const handleGetPendingContacts = async (contactUserId) => {
  try {
    const response = await apiClient.get(`/contact/pending-contacts/${contactUserId}`)
    return response.data
  } catch (error) {
    console.error(
      'Error during pending contact retrieval:',
      error.response ? error.response.data : error.message
    )
    throw error
  }
}

const handleCreateContact = async (userId, contactUserId, nickname, senderNickname, avatar, senderAvatar, status) => {
  try {
    return await apiClient.post('/contact', {
      userId,
      contactUserId,
      nickname,
      senderNickname,
      avatar,
      senderAvatar,
      status
    });
  } catch (error) {
    console.error('Error during adding contact:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create contact: ' + (error.response ? error.response.data.message : error.message));
  }
};

const handleAcceptContactRequest = async (userId, contactUserId, senderNickname, senderAvatar, status) => {
  try {
    return await apiClient.post('/contact/accept', {
      userId,
      contactUserId,
      senderNickname,
      senderAvatar,
      status
    });
  } catch (error) {
    console.error('Error accepting contact request:', error);
    throw error;
  }
};

const handleRejectContactRequest = async (userId, contactUserId) => {
  try {
    return await apiClient.post('/contact/reject', {
      userId,
      contactUserId,
    });
  } catch (error) {
    console.error('Error rejecting contact request:', error);
    throw error;
  }
};

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
  handleDeleteContact,
  handleAcceptContactRequest,
  handleGetPendingContacts,
  handleRejectContactRequest
}
