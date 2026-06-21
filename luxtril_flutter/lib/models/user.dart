class User {
  final String id;
  final String name;
  final String email;
  final String phone;
  final String role;
  final String? profileImage;
  final String? salonId;
  final bool? isApproved;
  final DateTime? createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.phone,
    required this.role,
    this.profileImage,
    this.salonId,
    this.isApproved,
    this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      role: json['role'] ?? 'customer',
      profileImage: json['profile_image'],
      salonId: json['salon_id'],
      isApproved: json['is_approved'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'phone': phone,
      'role': role,
      'profile_image': profileImage,
      'salon_id': salonId,
      'is_approved': isApproved,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  bool get isAdmin => role == 'admin';
  bool get isSalonOwner => role == 'salon_owner';
  bool get isCustomer => role == 'customer';
}
