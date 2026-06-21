import 'api_client.dart';
import '../models/user.dart';

class AuthService {
  final ApiClient _api = ApiClient();

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _api.post('/auth/login', body: {
      'email': email,
      'password': password,
    });
    if (response['token'] != null) {
      await _api.setToken(response['token']);
    }
    return response;
  }

  Future<Map<String, dynamic>> register({
    required String name,
    required String email,
    required String phone,
    required String password,
    String role = 'customer',
  }) async {
    final response = await _api.post('/auth/register', body: {
      'name': name,
      'email': email,
      'phone': phone,
      'password': password,
      'role': role,
    });
    if (response['token'] != null) {
      await _api.setToken(response['token']);
    }
    return response;
  }

  Future<User> getProfile() async {
    final response = await _api.get('/auth/profile');
    return User.fromJson(response['user'] ?? response);
  }

  Future<User> updateProfile(Map<String, dynamic> data) async {
    final response = await _api.put('/auth/profile', body: data);
    return User.fromJson(response['user'] ?? response);
  }

  Future<void> changePassword(String currentPassword, String newPassword) async {
    await _api.put('/auth/change-password', body: {
      'current_password': currentPassword,
      'new_password': newPassword,
    });
  }

  Future<void> forgotPassword(String email) async {
    await _api.post('/auth/forgot-password', body: {'email': email});
  }

  Future<void> resetPassword(String token, String password) async {
    await _api.post('/auth/reset-password', body: {
      'token': token,
      'password': password,
    });
  }

  Future<void> logout() async {
    try {
      await _api.post('/auth/logout');
    } catch (_) {}
    await _api.clearToken();
  }

  Future<bool> isLoggedIn() async {
    final token = await _api.getToken();
    return token != null && token.isNotEmpty;
  }
}
