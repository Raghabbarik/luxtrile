import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/stat_card.dart';
import '../../widgets/loading.dart';
import '../../services/analytics_service.dart';
import '../../models/analytics.dart';

class OwnerAnalyticsScreen extends StatefulWidget {
  const OwnerAnalyticsScreen({super.key});

  @override
  State<OwnerAnalyticsScreen> createState() => _OwnerAnalyticsScreenState();
}

class _OwnerAnalyticsScreenState extends State<OwnerAnalyticsScreen> {
  final AnalyticsService _analyticsService = AnalyticsService();
  AnalyticsData? _data;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      _data = await _analyticsService.getOwnerAnalytics('salon-id');
    } catch (_) {}
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) return const Scaffold(body: Loading());

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Analytics')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              if (_data != null) ...[
                GridView.count(
                  crossAxisCount: 2,
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  mainAxisSpacing: 12,
                  crossAxisSpacing: 12,
                  childAspectRatio: 1.4,
                  children: [
                    StatCard(title: 'Revenue', value: '₹${_data!.totalRevenue.toStringAsFixed(0)}', icon: Icons.currency_rupee, iconColor: AppColors.success),
                    StatCard(title: 'Bookings', value: '${_data!.totalBookings}', icon: Icons.calendar_today, iconColor: AppColors.info),
                    StatCard(title: 'Customers', value: '${_data!.totalCustomers}', icon: Icons.people, iconColor: AppColors.primary),
                    StatCard(title: 'Rating', value: _data!.averageRating.toStringAsFixed(1), icon: Icons.star, iconColor: AppColors.warning),
                  ],
                ),
                const SizedBox(height: 24),
                if (_data!.revenueByDay != null) ...[
                  const Text('Revenue (Last 7 Days)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 16),
                  LuxtrilCard(
                    child: SizedBox(
                      height: 200,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceAround,
                          maxY: _data!.revenueByDay!.values.reduce((a, b) => a > b ? a : b) * 1.2,
                          barTouchData: BarTouchData(enabled: true),
                          titlesData: FlTitlesData(
                            show: true,
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(showTitles: true, getTitlesWidget: (value, _) {
                                final days = _data!.revenueByDay!.keys.toList();
                                if (value.toInt() < days.length) {
                                  return Text(days[value.toInt()].substring(0, 3), style: const TextStyle(fontSize: 10, color: AppColors.textMuted));
                                }
                                return const Text('');
                              }),
                            ),
                            leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          ),
                          gridData: FlGridData(show: false),
                          barGroups: _data!.revenueByDay!.entries.toList().asMap().entries.map((entry) {
                            return BarChartGroupData(x: entry.key, barRods: [
                              BarChartRodData(toY: entry.value.value, color: AppColors.primary, width: 16, borderRadius: const BorderRadius.vertical(top: Radius.circular(4))),
                            ]);
                          }).toList(),
                        ),
                      ),
                    ),
                  ),
                ],
                if (_data!.bookingsByDay != null) ...[
                  const SizedBox(height: 24),
                  const Text('Bookings (Last 7 Days)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 16),
                  LuxtrilCard(
                    child: SizedBox(
                      height: 200,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceAround,
                          maxY: _data!.bookingsByDay!.values.reduce((a, b) => a > b ? a : b).toDouble() * 1.2,
                          barTouchData: BarTouchData(enabled: true),
                          titlesData: FlTitlesData(
                            show: true,
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(showTitles: true, getTitlesWidget: (value, _) {
                                final days = _data!.bookingsByDay!.keys.toList();
                                if (value.toInt() < days.length) {
                                  return Text(days[value.toInt()].substring(0, 3), style: const TextStyle(fontSize: 10, color: AppColors.textMuted));
                                }
                                return const Text('');
                              }),
                            ),
                            leftTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            rightTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                            topTitles: AxisTitles(sideTitles: SideTitles(showTitles: false)),
                          ),
                          gridData: FlGridData(show: false),
                          barGroups: _data!.bookingsByDay!.entries.toList().asMap().entries.map((entry) {
                            return BarChartGroupData(x: entry.key, barRods: [
                              BarChartRodData(toY: entry.value.value.toDouble(), color: AppColors.info, width: 16, borderRadius: const BorderRadius.vertical(top: Radius.circular(4))),
                            ]);
                          }).toList(),
                        ),
                      ),
                    ),
                  ),
                ],
              ],
            ],
          ),
        ),
      ),
    );
  }
}
