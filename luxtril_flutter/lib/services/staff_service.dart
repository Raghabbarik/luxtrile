import 'api_client.dart';
import '../models/staff.dart';

class StaffService {
  final ApiClient _api = ApiClient();

  Future<List<Staff>> getSalonStaff(String salonId) async {
    final response = await _api.get('/staff/salon/$salonId');
    final List<dynamic> data = response['staff'] ?? response['data'] ?? [];
    return data.map((s) => Staff.fromJson(s)).toList();
  }

  Future<Staff> createStaff(Map<String, dynamic> data) async {
    final response = await _api.post('/staff', body: data);
    return Staff.fromJson(response['staff'] ?? response);
  }

  Future<Staff> updateStaff(String id, Map<String, dynamic> data) async {
    final response = await _api.put('/staff/$id', body: data);
    return Staff.fromJson(response['staff'] ?? response);
  }

  Future<void> deleteStaff(String id) async {
    await _api.delete('/staff/$id');
  }

  Future<Staff> toggleAvailability(String id) async {
    final response = await _api.put('/staff/$id/toggle-availability');
    return Staff.fromJson(response['staff'] ?? response);
  }
}
