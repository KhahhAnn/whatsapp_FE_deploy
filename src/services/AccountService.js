import apiClient from '../api/api'

const handleRegisterUser = async (username, email, password, phoneNumber) => {
  try {
    return await apiClient.post(`/account/register`, {
      username: username,
      email: email,
      password: password,
      phoneNumber: phoneNumber
    })
  } catch (error) {
    console.error(
      'Error during registration:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
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

const handleUpdateUser = async (userId, phoneNumber, profilePicture) => {
  try {
    return await apiClient.put(`/account/update`, {
      userId: userId,
      phoneNumber: phoneNumber,
      profilePicture: profilePicture
    })
  } catch (error) {
    console.error('Error during user update:', error.response ? error.response.data : error.message)
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

const handleDeleteUser = async (userId) => {
  try {
    return await apiClient.put(`/account/delete`, {
      userId: userId
    })
  } catch (error) {
    console.error(
      'Error during user deletion:',
      error.response ? error.response.data : error.message
    )
    throw error // Ném lại lỗi để xử lý ở nơi gọi
  }
}

export default {
  handleLoginUser,
  handleRegisterUser,
  handleUpdateUser,
  handleDeleteUser
}
