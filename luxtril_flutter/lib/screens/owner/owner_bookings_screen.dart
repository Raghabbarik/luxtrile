import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/filter_chip.dart';
import '../../widgets/empty_state.dart';
import '../../widgets/loading.dart';
import '../../providers/booking_provider.dart';
import '../../services/booking_service.dart';
import '../../utils/date_helper.dart';
import '../../utils/error_handler.dart';

class OwnerBookingsScreen extends StatefulWidget {
  const OwnerBookingsScreen({super.key});

  @override
  State<OwnerBookingsScreen> createState() => _OwnerBookingsScreenState();
}

class _OwnerBookingsScreenState extends State<OwnerBookingsScreen> {
  String _selectedStatus = 'all';
  final List<String> _statuses = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];
  final BookingService _bookingService = BookingService();
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadBookings();
  }

  Future<void> _loadBookings() async {
    try {
      // In production, use salonId from auth provider
      final bookings = await _bookingService.getSalonBookings('salon-id', status: _selectedStatus == 'all' ? null : _selectedStatus);
      if (mounted) {
        setState(() => _isLoading = false);
      }
    } catch (_) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  Future<void> _updateStatus(String bookingId, String status) async {
    try {
      await _bookingService.updateBookingStatus(bookingId, status);
      ErrorHandler.showSuccess('Booking $status');
      _loadBookings();
    } catch (e) {
      ErrorHandler.showError(e);
    }
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = context.watch<BookingProvider>();
    final bookings = bookingProvider.salonBookings;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Bookings')),
      body: Column(
        children: [
          SizedBox(
            height: 44,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              itemCount: _statuses.length,
              itemBuilder: (context, index) {
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: AppFilterChip(
                    label: _statuses[index].toUpperCase(),
                    isSelected: _selectedStatus == _statuses[index],
                    onTap: () {
                      setState(() => _selectedStatus = _statuses[index]);
                      bookingProvider.fetchSalonBookings('salon-id', status: _selectedStatus == 'all' ? null : _selectedStatus);
                    },
                  ),
                );
              },
            ),
          ),
          Expanded(
            child: bookingProvider.isLoading
                ? const Loading()
                : bookings.isEmpty
                    ? const EmptyState(icon: Icons.event_busy, title: 'No bookings', subtitle: 'No bookings match the selected filter')
                    : RefreshIndicator(
                        onRefresh: () => bookingProvider.fetchSalonBookings('salon-id'),
                        color: AppColors.primary,
                        child: ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: bookings.length,
                          itemBuilder: (context, index) {
                            final booking = bookings[index];
                            return LuxtrilCard(
                              margin: const EdgeInsets.only(bottom: 12),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                    children: [
                                      Text('Booking #${booking.id.substring(0, 8)}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                                      StatusBadge(status: booking.status),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Row(children: [
                                    const Icon(Icons.calendar_today, size: 14, color: AppColors.textMuted),
                                    const SizedBox(width: 4),
                                    Text(DateHelper.formatDate(booking.bookingDate), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                                    const SizedBox(width: 12),
                                    const Icon(Icons.access_time, size: 14, color: AppColors.textMuted),
                                    const SizedBox(width: 4),
                                    Text(booking.startTime.substring(0, 5), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                                  ]),
                                  const SizedBox(height: 4),
                                  Text('${booking.services.length} service(s) • ₹${booking.totalAmount.toStringAsFixed(0)}', style: const TextStyle(color: AppColors.textMuted, fontSize: 13)),
                                  if (booking.isPending) ...[
                                    const SizedBox(height: 12),
                                    Row(
                                      children: [
                                        Expanded(
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.success, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 8)),
                                            onPressed: () => _updateStatus(booking.id, 'confirmed'),
                                            child: const Text('Confirm', style: TextStyle(fontSize: 13)),
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Expanded(
                                          child: ElevatedButton(
                                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error, foregroundColor: Colors.white, padding: const EdgeInsets.symmetric(vertical: 8)),
                                            onPressed: () => _updateStatus(booking.id, 'cancelled'),
                                            child: const Text('Cancel', style: TextStyle(fontSize: 13)),
                                          ),
                                        ),
                                      ],
                                    ),
                                  ] else if (booking.isConfirmed) ...[
                                    const SizedBox(height: 12),
                                    SizedBox(
                                      width: double.infinity,
                                      child: ElevatedButton(
                                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, foregroundColor: Colors.black, padding: const EdgeInsets.symmetric(vertical: 8)),
                                        onPressed: () => _updateStatus(booking.id, 'completed'),
                                        child: const Text('Mark Completed', style: TextStyle(fontSize: 13)),
                                      ),
                                    ),
                                  ],
                                ],
                              ),
                            );
                          },
                        ),
                      ),
          ),
        ],
      ),
    );
  }
}
