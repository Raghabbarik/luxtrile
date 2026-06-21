import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../config/api_config.dart';

class ApiClient {
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();

  String? _token;
  final Map<String, String> _defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  Future<void> setToken(String token) async {
    _token = token;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('auth_token', token);
  }

  Future<void> clearToken() async {
    _token = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('auth_token');
  }

  Future<String?> getToken() async {
    if (_token != null) return _token;
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString('auth_token');
    return _token;
  }

  Map<String, String> get _authHeaders {
    final headers = Map<String, String>.from(_defaultHeaders);
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<Map<String, dynamic>> get(String endpoint, {Map<String, String>? queryParams}) async {
    await getToken();
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint').replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _authHeaders).timeout(ApiConfig.timeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> post(String endpoint, {Map<String, dynamic>? body}) async {
    await getToken();
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final response = await http
        .post(uri, headers: _authHeaders, body: body != null ? jsonEncode(body) : null)
        .timeout(ApiConfig.timeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> put(String endpoint, {Map<String, dynamic>? body}) async {
    await getToken();
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final response = await http
        .put(uri, headers: _authHeaders, body: body != null ? jsonEncode(body) : null)
        .timeout(ApiConfig.timeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> delete(String endpoint) async {
    await getToken();
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final response = await http.delete(uri, headers: _authHeaders).timeout(ApiConfig.timeout);
    return _handleResponse(response);
  }

  Future<Map<String, dynamic>> uploadFile(
    String endpoint, {
    required File file,
    String fieldName = 'image',
    Map<String, String>? fields,
  }) async {
    await getToken();
    final uri = Uri.parse('${ApiConfig.baseUrl}$endpoint');
    final request = http.MultipartRequest('POST', uri);

    if (_token != null) {
      request.headers['Authorization'] = 'Bearer $_token';
    }

    request.files.add(await http.MultipartFile.fromPath(fieldName, file.path));
    if (fields != null) {
      request.fields.addAll(fields);
    }

    final streamedResponse = await request.send().timeout(ApiConfig.uploadTimeout);
    final response = await http.Response.fromStream(streamedResponse);
    return _handleResponse(response);
  }

  Map<String, dynamic> _handleResponse(http.Response response) {
    final body = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode >= 200 && response.statusCode < 300) {
      return body;
    } else if (response.statusCode == 401) {
      clearToken();
      throw ApiException('Session expired. Please login again.', response.statusCode);
    } else {
      final message = body['message'] ?? 'Something went wrong';
      throw ApiException(message.toString(), response.statusCode);
    }
  }
}

class ApiException implements Exception {
  final String message;
  final int statusCode;

  ApiException(this.message, this.statusCode);

  @override
  String toString() => message;
}
