class Review {
  final String id;
  final String bookingId;
  final String salonId;
  final String userId;
  final String? userName;
  final double rating;
  final String? comment;
  final String? responseText;
  final DateTime? createdAt;

  Review({
    required this.id,
    required this.bookingId,
    required this.salonId,
    required this.userId,
    this.userName,
    required this.rating,
    this.comment,
    this.responseText,
    this.createdAt,
  });

  factory Review.fromJson(Map<String, dynamic> json) {
    return Review(
      id: json['id'] ?? '',
      bookingId: json['booking_id'] ?? '',
      salonId: json['salon_id'] ?? '',
      userId: json['user_id'] ?? '',
      userName: json['user_name'],
      rating: (json['rating'] as num).toDouble(),
      comment: json['comment'],
      responseText: json['response_text'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_id': bookingId,
      'salon_id': salonId,
      'user_id': userId,
      'user_name': userName,
      'rating': rating,
      'comment': comment,
      'response_text': responseText,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
