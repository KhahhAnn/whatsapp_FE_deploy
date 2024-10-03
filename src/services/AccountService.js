import apiClient from '../api/api'

const handleRegisterUser = (username, email, password, phoneNumber) => {
  return apiClient.post(`/account/register`, {
    username: username,
    email: email,
    password: password,
    phoneNumber: phoneNumber
  })
}

const handleLoginUser = async (email, password, rememberMe) => {
  try {
    return await apiClient.post(`/account/login`, {
      email: email,
      password: password,
      rememberMe: rememberMe
    })
  } catch (error) {
    console.error('Error during login:', error.response ? error.response.data : error.message)
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

const handleUpdateUser = (userId, phoneNumber, profilePicture) => {
  return apiClient.put(`/account/update`, {
    userId: userId,
    phoneNumber: phoneNumber,
    profilePicture: profilePicture
  })
}

const handleDeleteUser = (userId) => {
  return apiClient.put(`/account/update`, {
    userId: userId
  })
}

export default {
  handleLoginUser,
  handleRegisterUser,
  handleUpdateUser,
  handleDeleteUser
}
