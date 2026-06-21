import 'api_client.dart';
import '../models/payment.dart';

class PaymentService {
  final ApiClient _api = ApiClient();

  Future<Map<String, dynamic>> createOrder({
    required String bookingId,
    required double amount,
  }) async {
    final response = await _api.post('/payments/create-order', body: {
      'booking_id': bookingId,
      'amount': amount,
    });
    return response;
  }

  Future<Payment> verifyPayment({
    required String bookingId,
    required String razorpayOrderId,
    required String razorpayPaymentId,
    required String razorpaySignature,
  }) async {
    final response = await _api.post('/payments/verify', body: {
      'booking_id': bookingId,
      'razorpay_order_id': razorpayOrderId,
      'razorpay_payment_id': razorpayPaymentId,
      'razorpay_signature': razorpaySignature,
    });
    return Payment.fromJson(response['payment'] ?? response);
  }

  Future<void> paymentFailed({
    required String bookingId,
    required String razorpayOrderId,
  }) async {
    await _api.post('/payments/failed', body: {
      'booking_id': bookingId,
      'razorpay_order_id': razorpayOrderId,
    });
  }

  Future<List<Payment>> getPaymentHistory() async {
    final response = await _api.get('/payments/history');
    final List<dynamic> data = response['payments'] ?? response['data'] ?? [];
    return data.map((p) => Payment.fromJson(p)).toList();
  }
}
