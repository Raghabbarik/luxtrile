import api from '../config/api';

export const salonService = {
  getAllSalons: async (params = {}) => {
    const response = await api.get('/salons', {params});
    return response.data;
  },

  getSalonById: async salonId => {
    const response = await api.get(`/salons/${salonId}`);
    return response.data;
  },

  getMySalon: async () => {
    const response = await api.get('/salons/my-salon');
    return response.data;
  },

  createSalon: async salonData => {
    const response = await api.post('/salons', salonData);
    return response.data;
  },

  updateSalon: async salonData => {
    const response = await api.put('/salons/my-salon', salonData);
    return response.data;
  },

  updateSlotConfig: async slotConfig => {
    const response = await api.put('/salons/slot-config', slotConfig);
    return response.data;
  },

  getAvailableSlots: async (salonId, date) => {
    const response = await api.get(`/salons/${salonId}/available-slots`, {
      params: {date},
    });
    return response.data;
  },

  getNearbySalons: async (latitude, longitude, radius = 10000) => {
    const response = await api.get('/nearby/nearby', {
      params: {latitude, longitude, radius},
    });
    return response.data;
  },

  searchSalons: async (query, city, latitude, longitude) => {
    const response = await api.get('/nearby/search', {
      params: {query, city, latitude, longitude},
    });
    return response.data;
  },
};
