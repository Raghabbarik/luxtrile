import 'api_client.dart';
import '../models/salon.dart';
import '../models/user.dart';

class AdminService {
  final ApiClient _api = ApiClient();

  Future<List<Salon>> getAllSalons({String? status}) async {
    final params = <String, String>{};
    if (status != null && status != 'all') params['status'] = status;
    final response = await _api.get('/admin/salons', queryParams: params.isNotEmpty ? params : null);
    final List<dynamic> data = response['salons'] ?? response['data'] ?? [];
    return data.map((s) => Salon.fromJson(s)).toList();
  }

  Future<Salon> approveSalon(String id) async {
    final response = await _api.put('/admin/salons/$id/approve');
    return Salon.fromJson(response['salon'] ?? response);
  }

  Future<Salon> rejectSalon(String id, {String? reason}) async {
    final response = await _api.put('/admin/salons/$id/reject', body: {
      if (reason != null) 'reason': reason,
    });
    return Salon.fromJson(response['salon'] ?? response);
  }

  Future<List<User>> getAllUsers() async {
    final response = await _api.get('/admin/users');
    final List<dynamic> data = response['users'] ?? response['data'] ?? [];
    return data.map((u) => User.fromJson(u)).toList();
  }

  Future<void> deleteUser(String id) async {
    await _api.delete('/admin/users/$id');
  }
}
