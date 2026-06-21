import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/loading.dart';
import '../../providers/booking_provider.dart';
import '../../utils/error_handler.dart';

class PaymentScreen extends StatefulWidget {
  final String salonId;
  const PaymentScreen({super.key, required this.salonId});

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  bool _isProcessing = false;

  Future<void> _processPayment() async {
    setState(() => _isProcessing = true);

    try {
      // Mock payment flow - in production, integrate Razorpay
      final bookingProvider = context.read<BookingProvider>();
      final booking = await bookingProvider.createBooking({
        'salon_id': widget.salonId,
        'booking_date': DateTime.now().toIso8601String(),
        'start_time': '10:00',
        'end_time': '11:00',
        'total_amount': 499,
      });

      if (!mounted) return;
      if (booking != null) {
        ErrorHandler.showSuccess('Booking confirmed!');
        context.push('/client/home/confirmation');
      }
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isProcessing = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Payment')),
      body: _isProcessing
          ? const Loading(message: 'Processing payment...')
          : SafeArea(
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 32),
                  const Icon(Icons.credit_card_outlined, size: 64, color: AppColors.primary),
                  const SizedBox(height: 24),
                  const Text('Payment Details', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                  const SizedBox(height: 24),
                  Card(
                    color: AppColors.card,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        children: [
                          _buildRow('Service Total', '₹499'),
                          const Divider(color: AppColors.border),
                          _buildRow('GST (18%)', '₹90'),
                          const Divider(color: AppColors.border),
                          _buildRow('Total Amount', '₹589', isBold: true, isHighlight: true),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Card(
                    color: AppColors.card,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    child: ListTile(
                      leading: const Icon(Icons.radio_button_checked, color: AppColors.primary),
                      title: const Text('Pay Online', style: TextStyle(color: AppColors.textPrimary)),
                      subtitle: const Text('Credit/Debit Card, UPI, Net Banking', style: TextStyle(color: AppColors.textMuted, fontSize: 12)),
                    ),
                  ),
                  const Spacer(),
                  LuxtrilButton(label: 'Pay ₹589', icon: Icons.lock_outline, onPressed: _processPayment),
                ],
              ),
            ),
          ),
    );
  }

  Widget _buildRow(String label, String value, {bool isBold = false, bool isHighlight = false}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: isBold ? AppColors.textPrimary : AppColors.textSecondary, fontWeight: isBold ? FontWeight.w600 : FontWeight.normal)),
          Text(value, style: TextStyle(fontSize: 16, color: isHighlight ? AppColors.primary : AppColors.textPrimary, fontWeight: isBold ? FontWeight.bold : FontWeight.normal)),
        ],
      ),
    );
  }
}
