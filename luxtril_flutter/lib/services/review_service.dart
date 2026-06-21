import 'api_client.dart';
import '../models/review.dart';

class ReviewService {
  final ApiClient _api = ApiClient();

  Future<Review> createReview(Map<String, dynamic> data) async {
    final response = await _api.post('/reviews', body: data);
    return Review.fromJson(response['review'] ?? response);
  }

  Future<List<Review>> getSalonReviews(String salonId) async {
    final response = await _api.get('/reviews/salon/$salonId');
    final List<dynamic> data = response['reviews'] ?? response['data'] ?? [];
    return data.map((r) => Review.fromJson(r)).toList();
  }

  Future<Review> respondToReview(String id, String responseText) async {
    final result = await _api.put('/reviews/$id/respond', body: {
      'response_text': responseText,
    });
    return Review.fromJson(result['review'] ?? result);
  }
}
