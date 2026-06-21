import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/stat_card.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/loading.dart';
import '../../providers/auth_provider.dart';
import '../../services/analytics_service.dart';
import '../../models/analytics.dart';
import '../../models/booking.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final AnalyticsService _analyticsService = AnalyticsService();
  AnalyticsData? _analytics;
  List<Booking> _todayBookings = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    final auth = context.read<AuthProvider>();
    final salonId = auth.user?.salonId;

    if (salonId == null) {
      setState(() => _isLoading = false);
      return;
    }

    try {
      _analytics = await _analyticsService.getOwnerAnalytics(salonId);
      _todayBookings = await _analyticsService.getTodayAppointments(salonId);
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: _isLoading
            ? const Loading()
            : RefreshIndicator(
                onRefresh: _loadData,
                color: AppColors.primary,
                child: SingleChildScrollView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('Welcome, ${auth.user?.name ?? 'Owner'}', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                                const SizedBox(height: 4),
                                Text('Manage your salon', style: const TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                              ],
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(color: AppColors.surfaceLight, borderRadius: BorderRadius.circular(12)),
                            child: const Icon(Icons.store, color: AppColors.primary, size: 28),
                          ),
                        ],
                      ),
                      const SizedBox(height: 24),
                      if (_analytics != null) ...[
                        GridView.count(
                          crossAxisCount: 2,
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          mainAxisSpacing: 12,
                          crossAxisSpacing: 12,
                          childAspectRatio: 1.3,
                          children: [
                            StatCard(title: 'Revenue', value: '₹${_analytics!.totalRevenue.toStringAsFixed(0)}', icon: Icons.currency_rupee, iconColor: AppColors.success),
                            StatCard(title: 'Bookings', value: '${_analytics!.totalBookings}', icon: Icons.calendar_today, iconColor: AppColors.info),
                            StatCard(title: 'Customers', value: '${_analytics!.totalCustomers}', icon: Icons.people, iconColor: AppColors.primary),
                            StatCard(title: 'Rating', value: _analytics!.averageRating.toStringAsFixed(1), icon: Icons.star, iconColor: AppColors.warning),
                          ],
                        ),
                      ],
                      const SizedBox(height: 24),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text("Today's Appointments", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                          TextButton(
                            onPressed: () => context.push('/owner/bookings'),
                            child: const Text('View All', style: TextStyle(color: AppColors.primary)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      ..._todayBookings.isEmpty
                          ? [
                              const Center(child: Text('No appointments today', style: TextStyle(color: AppColors.textMuted)))
                            ]
                          : _todayBookings.take(5).map((b) => LuxtrilCard(
                                margin: const EdgeInsets.only(bottom: 8),
                                child: Row(
                                  children: [
                                    Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                      decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                                      child: Text(b.startTime.substring(0, 5), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold)),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(child: Text('Booking #${b.id.substring(0, 8)}', style: const TextStyle(color: AppColors.textPrimary))),
                                    StatusBadge(status: b.status),
                                  ],
                                ),
                              )).toList(),
                      const SizedBox(height: 24),
                      const Text('Quick Actions', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(child: _actionCard(Icons.content_cut, 'Services', () => context.push('/owner/services'))),
                          const SizedBox(width: 12),
                          Expanded(child: _actionCard(Icons.schedule, 'Slots', () => context.push('/owner/profile/slots'))),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(child: _actionCard(Icons.people, 'Staff', () => context.push('/owner/profile/staff'))),
                          const SizedBox(width: 12),
                          Expanded(child: _actionCard(Icons.analytics, 'Analytics', () => context.push('/owner/profile/analytics'))),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
      ),
    );
  }

  Widget _actionCard(IconData icon, String label, VoidCallback onTap) {
    return LuxtrilCard(
      onTap: onTap,
      child: Column(
        children: [
          Icon(icon, color: AppColors.primary, size: 28),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
