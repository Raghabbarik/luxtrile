import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';

class BookingConfirmationScreen extends StatelessWidget {
  const BookingConfirmationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.check_circle_outline, size: 100, color: AppColors.success),
              const SizedBox(height: 24),
              const Text(
                'Booking Confirmed!',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
              ),
              const SizedBox(height: 12),
              const Text(
                'Your appointment has been booked successfully.',
                style: TextStyle(fontSize: 16, color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 8),
              const Text(
                'You will receive a confirmation shortly.',
                style: TextStyle(fontSize: 14, color: AppColors.textMuted),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 48),
              LuxtrilButton(
                label: 'View My Bookings',
                icon: Icons.calendar_today,
                onPressed: () => context.go('/client/bookings'),
              ),
              const SizedBox(height: 12),
              LuxtrilButton(
                label: 'Back to Home',
                isOutline: true,
                onPressed: () => context.go('/client/home'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
