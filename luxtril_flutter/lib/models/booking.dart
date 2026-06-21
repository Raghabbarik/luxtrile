import 'service.dart';

class Booking {
  final String id;
  final String userId;
  final String salonId;
  final String? salonName;
  final String? staffId;
  final String? staffName;
  final List<SalonService> services;
  final DateTime bookingDate;
  final String startTime;
  final String endTime;
  final double totalAmount;
  final String status;
  final String? paymentStatus;
  final String? notes;
  final DateTime? createdAt;

  Booking({
    required this.id,
    required this.userId,
    required this.salonId,
    this.salonName,
    this.staffId,
    this.staffName,
    this.services = const [],
    required this.bookingDate,
    required this.startTime,
    required this.endTime,
    required this.totalAmount,
    required this.status,
    this.paymentStatus,
    this.notes,
    this.createdAt,
  });

  factory Booking.fromJson(Map<String, dynamic> json) {
    return Booking(
      id: json['id'] ?? '',
      userId: json['user_id'] ?? '',
      salonId: json['salon_id'] ?? '',
      salonName: json['salon_name'],
      staffId: json['staff_id'],
      staffName: json['staff_name'],
      services: json['services'] != null
          ? (json['services'] as List).map((s) => SalonService.fromJson(s)).toList()
          : [],
      bookingDate: DateTime.parse(json['booking_date'] ?? DateTime.now().toIso8601String()),
      startTime: json['start_time'] ?? '',
      endTime: json['end_time'] ?? '',
      totalAmount: (json['total_amount'] as num?)?.toDouble() ?? 0,
      status: json['status'] ?? 'pending',
      paymentStatus: json['payment_status'],
      notes: json['notes'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'salon_id': salonId,
      'salon_name': salonName,
      'staff_id': staffId,
      'staff_name': staffName,
      'services': services.map((s) => s.toJson()).toList(),
      'booking_date': bookingDate.toIso8601String(),
      'start_time': startTime,
      'end_time': endTime,
      'total_amount': totalAmount,
      'status': status,
      'payment_status': paymentStatus,
      'notes': notes,
      'created_at': createdAt?.toIso8601String(),
    };
  }

  bool get isPending => status == 'pending';
  bool get isConfirmed => status == 'confirmed';
  bool get isCompleted => status == 'completed';
  bool get isCancelled => status == 'cancelled';
}
