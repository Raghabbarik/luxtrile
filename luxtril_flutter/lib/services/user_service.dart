import 'api_client.dart';
import '../models/user.dart';

class UserService {
  final ApiClient _api = ApiClient();

  Future<List<User>> getAllUsers() async {
    final response = await _api.get('/users');
    final List<dynamic> data = response['users'] ?? response['data'] ?? [];
    return data.map((u) => User.fromJson(u)).toList();
  }

  Future<User> getUserById(String id) async {
    final response = await _api.get('/users/$id');
    return User.fromJson(response['user'] ?? response);
  }

  Future<void> updateUserStatus(String id, bool isApproved) async {
    await _api.put('/users/$id/status', body: {'is_approved': isApproved});
  }
}
