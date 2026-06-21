import 'package:flutter/material.dart';
import '../../config/theme.dart';

class HelpSupportScreen extends StatelessWidget {
  const HelpSupportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Help & Support')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            const Text('Frequently Asked Questions', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: 16),
            _faqItem('How do I book an appointment?', 'Browse salons, select your services, choose a time slot, and confirm your booking.'),
            _faqItem('Can I cancel my booking?', 'Yes, you can cancel a pending booking from the Bookings screen.'),
            _faqItem('How do I make a payment?', 'We accept online payments via Razorpay. Pay securely through the app.'),
            _faqItem('Can I reschedule my appointment?', 'Please contact the salon directly for rescheduling.'),
            _faqItem('How do I leave a review?', 'After your appointment is completed, you can rate and review the salon.'),
            const SizedBox(height: 32),
            const Text('Contact Us', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
            const SizedBox(height: 16),
            _contactItem(Icons.email_outlined, 'Email', 'support@luxtril.com'),
            _contactItem(Icons.phone_outlined, 'Phone', '+91 98765 43210'),
            _contactItem(Icons.chat_outlined, 'Live Chat', 'Available 9 AM - 9 PM'),
          ],
        ),
      ),
    );
  }

  Widget _faqItem(String question, String answer) {
    return Card(
      color: AppColors.card,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ExpansionTile(
        collapsedIconColor: AppColors.textMuted,
        iconColor: AppColors.primary,
        title: Text(question, style: const TextStyle(color: AppColors.textPrimary, fontWeight: FontWeight.w500)),
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
            child: Text(answer, style: const TextStyle(color: AppColors.textSecondary, height: 1.5)),
          ),
        ],
      ),
    );
  }

  Widget _contactItem(IconData icon, String label, String value) {
    return Card(
      color: AppColors.card,
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(label, style: const TextStyle(color: AppColors.textSecondary)),
        subtitle: Text(value, style: const TextStyle(color: AppColors.textPrimary)),
      ),
    );
  }
}
