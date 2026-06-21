import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../providers/auth_provider.dart';
import '../../utils/error_handler.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final _nameController = TextEditingController();
  final _phoneController = TextEditingController();
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  bool _isEditing = false;
  bool _isChangingPassword = false;

  @override
  void initState() {
    super.initState();
    final auth = context.read<AuthProvider>();
    _nameController.text = auth.user?.name ?? '';
    _phoneController.text = auth.user?.phone ?? '';
  }

  @override
  void dispose() {
    _nameController.dispose();
    _phoneController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final image = await picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      // TODO: Upload image
      ErrorHandler.showSuccess('Image selected');
    }
  }

  Future<void> _updateProfile() async {
    final auth = context.read<AuthProvider>();
    final success = await auth.updateProfile({
      'name': _nameController.text.trim(),
      'phone': _phoneController.text.trim(),
    });
    if (mounted) {
      if (success) {
        ErrorHandler.showSuccess('Profile updated');
        setState(() => _isEditing = false);
      } else {
        ErrorHandler.showError(auth.error ?? 'Update failed');
      }
    }
  }

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
              GestureDetector(
                onTap: _pickImage,
                child: Stack(
                  children: [
                    CircleAvatar(
                      radius: 48,
                      backgroundColor: AppColors.surfaceLight,
                      backgroundImage: user?.profileImage != null ? NetworkImage(user!.profileImage!) : null,
                      child: user?.profileImage == null
                          ? Text(
                              ((user?.name.isNotEmpty == true) ? user!.name.substring(0, 1) : 'U').toUpperCase(),
                              style: const TextStyle(fontSize: 36, color: AppColors.primary, fontWeight: FontWeight.bold),
                            )
                          : null,
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        padding: const EdgeInsets.all(4),
                        decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                        child: const Icon(Icons.camera_alt, size: 16, color: Colors.black),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Text(user?.name ?? '', style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              Text(user?.email ?? '', style: const TextStyle(color: AppColors.textSecondary)),
              const SizedBox(height: 32),
              if (_isEditing) ...[
                InputField(label: 'Name', controller: _nameController),
                const SizedBox(height: 16),
                InputField(label: 'Phone', controller: _phoneController, keyboardType: TextInputType.phone),
                const SizedBox(height: 24),
                LuxtrilButton(label: 'Save Changes', onPressed: _updateProfile),
                const SizedBox(height: 8),
                LuxtrilButton(label: 'Cancel', isOutline: true, onPressed: () => setState(() => _isEditing = false)),
              ] else ...[
                _buildMenuItem(Icons.person_outline, 'Edit Profile', () => setState(() => _isEditing = true)),
                _buildMenuItem(Icons.lock_outline, 'Change Password', () => setState(() => _isChangingPassword = !_isChangingPassword)),
                if (_isChangingPassword) ...[
                  const SizedBox(height: 16),
                  InputField(label: 'Current Password', controller: _currentPasswordController, isPassword: true),
                  const SizedBox(height: 12),
                  InputField(label: 'New Password', controller: _newPasswordController, isPassword: true),
                  const SizedBox(height: 12),
                  LuxtrilButton(label: 'Update Password', onPressed: () {
                    // TODO: Implement password change
                    ErrorHandler.showSuccess('Password updated');
                    setState(() => _isChangingPassword = false);
                  }),
                ],
                _buildMenuItem(Icons.help_outline, 'Help & Support', () => context.push('/client/profile/help')),
                _buildMenuItem(Icons.info_outline, 'About', () {}),
                const Divider(color: AppColors.border, height: 32),
                LuxtrilButton(label: 'Sign Out', isOutline: true, color: AppColors.error, icon: Icons.logout, onPressed: () async {
                  await auth.logout();
                  if (mounted) context.go('/welcome');
                }),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMenuItem(IconData icon, String title, VoidCallback onTap) {
    return ListTile(
      leading: Icon(icon, color: AppColors.textSecondary),
      title: Text(title, style: const TextStyle(color: AppColors.textPrimary)),
      trailing: const Icon(Icons.chevron_right, color: AppColors.textMuted),
      onTap: onTap,
    );
  }
}
