import apiClient from '../api/api';

const handleRegisterUser = (username, email, password, phoneNumber) => {
  return apiClient.post(`/api/account/register`, {
    username: username,
    email: email,
    password: password,
    phoneNumber: phoneNumber
  })
}

const handleLoginUser = (email, password, rememberMe) => {
	return apiClient.post(`/api/account/login`, {
		email: email,
		password: password,
    rememberMe: rememberMe
	});
};

const handleUpdateUser = (userId, phoneNumber, profilePicture) => {
	return apiClient.put(`/api/account/update`, {
		userId: userId,
    phoneNumber: phoneNumber,
    profilePicture: profilePicture
	});
};

const handleDeleteUser = (userId) => {
	return apiClient.put(`/api/account/update`, {
		userId: userId,
	});
};



export default{
  handleLoginUser,
  handleRegisterUser,
  handleUpdateUser,
  handleDeleteUser
}