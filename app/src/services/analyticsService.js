import api from '../config/api';

export const analyticsService = {
  getSalonEarnings: async (startDate, endDate) => {
    const response = await api.get('/analytics/earnings', {
      params: {startDate, endDate},
    });
    return response.data;
  },

  getSalonBookingStats: async () => {
    const response = await api.get('/analytics/booking-stats');
    return response.data;
  },
};
