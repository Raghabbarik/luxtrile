class SalonService {
  final String id;
  final String salonId;
  final String name;
  final String? description;
  final double price;
  final int duration;
  final String? category;
  final String? gender;
  final bool? isAvailable;

  SalonService({
    required this.id,
    required this.salonId,
    required this.name,
    this.description,
    required this.price,
    required this.duration,
    this.category,
    this.gender,
    this.isAvailable,
  });

  factory SalonService.fromJson(Map<String, dynamic> json) {
    return SalonService(
      id: json['id'] ?? '',
      salonId: json['salon_id'] ?? '',
      name: json['name'] ?? '',
      description: json['description'],
      price: (json['price'] as num).toDouble(),
      duration: json['duration'] ?? 0,
      category: json['category'],
      gender: json['gender'],
      isAvailable: json['is_available'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'salon_id': salonId,
      'name': name,
      'description': description,
      'price': price,
      'duration': duration,
      'category': category,
      'gender': gender,
      'is_available': isAvailable,
    };
  }
}
