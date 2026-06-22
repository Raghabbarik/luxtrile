import api from '../config/api';

export const authService = {
  // Get current user profile from backend
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update password via backend (uses Firebase Admin)
  updatePassword: async (newPassword) => {
    const response = await api.put('/auth/update-password', {
      newPassword,
    });
    return response.data;
  },
};
