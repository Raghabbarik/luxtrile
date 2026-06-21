class AnalyticsData {
  final double totalRevenue;
  final int totalBookings;
  final int totalCustomers;
  final double averageRating;
  final Map<String, double>? revenueByDay;
  final Map<String, int>? bookingsByDay;
  final Map<String, double>? revenueByService;
  final int? pendingApprovals;
  final int? totalSalons;
  final int? totalUsers;

  AnalyticsData({
    this.totalRevenue = 0,
    this.totalBookings = 0,
    this.totalCustomers = 0,
    this.averageRating = 0,
    this.revenueByDay,
    this.bookingsByDay,
    this.revenueByService,
    this.pendingApprovals,
    this.totalSalons,
    this.totalUsers,
  });

  factory AnalyticsData.fromJson(Map<String, dynamic> json) {
    return AnalyticsData(
      totalRevenue: (json['total_revenue'] as num?)?.toDouble() ?? 0,
      totalBookings: json['total_bookings'] ?? 0,
      totalCustomers: json['total_customers'] ?? 0,
      averageRating: (json['average_rating'] as num?)?.toDouble() ?? 0,
      revenueByDay: json['revenue_by_day'] != null
          ? Map<String, double>.from(json['revenue_by_day'].map((k, v) => MapEntry(k, (v as num).toDouble())))
          : null,
      bookingsByDay: json['bookings_by_day'] != null
          ? Map<String, int>.from(json['bookings_by_day'].map((k, v) => MapEntry(k, v as int)))
          : null,
      revenueByService: json['revenue_by_service'] != null
          ? Map<String, double>.from(json['revenue_by_service'].map((k, v) => MapEntry(k, (v as num).toDouble())))
          : null,
      pendingApprovals: json['pending_approvals'],
      totalSalons: json['total_salons'],
      totalUsers: json['total_users'],
    );
  }
}
