import api from '../config/api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', {params});
    return response.data;
  },

  updateUserStatus: async (userId, isActive) => {
    const response = await api.put(`/admin/users/${userId}/status`, {
      isActive,
    });
    return response.data;
  },

  getAllSalons: async (params = {}) => {
    const response = await api.get('/admin/salons', {params});
    return response.data;
  },

  approveSalon: async (salonId, isApproved) => {
    const response = await api.put(`/admin/salons/${salonId}/approve`, {
      isApproved,
    });
    return response.data;
  },

  updateSalonStatus: async (salonId, isActive) => {
    const response = await api.put(`/admin/salons/${salonId}/status`, {
      isActive,
    });
    return response.data;
  },

  getAllBookings: async (params = {}) => {
    const response = await api.get('/admin/bookings', {params});
    return response.data;
  },

  getRevenueAnalytics: async (startDate, endDate) => {
    const response = await api.get('/admin/revenue', {
      params: {startDate, endDate},
    });
    return response.data;
  },
};
