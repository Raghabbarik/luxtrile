import 'api_client.dart';
import '../models/booking.dart';

class BookingService {
  final ApiClient _api = ApiClient();

  Future<Booking> createBooking(Map<String, dynamic> data) async {
    final response = await _api.post('/bookings', body: data);
    return Booking.fromJson(response['booking'] ?? response);
  }

  Future<List<Booking>> getMyBookings({String? status}) async {
    final params = <String, String>{};
    if (status != null && status != 'all') params['status'] = status;
    final response = await _api.get('/bookings/my', queryParams: params.isNotEmpty ? params : null);
    final List<dynamic> data = response['bookings'] ?? response['data'] ?? [];
    return data.map((b) => Booking.fromJson(b)).toList();
  }

  Future<Booking> getBookingById(String id) async {
    final response = await _api.get('/bookings/$id');
    return Booking.fromJson(response['booking'] ?? response);
  }

  Future<Booking> cancelBooking(String id) async {
    final response = await _api.put('/bookings/$id/cancel');
    return Booking.fromJson(response['booking'] ?? response);
  }

  Future<List<Booking>> getSalonBookings(String salonId, {String? status}) async {
    final params = <String, String>{};
    if (status != null && status != 'all') params['status'] = status;
    final response = await _api.get('/bookings/salon/$salonId', queryParams: params.isNotEmpty ? params : null);
    final List<dynamic> data = response['bookings'] ?? response['data'] ?? [];
    return data.map((b) => Booking.fromJson(b)).toList();
  }

  Future<Booking> updateBookingStatus(String id, String status) async {
    final response = await _api.put('/bookings/$id/status', body: {'status': status});
    return Booking.fromJson(response['booking'] ?? response);
  }
}
