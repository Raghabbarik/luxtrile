import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../services/auth_service.dart';
import '../../utils/error_handler.dart';

class ResetPasswordScreen extends StatefulWidget {
  final String token;
  const ResetPasswordScreen({super.key, required this.token});

  @override
  State<ResetPasswordScreen> createState() => _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends State<ResetPasswordScreen> {
  final _passwordController = TextEditingController();
  final _confirmController = TextEditingController();
  final _authService = AuthService();
  bool _isLoading = false;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (_passwordController.text.isEmpty) {
      ErrorHandler.showError('Please enter a new password');
      return;
    }
    if (_passwordController.text != _confirmController.text) {
      ErrorHandler.showError('Passwords do not match');
      return;
    }

    setState(() => _isLoading = true);
    try {
      await _authService.resetPassword(widget.token, _passwordController.text);
      if (!mounted) return;
      ErrorHandler.showSuccess('Password reset successful');
      context.go('/login');
    } catch (e) {
      ErrorHandler.showError(e);
    }
    if (mounted) setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Reset Password')),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: 32),
              const Text('New Password', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              const Text('Enter your new password', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 32),
              InputField(label: 'New Password', hint: 'Enter new password', controller: _passwordController, isPassword: true),
              const SizedBox(height: 16),
              InputField(label: 'Confirm Password', hint: 'Confirm new password', controller: _confirmController, isPassword: true),
              const SizedBox(height: 32),
              LuxtrilButton(label: 'Reset Password', isLoading: _isLoading, onPressed: _submit),
            ],
          ),
        ),
      ),
    );
  }
}
