import api from '../config/api';

export const serviceService = {
  getSalonServices: async salonId => {
    const response = await api.get(`/services/salon/${salonId}`);
    return response.data;
  },

  getMyServices: async () => {
    const response = await api.get('/services/my-services');
    return response.data;
  },

  createService: async serviceData => {
    const response = await api.post('/services', serviceData);
    return response.data;
  },

  updateService: async (serviceId, serviceData) => {
    const response = await api.put(`/services/${serviceId}`, serviceData);
    return response.data;
  },

  deleteService: async serviceId => {
    const response = await api.delete(`/services/${serviceId}`);
    return response.data;
  },
};
