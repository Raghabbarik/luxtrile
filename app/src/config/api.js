import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_BASE_URL = 'https://luxtril.tech/api';
const API_BASE_URL = 'http://10.245.108.173:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Handle FormData - set proper content type and increase timeout
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
      config.timeout = 60000; // 60 seconds for file uploads
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
