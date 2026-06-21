import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../providers/auth_provider.dart';

class OwnerProfileScreen extends StatelessWidget {
  const OwnerProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();
    final user = auth.user;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Column(
            children: [
              const SizedBox(height: 16),
              CircleAvatar(
                radius: 48,
                backgroundColor: AppColors.surfaceLight,
                backgroundImage: user?.profileImage != null ? NetworkImage(user!.profileImage!) : null,
                child: user?.profileImage == null
                    ? Text(
                        ((user?.name.isNotEmpty == true) ? user!.name.substring(0, 1) : 'O').toUpperCase(),
                        style: const TextStyle(fontSize: 36, color: AppColors.primary, fontWeight: FontWeight.bold),
                      )
                    : null,
              ),
              const SizedBox(height: 16),
              Text(user?.name ?? 'Owner', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              Text(user?.email ?? '', style: const TextStyle(color: AppColors.textSecondary)),
              const SizedBox(height: 32),
              _buildMenuItem(Icons.store_outlined, 'Salon Setup', () => context.push('/owner/profile/salon-setup')),
              _buildMenuItem(Icons.schedule_outlined, 'Slots Management', () => context.push('/owner/profile/slots')),
              _buildMenuItem(Icons.people_outline, 'Staff Management', () => context.push('/owner/profile/staff')),
              _buildMenuItem(Icons.analytics_outlined, 'Analytics', () => context.push('/owner/profile/analytics')),
              _buildMenuItem(Icons.person_outline, 'Edit Profile', () {
                // TODO: Edit profile
              }),
              const Divider(color: AppColors.border, height: 32),
              SizedBox(
                width: double.infinity,
                child: OutlinedButton.icon(
                  icon: const Icon(Icons.logout, color: AppColors.error),
                  label: const Text('Sign Out', style: TextStyle(color: AppColors.error)),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: AppColors.error),
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () async {
                    await auth.logout();
                    if (context.mounted) context.go('/welcome');
                  },
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String title, VoidCallback onTap) {
    return Card(
      color: AppColors.card,
      margin: const EdgeInsets.only(bottom: 8),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: ListTile(
        leading: Icon(icon, color: AppColors.primary),
        title: Text(title, style: const TextStyle(color: AppColors.textPrimary)),
        trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
        onTap: onTap,
      ),
    );
  }
}
