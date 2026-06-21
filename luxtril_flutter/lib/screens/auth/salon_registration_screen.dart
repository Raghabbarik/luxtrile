import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../config/theme.dart';
import '../../widgets/luxtril_button.dart';
import '../../widgets/input_field.dart';
import '../../providers/auth_provider.dart';
import '../../utils/error_handler.dart';

class SalonRegistrationScreen extends StatefulWidget {
  const SalonRegistrationScreen({super.key});

  @override
  State<SalonRegistrationScreen> createState() => _SalonRegistrationScreenState();
}

class _SalonRegistrationScreenState extends State<SalonRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _next() async {
    if (!_formKey.currentState!.validate()) return;

    final auth = context.read<AuthProvider>();
    final success = await auth.register(
      name: _nameController.text.trim(),
      email: _emailController.text.trim(),
      phone: _phoneController.text.trim(),
      password: _passwordController.text,
      role: 'salon_owner',
    );

    if (!mounted) return;
    if (success) {
      context.push('/salon-details');
    } else {
      ErrorHandler.showError(auth.error ?? 'Registration failed');
    }
  }

  @override
  Widget build(BuildContext context) {
    final auth = context.watch<AuthProvider>();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text('Register Your Salon')),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildStepIndicator(1),
                const SizedBox(height: 24),
                const Text('Create Owner Account', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.textPrimary)),
                const SizedBox(height: 8),
                const Text('Step 1 of 4: Set up your account', style: TextStyle(fontSize: 14, color: AppColors.textSecondary)),
                const SizedBox(height: 32),
                InputField(label: 'Owner Name', hint: 'Enter your name', controller: _nameController, validator: (v) {
                  if (v == null || v.isEmpty) return 'Name is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Email', hint: 'Enter your email', controller: _emailController, keyboardType: TextInputType.emailAddress, validator: (v) {
                  if (v == null || v.isEmpty) return 'Email is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(label: 'Phone', hint: 'Enter your phone', controller: _phoneController, keyboardType: TextInputType.phone, validator: (v) {
                  if (v == null || v.isEmpty) return 'Phone is required';
                  return null;
                }),
                const SizedBox(height: 16),
                InputField(
                  label: 'Password', hint: 'Create a password', controller: _passwordController,
                  isPassword: _obscurePassword,
                  validator: (v) {
                    if (v == null || v.isEmpty) return 'Password is required';
                    if (v.length < 6) return 'At least 6 characters';
                    return null;
                  },
                  suffixIcon: IconButton(
                    icon: Icon(_obscurePassword ? Icons.visibility_off : Icons.visibility, color: AppColors.textMuted),
                    onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                  ),
                ),
                const SizedBox(height: 32),
                LuxtrilButton(label: 'Continue', isLoading: auth.isLoading, onPressed: _next),
              ],
            ),
          ),
        ),
      ),
    );
  }

      Widget _buildStepIndicator(int currentStep) {
        return Row(
          children: List.generate(4, (index) {
            final isActive = index < currentStep;
        return Expanded(
          child: Container(
            height: 4,
            margin: const EdgeInsets.symmetric(horizontal: 2),
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
        );
      }),
    );
  }
}
