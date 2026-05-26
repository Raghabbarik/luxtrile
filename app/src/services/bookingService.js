import api from '../config/api';

export const bookingService = {
  createBooking: async bookingData => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async (status, page = 1) => {
    const response = await api.get('/bookings/my-bookings', {
      params: {status, page},
    });
    return response.data;
  },

  getSalonBookings: async (status, date, page = 1) => {
    const response = await api.get('/bookings/salon-bookings', {
      params: {status, date, page},
    });
    return response.data;
  },

  getBookingById: async bookingId => {
    const response = await api.get(`/bookings/${bookingId}`);
    return response.data;
  },

  updateBookingStatus: async (bookingId, status) => {
    const response = await api.put(`/bookings/${bookingId}/status`, {status});
    return response.data;
  },

  cancelBooking: async (bookingId, cancellationReason) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`, {
      cancellationReason,
    });
    return response.data;
  },

  getAvailableTimeSlots: async (salonId, date, serviceIds) => {
    const response = await api.get('/timeslots/available', {
      params: {salonId, date, serviceIds: serviceIds.join(',')},
    });
    return response.data;
  },

  getSalonAvailableSlots: async (salonId, date) => {
    const response = await api.get(`/salons/${salonId}/available-slots`, {
      params: {date},
    });
    return response.data;
  },
};
