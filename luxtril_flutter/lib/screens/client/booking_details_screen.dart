import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_rating_bar/flutter_rating_bar.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/luxtril_card.dart';
import '../../widgets/status_badge.dart';
import '../../widgets/loading.dart';
import '../../providers/booking_provider.dart';
import '../../services/review_service.dart';
import '../../utils/date_helper.dart';
import '../../utils/error_handler.dart';

class BookingDetailsScreen extends StatefulWidget {
  final String bookingId;
  const BookingDetailsScreen({super.key, required this.bookingId});

  @override
  State<BookingDetailsScreen> createState() => _BookingDetailsScreenState();
}

class _BookingDetailsScreenState extends State<BookingDetailsScreen> {
  final ReviewService _reviewService = ReviewService();
  bool _showReviewForm = false;
  double _rating = 5;
  final _commentController = TextEditingController();
  bool _isSubmittingReview = false;

  @override
  void dispose() {
    _commentController.dispose();
    super.dispose();
  }

  Future<void> _submitReview() async {
    setState(() => _isSubmittingReview = true);
    try {
      await _reviewService.createReview({
        'booking_id': widget.bookingId,
        'rating': _rating,
        'comment': _commentController.text.trim(),
      });
      if (!mounted) return;
      ErrorHandler.showSuccess('Review submitted!');
      setState(() => _showReviewForm = false);
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isSubmittingReview = false);
  }

  @override
  Widget build(BuildContext context) {
    final bookingProvider = context.watch<BookingProvider>();
    final booking = bookingProvider.myBookings.where((b) => b.id == widget.bookingId).firstOrNull;

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Booking Details')),
      body: booking == null
          ? const Loading()
          : SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    LuxtrilCard(
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              const Text('Status', style: TextStyle(color: AppColors.textSecondary)),
                              StatusBadge(status: booking.status),
                            ],
                          ),
                          const Divider(color: AppColors.border),
                          _infoRow('Salon', booking.salonName ?? 'N/A'),
                          _infoRow('Date', DateHelper.formatDate(booking.bookingDate)),
                          _infoRow('Time', '${booking.startTime.substring(0, 5)} - ${booking.endTime.substring(0, 5)}'),
                          _infoRow('Staff', booking.staffName ?? 'Any available'),
                          _infoRow('Services', booking.services.map((s) => s.name).join(', ')),
                          _infoRow('Total', '₹${booking.totalAmount.toStringAsFixed(0)}'),
                        ],
                      ),
                    ),
                    if (booking.isPending) ...[
                      const SizedBox(height: 16),
                      LuxtrilButton(label: 'Cancel Booking', isOutline: true, color: AppColors.error, icon: Icons.cancel_outlined, onPressed: () async {
                        final confirm = await showDialog<bool>(
                          context: context,
                          builder: (ctx) => AlertDialog(
                            backgroundColor: AppColors.surface,
                            title: const Text('Cancel Booking?', style: TextStyle(color: AppColors.textPrimary)),
                            content: const Text('This action cannot be undone.', style: TextStyle(color: AppColors.textSecondary)),
                            actions: [
                              TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('No')),
                              TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Yes, Cancel', style: TextStyle(color: AppColors.error))),
                            ],
                          ),
                        );
                        if (confirm == true) {
                          await bookingProvider.cancelBooking(widget.bookingId);
                        }
                      }),
                    ],
                    if (booking.isCompleted && !_showReviewForm) ...[
                      const SizedBox(height: 16),
                      LuxtrilButton(label: 'Write a Review', icon: Icons.star_outline, onPressed: () => setState(() => _showReviewForm = true)),
                    ],
                    if (_showReviewForm) ...[
                      const SizedBox(height: 16),
                      LuxtrilCard(
                        child: Column(
                          children: [
                            const Text('Rate your experience', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                            const SizedBox(height: 12),
                            RatingBar.builder(
                              initialRating: _rating,
                              minRating: 1,
                              direction: Axis.horizontal,
                              allowHalfRating: true,
                              itemCount: 5,
                              itemSize: 36,
                              itemBuilder: (_, _) => const Icon(Icons.star, color: AppColors.primary),
                              onRatingUpdate: (r) => _rating = r,
                            ),
                            const SizedBox(height: 16),
                            TextField(
                              controller: _commentController,
                              maxLines: 3,
                              decoration: const InputDecoration(hintText: 'Share your experience...'),
                              style: const TextStyle(color: AppColors.textPrimary),
                            ),
                            const SizedBox(height: 16),
                            LuxtrilButton(label: 'Submit Review', isLoading: _isSubmittingReview, onPressed: _submitReview),
                          ],
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(width: 80, child: Text(label, style: const TextStyle(color: AppColors.textSecondary))),
          Expanded(child: Text(value, style: const TextStyle(color: AppColors.textPrimary))),
        ],
      ),
    );
  }
}
