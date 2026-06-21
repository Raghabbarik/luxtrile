class Salon {
  final String id;
  final String name;
  final String? description;
  final String address;
  final double? latitude;
  final double? longitude;
  final String? phone;
  final String? email;
  final List<String> images;
  final List<String>? media360;
  final String? ownerId;
  final String? status;
  final bool? isApproved;
  final double? averageRating;
  final int? totalReviews;
  final int? totalBookings;
  final double? distance;
  final String? category;
  final String? openingTime;
  final String? closingTime;
  final DateTime? createdAt;

  Salon({
    required this.id,
    required this.name,
    this.description,
    required this.address,
    this.latitude,
    this.longitude,
    this.phone,
    this.email,
    this.images = const [],
    this.media360,
    this.ownerId,
    this.status,
    this.isApproved,
    this.averageRating,
    this.totalReviews,
    this.totalBookings,
    this.distance,
    this.category,
    this.openingTime,
    this.closingTime,
    this.createdAt,
  });

  factory Salon.fromJson(Map<String, dynamic> json) {
    return Salon(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      address: json['address'] ?? '',
      latitude: (json['latitude'] as num?)?.toDouble(),
      longitude: (json['longitude'] as num?)?.toDouble(),
      phone: json['phone'],
      email: json['email'],
      images: json['images'] != null ? List<String>.from(json['images']) : [],
      media360: json['media_360'] != null ? List<String>.from(json['media_360']) : null,
      ownerId: json['owner_id'],
      status: json['status'],
      isApproved: json['is_approved'],
      averageRating: (json['average_rating'] as num?)?.toDouble(),
      totalReviews: json['total_reviews'],
      totalBookings: json['total_bookings'],
      distance: (json['distance'] as num?)?.toDouble(),
      category: json['category'],
      openingTime: json['opening_time'],
      closingTime: json['closing_time'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'description': description,
      'address': address,
      'latitude': latitude,
      'longitude': longitude,
      'phone': phone,
      'email': email,
      'images': images,
      'media_360': media360,
      'owner_id': ownerId,
      'status': status,
      'is_approved': isApproved,
      'average_rating': averageRating,
      'total_reviews': totalReviews,
      'total_bookings': totalBookings,
      'distance': distance,
      'category': category,
      'opening_time': openingTime,
      'closing_time': closingTime,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
