import api from '../config/api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', {email, password});
    return response.data;
  },

  register: async (name, email, password, phone, role) => {
    const response = await api.post('/auth/register', {
      name,
      email,
      password,
      phone,
      role,
    });
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (resetToken, password) => {
    const response = await api.put(`/auth/reset-password/${resetToken}`, {
      password,
    });
    return response.data;
  },
};
