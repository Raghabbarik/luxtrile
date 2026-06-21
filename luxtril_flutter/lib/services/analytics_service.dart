import 'api_client.dart';
import '../models/analytics.dart';
import '../models/salon.dart';
import '../models/booking.dart';

class AnalyticsService {
  final ApiClient _api = ApiClient();

  Future<AnalyticsData> getAdminAnalytics() async {
    final response = await _api.get('/admin/analytics');
    return AnalyticsData.fromJson(response);
  }

  Future<AnalyticsData> getOwnerAnalytics(String salonId) async {
    final response = await _api.get('/analytics/salon/$salonId');
    return AnalyticsData.fromJson(response);
  }

  Future<List<Salon>> getSalonPerformance() async {
    final response = await _api.get('/admin/salons/performance');
    final List<dynamic> data = response['salons'] ?? response['data'] ?? [];
    return data.map((s) => Salon.fromJson(s)).toList();
  }

  Future<List<Booking>> getTodayAppointments(String salonId) async {
    final response = await _api.get('/bookings/salon/$salonId/today');
    final List<dynamic> data = response['bookings'] ?? response['data'] ?? [];
    return data.map((b) => Booking.fromJson(b)).toList();
  }
}
