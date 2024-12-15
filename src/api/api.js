import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  // baseURL: 'https://whatsapp-server-7wow.onrender.com/api',
  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Lấy token từ localStorage
const getToken = () => {
  return localStorage.getItem('accessToken'); // Hoặc sessionStorage
};

// Thêm interceptor để tự động thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;