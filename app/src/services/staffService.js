import api from '../config/api';

export const staffService = {
  createStaff: async (formData) => {
    const response = await api.post('/staff', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getMyStaff: async () => {
    const response = await api.get('/staff/my-staff');
    return response.data;
  },

  getSalonStaff: async (salonId) => {
    const response = await api.get(`/staff/salon/${salonId}`);
    return response.data;
  },

  updateStaff: async (staffId, formData) => {
    const response = await api.put(`/staff/${staffId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteStaff: async (staffId) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },
};
