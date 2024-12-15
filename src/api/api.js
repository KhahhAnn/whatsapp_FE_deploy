import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'whatsapp-server-lemon.vercel.app/api', // Địa chỉ backend của bạn
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