class Payment {
  final String id;
  final String bookingId;
  final String? razorpayOrderId;
  final String? razorpayPaymentId;
  final double amount;
  final String currency;
  final String status;
  final String? method;
  final DateTime? createdAt;

  Payment({
    required this.id,
    required this.bookingId,
    this.razorpayOrderId,
    this.razorpayPaymentId,
    required this.amount,
    this.currency = 'INR',
    required this.status,
    this.method,
    this.createdAt,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'] ?? '',
      bookingId: json['booking_id'] ?? '',
      razorpayOrderId: json['razorpay_order_id'],
      razorpayPaymentId: json['razorpay_payment_id'],
      amount: (json['amount'] as num).toDouble(),
      currency: json['currency'] ?? 'INR',
      status: json['status'] ?? 'pending',
      method: json['method'],
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'booking_id': bookingId,
      'razorpay_order_id': razorpayOrderId,
      'razorpay_payment_id': razorpayPaymentId,
      'amount': amount,
      'currency': currency,
      'status': status,
      'method': method,
      'created_at': createdAt?.toIso8601String(),
    };
  }
}
