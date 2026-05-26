import api from '../config/api';

export const reviewService = {
  createReview: async reviewData => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  getSalonReviews: async (salonId, page = 1) => {
    const response = await api.get(`/reviews/salon/${salonId}`, {
      params: {page},
    });
    return response.data;
  },

  getMyReviews: async (page = 1) => {
    const response = await api.get('/reviews/my-reviews', {params: {page}});
    return response.data;
  },

  respondToReview: async (reviewId, responseText) => {
    const response = await api.post(`/reviews/${reviewId}/respond`, {
      responseText,
    });
    return response.data;
  },
};
