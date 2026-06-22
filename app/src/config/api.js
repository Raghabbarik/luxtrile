import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

//const API_BASE_URL = 'https://luxtril.tech/api';
const API_BASE_URL = 'http://10.59.186.173:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    try {
      // Always try to get a fresh Firebase token first
      const currentUser = auth().currentUser;
      if (currentUser) {
        // getIdToken(false) uses cached token if still valid, refreshes if expired
        const freshToken = await currentUser.getIdToken(false);
        config.headers.Authorization = `Bearer ${freshToken}`;
        // Also keep AsyncStorage in sync
        await AsyncStorage.setItem('token', freshToken);
      } else {
        // Fall back to stored token if no Firebase user is available yet
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          config.headers.Authorization = `Bearer ${storedToken}`;
        }
      }
    } catch (tokenError) {
      // Fall back to stored token on error
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
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
      // Token might be expired — try to refresh it once
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const freshToken = await currentUser.getIdToken(true); // force refresh
          await AsyncStorage.setItem('token', freshToken);

          // Retry the original request with the new token
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError.message);
      }
      // If refresh also fails, clear local auth data
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
