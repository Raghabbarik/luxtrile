import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/filter_chip.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/loading.dart';
import '../../providers/booking_provider.dart';
import '../../utils/date_helper.dart';

class BookingsScreen extends StatefulWidget {
  const BookingsScreen({super.key});

  @override
  State<BookingsScreen> createState() => _BookingsScreenState();
}

class _BookingsScreenState extends State<BookingsScreen> {
  String _selectedStatus = 'all';
  final List<String> _statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

  @override
  void initState() {
    super.initState();
    context.read<BookingProvider>().fetchMyBookings();
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = context.watch<BookingProvider>();
    final bookings = bookingProvider.myBookings;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text('My Bookings', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            ),
            SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _statuses.length,
                itemBuilder: (context, index) {
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: AppFilterChip(
                      label: _statuses[index].toUpperCase(),
                      isSelected: _selectedStatus == _statuses[index],
                      onTap: () {
                        setState(() => _selectedStatus = _statuses[index]);
                        bookingProvider.fetchMyBookings(status: _selectedStatus == 'all' ? null : _selectedStatus);
                      },
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: bookingProvider.isLoading
                  ? const Loading()
                  : bookings.isEmpty
                      ? const EmptyState(icon: Icons.event_busy, title: 'No bookings yet', subtitle: 'Book your first appointment')
                      : RefreshIndicator(
                          onRefresh: () => bookingProvider.fetchMyBookings(),
                          color: AppColors.primary,
                          child: ListView.builder(
                            padding: const EdgeInsets.all(16),
                            itemCount: bookings.length,
                            itemBuilder: (context, index) {
                              final booking = bookings[index];
                              return LuxtrilCard(
                                margin: const EdgeInsets.only(bottom: 16),
                                onTap: () => context.push('/client/bookings/${booking.id}'),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Expanded(
                                          child: Text(booking.salonName ?? 'Salon', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                                        ),
                                        StatusBadge(status: booking.status),
                                      ],
                                    ),
                                    const SizedBox(height: 12),
                                    Row(children: [
                                      const Icon(Icons.calendar_today, size: 14, color: AppColors.textMuted),
                                      const SizedBox(width: 6),
                                      Text(DateHelper.formatDate(booking.bookingDate), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                                      const SizedBox(width: 16),
                                      const Icon(Icons.access_time, size: 14, color: AppColors.textMuted),
                                      const SizedBox(width: 6),
                                      Text(booking.startTime.substring(0, 5), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                                    ]),
                                    const SizedBox(height: 8),
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text('${booking.services.length} service(s)', style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
                                        Text('₹${booking.totalAmount.toStringAsFixed(0)}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary)),
                                      ],
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ),
            ),
          ],
        ),
      ),
    );
  }
}
