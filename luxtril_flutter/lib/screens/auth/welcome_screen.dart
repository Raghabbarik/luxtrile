import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const Spacer(flex: 2),
              const Icon(Icons.content_cut, size: 100, color: AppColors.primary),
              const SizedBox(height: 24),
              const Text(
                'Luxtril',
                style: TextStyle(
                  fontSize: 48,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                  letterSpacing: 4,
                ),
              ),
              const SizedBox(height: 12),
              const Text(
                'Premium Salon Booking Experience',
                style: TextStyle(
                  fontSize: 16,
                  color: AppColors.textSecondary,
                  letterSpacing: 1,
                ),
              ),
              const Spacer(flex: 2),
              LuxtrilButton(
                label: 'Book an Appointment',
                icon: Icons.calendar_today,
                onPressed: () => context.push('/login'),
              ),
              const SizedBox(height: 12),
              LuxtrilButton(
                label: 'Partner with Us',
                isOutline: true,
                icon: Icons.store,
                onPressed: () => context.push('/owner-login'),
              ),
              const SizedBox(height: 24),
              TextButton(
                onPressed: () => context.push('/signup'),
                child: const Text(
                  "Don't have an account? Sign Up",
                  style: TextStyle(color: AppColors.primary),
                ),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }
}
