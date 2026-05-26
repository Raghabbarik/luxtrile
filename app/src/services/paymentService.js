import api from '../config/api';

export const paymentService = {
  createOrder: async bookingId => {
    const response = await api.post('/payments/create-order', {bookingId});
    return response.data;
  },

  verifyPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    const response = await api.post('/payments/verify', {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });
    return response.data;
  },

  handlePaymentFailure: async (razorpayOrderId, error) => {
    const response = await api.post('/payments/failure', {
      razorpayOrderId,
      error,
    });
    return response.data;
  },

  getPaymentHistory: async (page = 1) => {
    const response = await api.get('/payments/history', {params: {page}});
    return response.data;
  },
};
