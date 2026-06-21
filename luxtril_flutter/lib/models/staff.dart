class Staff {
  final String id;
  final String salonId;
  final String name;
  final String? position;
  final String? phone;
  final String? email;
  final String? image;
  final bool? isAvailable;
  final List<String> serviceIds;
  final DateTime? createdAt;

  Staff({
    required this.id,
    required this.salonId,
    required this.name,
    this.position,
    this.phone,
    this.email,
    this.image,
    this.isAvailable,
    this.serviceIds = const [],
    this.createdAt,
  });

  factory Staff.fromJson(Map<String, dynamic> json) {
    return Staff(
      id: json['id'] ?? '',
      salonId: json['salon_id'] ?? '',
      name: json['name'] ?? '',
      position: json['position'],
      phone: json['phone'],
      email: json['email'],
      image: json['image'],
      isAvailable: json['is_available'],
      serviceIds: json['service_ids'] != null ? List<String>.from(json['service_ids']) : [],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'salon_id': salonId,
      'name': name,
      'position': position,
      'phone': phone,
      'email': email,
      'image': image,
      'is_available': isAvailable,
      'service_ids': serviceIds,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
